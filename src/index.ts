import { DEFAULT_PORT, THIS_URI } from "./constants";
import { Prompts } from "./prompts";
import { TaskRequestBody } from "./protocolTypes";
import { State, decodeState, encodeState } from "./state";
import { ProtocolStore } from "./store";
import { objectToArrayBuffer, stringToArrayBuffer } from "./utils";
import { Args_onStart, Args_routeGetAgentTasks, Args_routeGetAgentTasksById, Args_routeGetAgentTasksByIdArtifacts, Args_routeGetAgentTasksByIdArtifactsById, Args_routeGetAgentTasksByIdSteps, Args_routeGetAgentTasksByIdStepsById, Args_routeGetHearbeat, Args_routeGetRoot, Args_routePostAgentTasks, Args_routePostAgentTasksByIdArtifacts, Args_routePostAgentTasksByIdSteps, Args_start, HttpServer_HttpMethod, HttpServer_Module, HttpServer_Response, HttpServer_WrapperCallback } from "./wrap";
import { Args_main, Args_run, Args_runStep, ModuleBase, Step } from "./wrap";

export class Module extends ModuleBase {
  run(args: Args_run): Step {
    const state: State = {
      index: 0,
      finished: false
    };

    const prompts = new Prompts();
  
    const result = {
      state: encodeState(state),
      output: `My goal is: ${args.goal}, My prompt is: ${prompts.list()[0].value}`
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
        {
          path: "/",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetRoot"
          }
        },
        {
          path: "/heartbeat",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetHearbeat"
          }
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasks"
          }
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasks"
          }
        },
        {
          path: "/agent/tasks/:task_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksById"
          }
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdSteps"
          }
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasksByIdSteps"
          }
        },
        {
          path: "/agent/tasks/:task_id/steps/:step_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdStepsById"
          }
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdArtifacts"
          }
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasksByIdArtifacts"
          }
        },
        {
          path: "/agent/tasks/:task_id/artifacts/:artifact_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdArtifactsById"
          }
        },
      ],
      onStart: null
    }

    const serverStartResult = HttpServer_Module.start(serverStartArgs);

    if (!serverStartResult.ok) {
      throw new Error(serverStartResult.error)
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
              value: "text/plain",
          },
      ],
      data: stringToArrayBuffer("Welcome to the Auto-GPT Forge"),
    };
  }
  
  routeGetHearbeat(args: Args_routeGetHearbeat): HttpServer_Response {
    return {
      statusCode: 200,
      headers: [
          {
              key: "Content-Type",
              value: "text/plain",
          },
      ],
      data: stringToArrayBuffer("Server is running."),
    };
  }
  
  routePostAgentTasks(args: Args_routePostAgentTasks): HttpServer_Response {
    if (args.request.body === null) {
      throw new Error("Request body is null")
    }

    const taskRequestBody: TaskRequestBody = JSON.parse(args.request.body);
    const store = new ProtocolStore();

    const createdTask = store.createTask(taskRequestBody)

    return {
      statusCode: 200,
      headers: [
          {
              key: "Content-Type",
              value: "application/json",
          },
      ],
      data: objectToArrayBuffer(createdTask),
    };
  }
  
  routeGetAgentTasks(args: Args_routeGetAgentTasks): HttpServer_Response {
    const queryParams = args.request.query
    const page = queryParams.find((param) => param.key === "page")?.value
    const pageSize = queryParams.find((param) => param.key === "page_size")?.value

    const store = new ProtocolStore();

    const allTasks = store.getTasks()
    const paginatedTasks = page && pageSize ? 
      store.paginate(allTasks, parseInt(page), parseInt(pageSize)): allTasks;

    const response = {
      items: paginatedTasks,
      pagination: {
        total: allTasks.length,
        pages: pageSize ? allTasks.length / parseInt(pageSize) : 1,
        current: page ?? 1,
        pageSize: pageSize ?? allTasks.length
      }
    }

    return {
      statusCode: 200,
      headers: [
          {
              key: "Content-Type",
              value: "application/json",
          },
      ],
      data: objectToArrayBuffer(response),
    };
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
