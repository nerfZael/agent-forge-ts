import { AgentChatMessage } from "./agent-function";

export type Result<TReturn, TError> = { ok: true, value: TReturn } | { ok: false, value: TError }

export abstract class Agent {
  abstract run(
    namespace: string, 
    description: string,
    args: string,
  ): AsyncGenerator<StepOutput, RunResult, string | undefined>;
}

export type RunResult = Result<undefined, string>; 

export enum PromptType {
  None,
  Prompt,
  Question,
}

export class StepOutput {
  message: AgentChatMessage;
  promptType: PromptType;

  constructor(message: AgentChatMessage, promptType?: PromptType) {
    this.message = message;
    this.promptType = promptType ?? PromptType.None;
  }

  static message(msg: AgentChatMessage): StepOutput {
    return new StepOutput(msg);
  }

  static prompt(msg: AgentChatMessage): StepOutput {
    return new StepOutput(msg, PromptType.Prompt);
  }

  static question(msg: AgentChatMessage): StepOutput {
    return new StepOutput(msg, PromptType.Question);
  }
}
