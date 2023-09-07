import { Artifact, Status, Step, StepRequestBody, Task, TaskRequestBody } from "./protocolTypes";
import { uuidv4 } from "./utils";
import { KeyValueStore_Module } from "./wrap";

enum StoreKey {
  Tasks = "tasks",
}

interface PaginationOpts {
  page: number;
  pageSize: number;
}

export class ProtocolStore {
  private _store = KeyValueStore_Module;

  paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }

  createTask(taskRequest: TaskRequestBody) {
    const task: Task = {
      task_id: uuidv4(),
      input: taskRequest.input,
      additional_input: taskRequest.additional_input,
      artifacts: [],
      steps: [],
      created_at: Date.now().toString(),
      modified_at: Date.now().toString(),
    };

    this.addTask(task);

    return task;
  }

  addTask(task: Task) {
    const allTasks = this.getTasks();
    allTasks.push(task);

    const result = this._store.set({
      key: StoreKey.Tasks,
      value: this.encode(allTasks),
    })

    if (!result.ok) {
      throw new Error(`Error setting key '${StoreKey.Tasks}' in store`);
    }
  }

  getTasks(opts?: PaginationOpts): Task[] {
    const result = this._store.get({
      key: StoreKey.Tasks,
    });

    if (!result.ok) {
      throw new Error(`Error getting key '${StoreKey.Tasks}' from store`);
    }

    if (!result.value) {
      return [];
    }

    const tasks = this.decode<Task[]>(result.value);
    return opts ? this.paginate(tasks, opts.page, opts.pageSize) : tasks;
  }

  getTaskById(id: string): Task | undefined {
    const tasks = this.getTasks();

    return tasks.find((task) => task.task_id === id);
  }

  createStep(taskId: string, stepArgs: StepRequestBody, isLast: boolean) {
    const step: Step = {
      created_at: Date.now().toString(),
      modified_at: Date.now().toString(),
      task_id: taskId,
      step_id: uuidv4(),
      name: stepArgs.name,
      status: Status.created,
      input: stepArgs.input,
      additional_input: undefined,
      output: null,
      additional_output: undefined,
      artifacts: [],
      is_last: isLast,
    }

    this.addStepToTask(taskId, step);

    return step;
  }

  addStepToTask(
    taskId: string,
    step: Step,
  ): Step {
    const task = this.getTaskById(taskId);
    
    if (!task) {
      throw new Error(`Task with id '${taskId}' not found`);
    }

    task.steps.push(step);
    this.updateTask(task);

    return step;
  }

  updateStep(taskId: string, stepId: string, step: Step) {
    const task = this.getTaskById(taskId);

    if (!task) {
      throw new Error(`Task with id '${step.task_id}' not found`);
    }

    const index = task.steps.findIndex((s) => s.step_id === stepId);
    task.steps[index] = step;

    this.updateTask(task);

    return step;
  }

  addArtifactToTask(taskId: string, artifact: Artifact) {
    const task = this.getTaskById(taskId);

    if (!task) {
      throw new Error(`Task with id '${taskId}' not found`);
    }

    task.artifacts.push(artifact);

    this.updateTask(task);
  }

  createArtifact(args: {
    taskId: string;
    fileName: string;
    relativePath: string;
    agentCreated: boolean;
  }) {
    const artifact: Artifact = {
      artifact_id: uuidv4(),
      agent_created: args.agentCreated,
      created_at: Date.now().toString(),
      modified_at: Date.now().toString(),
      relative_path: args.relativePath,
      file_name: args.fileName,
    };

    this.addArtifactToTask(args.taskId, artifact);

    return artifact;
  }

  getArtifactById(taskId: string, artifactId: string): Artifact | undefined {
    const task = this.getTaskById(taskId);

    if (!task) {
      return undefined;
    }

    return task.artifacts.find((artifact) => artifact.artifact_id === artifactId);
  }

  updateTask(task: Task) {
    const allTasks = this.getTasks();
    const index = allTasks.findIndex((t) => t.task_id === task.task_id);
    allTasks[index] = task;

    const result = this._store.set({
      key: StoreKey.Tasks,
      value: this.encode(allTasks),
    })

    if (!result.ok) {
      throw new Error(`Error setting key '${StoreKey.Tasks}' in store`);
    }
  }

  private encode(value: any) {
    const json = JSON.stringify(value);
    const uint8Array = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      uint8Array[i] = json.charCodeAt(i);
    }
    return uint8Array.buffer;
  }

  private decode<T>(arrayBuffer: ArrayBuffer): T {
    const uint8Array = new Uint8Array(arrayBuffer);
    return JSON.parse(String.fromCharCode.apply(null, uint8Array));
  }
}
