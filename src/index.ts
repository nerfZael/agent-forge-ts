import { Args_main, Args_run, Args_runStep, ModuleBase, Step } from "./wrap";

class State {
  index = 0;
  finished: boolean = false;
}

const encode = (state: State): string => {
  return JSON.stringify(state);
}

const decode = (stateString: string): State => {
  return JSON.parse(stateString);
}

export class Module extends ModuleBase {
  run(args: Args_run): Step {
    const state = new State();

    const result = {
      state: encode(state),
      output: `Agent says: I started with goal: ${args.goal}`
    }

    return result;
  }
  runStep(args: Args_runStep): Step {
    const state = decode(args.state);

    state.index++;

    if (state.index > 5) {
      state.finished = true;

      return {
        state: encode(state),
        output: "Agent says: I finished"
      }
    }

    return {
      state: encode(state),
      output: `Agent says: ${state.index} step`
    };
  }
  main(args: Args_main): number {
    throw new Error("Method not implemented.");
  }
}
