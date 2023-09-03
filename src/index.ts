import { DEFAULT_PORT, THIS_URI } from "./constants";
import { State, decodeState, encodeState } from "./state";
import { Args_start, HttpServer_WrapperCallback } from "./wrap";
import { Args_main, Args_run, Args_runStep, ModuleBase, Step } from "./wrap";

export class Module extends ModuleBase {
  run(args: Args_run): Step {
    const state: State = {
      index: 0,
      finished: false
    };

    const result = {
      state: encodeState(state),
      output: `Agent says: I started with goal: ${args.goal}`
    }

    return result;
  }
  runStep(args: Args_runStep): Step {
    const state = decodeState(args.state);

    state.index++;

    if (state.index > 5) {
      state.finished = true;

      return {
        state: encodeState(state),
        output: "Agent says: I finished"
      }
    }

    return {
      state: encodeState(state),
      output: `Agent says: ${state.index} step`
    };
  }
  main(args: Args_main): number {
    let port: number;
    if (args.args.length > 0) {
        port = parseInt(args.args[0]);
        if (isNaN(port)) {
            port = DEFAULT_PORT;
        }
    } else {
        port = DEFAULT_PORT;
    }

    const onStart: HttpServer_WrapperCallback = {
      uri: THIS_URI,
      method: "onStart"
    }

    const serverStartArgs: Args_start = {
      port,
      requestTimeout: 10000,
      routes: [],
      onStart
    }

    return 0;
  }
}
