import { Task, TaskRequestBody } from "./protocolTypes";
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
      taskId: uuidv4(),
      input: taskRequest.input,
      additionalInput: taskRequest.additionalInput,
      artifacts: [],
      createdAt: Date.now().toString(),
      modifiedAt: Date.now().toString(),
    }

    this.addTask(task);

    return task;
  }

  addTask(task: Task) {
    this.push({
      key: StoreKey.Tasks,
      value: task,
    });
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

    return tasks.find((task) => task.taskId === id);
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

  private push({ key, value }: { key: string; value: any }) {
    const getResult = this._store.get({
      key,
    });

    if (getResult.ok) {
      const existingValue = getResult.value;

      if (existingValue) {
        const decodedValue = this.decode(existingValue);

        if (!Array.isArray(decodedValue)) {
          throw new Error(
            `Tried to push to key '${key}' but existing value is not an array`
          );
        }

        const result = this._store.set({
          key,
          value: this.encode([...decodedValue, value]),
        });

        if (!result.ok) {
          throw new Error(`Error setting key '${key}' in store`);
        }

        return result.value;
      }

      const result = this._store.set({
        key,
        value: this.encode([value]),
      });

      if (!result.ok) {
        throw new Error(`Error setting key '${key}' in store`);
      }

      return result.value;
    }

    throw new Error(`Error getting key '${key}' from store`);
  }
}
