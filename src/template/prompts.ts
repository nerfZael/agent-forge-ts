import { Prompts } from "../sdk/agent/prompts";

export const PROMPTS: Prompts = {
  INITIAL: () => "",
  GOAL: () => "",
  UNDEFINED_FUNCTION_NAME: () => "",
  FUNCTION_NOT_FOUND: (name) => "",
  UNDEFINED_FUNCTION_ARGS: (name) => "",
  UNPARSABLE_FUNCTION_ARGS: (name, args, err) => "",
}