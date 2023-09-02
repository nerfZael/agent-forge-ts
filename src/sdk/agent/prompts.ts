export interface Prompts {
  INITIAL: () => string,
  GOAL: () => string,
  UNDEFINED_FUNCTION_NAME: () => string,
  FUNCTION_NOT_FOUND: (name: string) => string,
  UNDEFINED_FUNCTION_ARGS: (name: string) => string,
  UNPARSABLE_FUNCTION_ARGS: (name: string, args: any, err: string) => string,
}