import { BigInt, BigNumber, JSONString, Bytes } from "./common";
import * as Types from "./types";

export class Args_main {
  args: Array<string>;
}

export class Args_run {
  goal: string;
}

export class Args_runStep {
  input: string | null;
  state: JSONString;
}

export abstract class ModuleBase {
  abstract main(
    args: Args_main
  ): number;

  abstract run(
    args: Args_run
  ): Types.Step;

  abstract runStep(
    args: Args_runStep
  ): Types.Step;
}
