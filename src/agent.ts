import { Status, StepRequestBody } from "./protocolTypes";
import { ProtocolStore } from "./store";

export class Agent {
  constructor(private _store: ProtocolStore) {}

  runNextStep(taskId: string, stepRequest: StepRequestBody) {
    const task = this._store.getTaskById(taskId);

    if (!task) {
      throw new Error(`Task with id '${taskId}' not found`);
    }

    const step = this._store.createStep(taskId, stepRequest, true);
    return this._store.updateStep(taskId, step.step_id, {
      ...step,
      status: Status.completed,
      output: "Primary feedback...",
      additional_output: "Additional feedback...",
    })
  }
}
