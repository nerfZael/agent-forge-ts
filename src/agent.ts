import { PaginationOpts, ProtocolStore, StoreKey } from "./store";
import {
  Artifact,
  Status,
  Step,
  StepRequestBody,
  Task,
  TaskRequestBody,
} from "./protocolTypes";
import { uuidv4 } from "./utils";

export class Agent {
  constructor(private _store: ProtocolStore) {}

  runNextStep(taskId: string, stepRequest: StepRequestBody) {
    const task = this.getTaskById(taskId);

    if (!task) {
      throw new Error(`Task with id '${taskId}' not found`);
    }

    const step = this.createStep(taskId, stepRequest, true);
    return this.updateStep(taskId, step.step_id, {
      ...step,
      status: Status.completed,
      output: "Primary feedback...",
      additional_output: "Additional feedback...",
    });
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

    this._store.set({
      key: StoreKey.Tasks,
      value: allTasks,
    });
  }

  getTasks(opts?: PaginationOpts): Task[] {
    const tasks = this._store.get<Task[]>(StoreKey.Tasks);

    if (!tasks) {
      return [];
    }

    return opts
      ? ProtocolStore.paginate(tasks, opts.page, opts.pageSize)
      : tasks;
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
    };

    this.addStepToTask(taskId, step);

    return step;
  }

  addStepToTask(taskId: string, step: Step): Step {
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

    return task.artifacts.find(
      (artifact) => artifact.artifact_id === artifactId
    );
  }

  updateTask(task: Task) {
    const allTasks = this.getTasks();
    const index = allTasks.findIndex((t) => t.task_id === task.task_id);
    allTasks[index] = task;

    this._store.set({
      key: StoreKey.Tasks,
      value: allTasks,
    });
  }
}
