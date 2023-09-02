import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { Workspace, Logger } from "../sys";
import { LlmApi, Chat } from "../llm";
import JSON5 from "json5";
import { Prompts } from "./prompts";

export interface AgentContext {
  globals: Record<string, string>;
  workspace: Workspace;
  llm: LlmApi;
  chat: Chat;
  logger: Logger;
}

export type AgentFunctionResult = Result<string, any>; 

export interface AgentChatMessage {
  type: "success" | "error" | "info" | "warning",
  title: string,
  content?: string,
}

export interface AgentFunction {
  definition: any;
  buildChatMessage(args: any, result: AgentFunctionResult): AgentChatMessage;
  buildExecutor(
    context: AgentContext
  ): (options: any) => Promise<any>;
}

export type ExecuteAgentFunction = (
  name: string | undefined,
  args: string | undefined,
  context: AgentContext,
  agentFunctions: AgentFunction[],
  prompts: Prompts
) => Promise<Result<AgentChatMessage, string>>;

export const executeAgentFunction: ExecuteAgentFunction = async (
  name: string | undefined,
  args: string | undefined,
  context: AgentContext,
  agentFunctions: AgentFunction[],
  prompts: Prompts
): Promise<Result<AgentChatMessage, string>> => {
  const parseResult = processFunctionAndArgs(name, args, agentFunctions, prompts);

  if (!parseResult.ok) {
    return ResultErr(parseResult.error);
  }

  const [fnArgs, func] = parseResult.value;

  const executor = func.buildExecutor(context);

  const result = await executor(fnArgs);

  return ResultOk(func.buildChatMessage(fnArgs, result));
}

function processFunctionAndArgs(
  name: string | undefined,
  args: string | undefined,
  agentFunctions: AgentFunction[],
  prompts: Prompts
): Result<[any, AgentFunction], string> {
  if (!name) {
    return ResultErr(prompts.UNDEFINED_FUNCTION_NAME());
  }

  const func = agentFunctions.find((f) => f.definition.name === name);
  if (!func) {
    return ResultErr(prompts.FUNCTION_NOT_FOUND(name));
  }

  if (!args) {
    return ResultErr(prompts.UNDEFINED_FUNCTION_ARGS(name));
  }

  let fnArgs;
  try {
    fnArgs = args
      ? JSON5.parse(args)
      : undefined;
  } catch(err: any) {
    return ResultErr(prompts.UNPARSABLE_FUNCTION_ARGS(name, args, err));
  }

  return ResultOk([fnArgs, func]);
}