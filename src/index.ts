import { DEFAULT_PORT, THIS_URI } from "./constants";
import { Prompts } from "./prompts";
import { StepRequestBody, TaskRequestBody } from "./protocolTypes";
import { State, decodeState, encodeState } from "./state";
import { ProtocolStore } from "./store";
import {
  objectToArrayBuffer,
  parseBufferToJson,
  stringToArrayBuffer,
  uuidv4,
} from "./utils";
import {
  Args_onStart,
  Args_routeGetAgentTasks,
  Args_routeGetAgentTasksById,
  Args_routeGetAgentTasksByIdArtifacts,
  Args_routeGetAgentTasksByIdArtifactsById,
  Args_routeGetAgentTasksByIdSteps,
  Args_routeGetAgentTasksByIdStepsById,
  Args_routeGetHearbeat,
  Args_routeGetRoot,
  Args_routePostRoot,
  Args_routePostAgentTasks,
  Args_routePostAgentTasksByIdArtifacts,
  Args_routePostAgentTasksByIdSteps,
  Args_start,
  HttpServer_HttpMethod,
  HttpServer_Module,
  HttpServer_Response,
  HttpServer_WrapperCallback,
} from "./wrap";
import { Args_main, Args_run, Args_runStep, ModuleBase, Step } from "./wrap";
import { Workspace } from "./workspace";
import { Agent } from "./agent";

const createPaginationResponse = (args: {
  items: any[];
  page?: string;
  pageSize?: string;
}) => {
  const { items, page, pageSize } = args;

  return {
    total: items.length,
    pages: pageSize ? items.length / parseInt(pageSize) : 1,
    current: parseInt(page ?? "1"),
    pageSize: pageSize ? parseInt(pageSize) : items.length,
  };
};

export class Module extends ModuleBase {
  run(args: Args_run): Step {
    const state: State = {
      index: 0,
      finished: false,
    };

    const prompts = new Prompts();

    const result = {
      state: encodeState(state),
      output: `My goal is: ${args.goal}, My prompt is: ${
        prompts.list()[0].value
      }`,
    };

    return result;
  }

  runStep(args: Args_runStep): Step {
    const state = decodeState(args.state);

    state.index++;

    if (state.index > 5) {
      state.finished = true;

      return {
        state: encodeState(state),
        output: "Agent says: I finished",
      };
    }

    return {
      state: encodeState(state),
      output: `Agent says: ${state.index} step`,
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
      method: "onStart",
    };

    const serverStartArgs: Args_start = {
      port,
      requestTimeout: 10000,
      routes: [
        {
          path: "/",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostRoot",
          },
        },
        {
          path: "/",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetRoot",
          },
        },
        {
          path: "/heartbeat",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetHearbeat",
          },
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasks",
          },
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasks",
          },
        },
        {
          path: "/agent/tasks/:task_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgenonStarttTasksById",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdSteps",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasksByIdSteps",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps/:step_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdStepsById",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdArtifacts",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: THIS_URI,
            method: "routePostAgentTasksByIdArtifacts",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts/:artifact_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: THIS_URI,
            method: "routeGetAgentTasksByIdArtifactsById",
          },
        },
      ],
      onStart,
    };

    console.log(`Starting server on port: ${port}`);

    const serverStartResult = HttpServer_Module.start(serverStartArgs);

    if (!serverStartResult.ok) {
      throw new Error(serverStartResult.error);
    }

    return 0;
  }

  onStart(args: Args_onStart): boolean {
    console.log(`Server started`);

    return true;
  }

  routePostRoot(args: Args_routePostRoot): HttpServer_Response {
    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "text/plain",
        },
      ],
      body: stringToArrayBuffer("Welcome to the Auto-GPT Forge"),
    };
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
      body: stringToArrayBuffer("Welcome to the Auto-GPT Forge"),
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
      body: stringToArrayBuffer("Server is running."),
    };
  }

  routePostAgentTasks(args: Args_routePostAgentTasks): HttpServer_Response {
    if (args.request.body === null) {
      throw new Error("Request body is null");
    }

    const stepRequestBody: StepRequestBody = parseBufferToJson(
      args.request.body
    );

    const store = new ProtocolStore();
    const agent = new Agent(store);

    const taskRequestBody: TaskRequestBody = parseBufferToJson(
      args.request.body
    );
    const createdTask = store.createTask(taskRequestBody);

    const step = agent.runNextStep(createdTask.task_id, stepRequestBody);

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer(step),
    };
  }

  routeGetAgentTasks(args: Args_routeGetAgentTasks): HttpServer_Response {
    const queryParams = args.request.query;
    const page = queryParams.find((param) => param.key === "page")?.value;
    const pageSize = queryParams.find(
      (param) => param.key === "page_size"
    )?.value;

    const store = new ProtocolStore();

    const allTasks = store.getTasks();
    const paginatedTasks =
      page && pageSize
        ? store.paginate(allTasks, parseInt(page), parseInt(pageSize))
        : allTasks;

    const response = {
      items: paginatedTasks,
      pagination: createPaginationResponse({
        items: allTasks,
        page,
        pageSize,
      }),
    };

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer(response),
    };
  }

  routeGetAgentTasksById(
    args: Args_routeGetAgentTasksById
  ): HttpServer_Response {
    const routeParams = args.request.params;
    const task_id = routeParams.find((param) => param.key === "task_id")?.value;

    if (!task_id) throw new Error("task_id is required");

    const store = new ProtocolStore();

    const task = store.getTaskById(task_id);

    if (!task) {
      return {
        statusCode: 404,
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: objectToArrayBuffer({ error: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer(task),
    };
  }

  routeGetAgentTasksByIdSteps(
    args: Args_routeGetAgentTasksByIdSteps
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }

  routePostAgentTasksByIdSteps(
    args: Args_routePostAgentTasksByIdSteps
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }

  routeGetAgentTasksByIdStepsById(
    args: Args_routeGetAgentTasksByIdStepsById
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }

  routeGetAgentTasksByIdArtifacts(
    args: Args_routeGetAgentTasksByIdArtifacts
  ): HttpServer_Response {
    const routeParams = args.request.params;
    const task_id = routeParams.find((param) => param.key === "task_id")?.value;

    if (!task_id) throw new Error("task_id is required");

    const queryParams = args.request.query;
    const page = queryParams.find((param) => param.key === "page")?.value;
    const pageSize = queryParams.find(
      (param) => param.key === "page_size"
    )?.value;

    const store = new ProtocolStore();

    const task = store.getTaskById(task_id);

    if (!task) {
      return {
        statusCode: 404,
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: objectToArrayBuffer({ error: "Task not found" }),
      };
    }

    const allArtifacts = task?.artifacts ?? [];
    const paginatedArtifacts =
      page && pageSize
        ? store.paginate(allArtifacts, parseInt(page), parseInt(pageSize))
        : allArtifacts;

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer({
        items: paginatedArtifacts,
        pagination: createPaginationResponse({
          items: allArtifacts,
          page,
          pageSize,
        }),
      }),
    };
  }

  routePostAgentTasksByIdArtifacts(
    args: Args_routePostAgentTasksByIdArtifacts
  ): HttpServer_Response {
    const body = args.request.body;

    if (!body) {
      throw new Error("Request body is null");
    }

    const data = parseBufferToJson(body) as {
      task_id?: string;
      relative_path?: string;
      file?: {
        file: ArrayBuffer;
        filename?: string;
      };
    };

    if (!data.task_id) {
      throw new Error("task_id is required");
    }

    if (!data.relative_path) {
      throw new Error("relative_path is required");
    }

    if (!data.file) {
      throw new Error("file is required");
    }

    const fileName = data.file.filename ?? uuidv4();
    let filePath: string;

    if (data.relative_path.endsWith(fileName)) {
      filePath = data.relative_path;
    } else {
      filePath = `${data.relative_path}/${fileName}`;
    }

    const workspace = new Workspace();
    workspace.write(data.task_id, filePath, data.file.file);

    const store = new ProtocolStore();
    const artifact = store.createArtifact({
      taskId: data.task_id,
      fileName,
      relativePath: data.relative_path,
      agentCreated: true,
    });

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer(artifact),
    };
  }

  routeGetAgentTasksByIdArtifactsById(
    args: Args_routeGetAgentTasksByIdArtifactsById
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }
}
