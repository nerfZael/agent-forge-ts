import { DEFAULT_PORT, THIS_URI } from "./constants";
import { State, decodeState, encodeState } from "./state";
import { stringToArrayBuffer } from "./utils";
import { Args_onStart, Args_routeGetAgentTasks, Args_routeGetAgentTasksById, Args_routeGetAgentTasksByIdArtifacts, Args_routeGetAgentTasksByIdArtifactsById, Args_routeGetAgentTasksByIdSteps, Args_routeGetAgentTasksByIdStepsById, Args_routeGetHearbeat, Args_routeGetRoot, Args_routePostAgentTasks, Args_routePostAgentTasksByIdArtifacts, Args_routePostAgentTasksByIdSteps, Args_start, HttpServer_Response, HttpServer_WrapperCallback } from "./wrap";
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

    // const onStart: HttpServer_WrapperCallback = {
    //   uri: THIS_URI,
    //   method: "onStart"
    // }

    const serverStartArgs: Args_start = {
      port,
      requestTimeout: 10000,
      routes: [

      ],
      onStart: null
    }

    return 0;
  }

  onStart(args: Args_onStart): boolean {
    throw new Error("Method not implemented.");
  }
  
  routeGetRoot(args: Args_routeGetRoot): HttpServer_Response {
    return {
      statusCode: 200,
      headers: [
          {
              key: "Content-Type",
              value: "text/html",
          },
      ],
      data: stringToArrayBuffer("Welcome to the Auto-GPT Forge"),
  };
  }
  
  routeGetHearbeat(args: Args_routeGetHearbeat): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routePostAgentTasks(args: Args_routePostAgentTasks): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasks(args: Args_routeGetAgentTasks): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasksById(args: Args_routeGetAgentTasksById): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasksByIdSteps(args: Args_routeGetAgentTasksByIdSteps): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routePostAgentTasksByIdSteps(args: Args_routePostAgentTasksByIdSteps): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasksByIdStepsById(args: Args_routeGetAgentTasksByIdStepsById): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasksByIdArtifacts(args: Args_routeGetAgentTasksByIdArtifacts): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routePostAgentTasksByIdArtifacts(args: Args_routePostAgentTasksByIdArtifacts): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
  
  routeGetAgentTasksByIdArtifactsById(args: Args_routeGetAgentTasksByIdArtifactsById): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
}
