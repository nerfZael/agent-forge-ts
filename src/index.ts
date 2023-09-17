import { DEFAULT_PORT, THIS_URL } from "./constants";
import { StepRequestBody, TaskRequestBody } from "./protocolTypes";
import { ProtocolStore } from "./store";
import {
  objectToArrayBuffer,
  parseBufferToJson,
  stringToArrayBuffer,
} from "./utils";
import {
  Args_main,
  Args_onStart,
  Args_routeGetAgentTasks,
  Args_routeGetAgentTasksById,
  Args_routeGetAgentTasksByIdArtifacts,
  Args_routeGetAgentTasksByIdArtifactsById,
  Args_routeGetAgentTasksByIdSteps,
  Args_routeGetAgentTasksByIdStepsById,
  Args_routeGetHearbeat,
  Args_routeGetRoot,
  Args_routePostAgentTasks,
  Args_routePostAgentTasksByIdArtifacts,
  Args_routePostAgentTasksByIdSteps,
  Args_run, Args_runStep,
  Args_start,
  Args_routeInfo,
  HttpServer_HttpMethod,
  HttpServer_Module,
  HttpServer_Response,
  HttpServer_WrapperCallback,
  Http_Module,
  InvocationContext_Module,
  Step
} from "./wrap";
import { InMemoryWorkspace } from "./workspaces";
import { processMultipartRequest } from "./multipart";
import { Agent } from "./Agent";
import { ProtocolAgent } from "./ProtocolAgent";

export class Module extends ModuleBase {
  private readonly agent: Agent; 
  constructor() {
    super();
    this.agent = new Agent(new ProtocolStore(), new InMemoryWorkspace());
  }

  run(args: Args_run): Step {
    return this.agent.run(args.goal);
  }

  runStep(args: Args_runStep): Step {
    return this.agent.runStep(args.input);
  }

  main(args: Args_main): number {
    if (args.args.length > 0) {
      var step = this.agent.run(args.args[0]);
      console.log("Agent:", step.output);

      while(!step.isLast) {
        step = this.agent.runStep(null);
        console.log("Agent:", step.output);
      }

      return 0;
    } 

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
      uri: this.uri,
      method: "onStart",
    };

    const serverStartArgs: Args_start = {
      port,
      requestTimeout: 10000,
      routes: [
        {
          path: "/info",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeInfo",
          },
        },
        {
          path: "/",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetRoot",
          },
        },
        {
          path: "/heartbeat",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetHearbeat",
          },
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: this.uri,
            method: "routePostAgentTasks",
          },
        },
        {
          path: "/agent/tasks",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetAgentTasks",
          },
        },
        {
          path: "/agent/tasks/:task_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetAgentTasksById",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetAgentTasksByIdSteps",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: this.uri,
            method: "routePostAgentTasksByIdSteps",
          },
        },
        {
          path: "/agent/tasks/:task_id/steps/:step_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetAgentTasksByIdStepsById",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
            method: "routeGetAgentTasksByIdArtifacts",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts",
          httpMethod: HttpServer_HttpMethod.POST,
          handler: {
            uri: this.uri,
            method: "routePostAgentTasksByIdArtifacts",
          },
        },
        {
          path: "/agent/tasks/:task_id/artifacts/:artifact_id",
          httpMethod: HttpServer_HttpMethod.GET,
          handler: {
            uri: this.uri,
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
    const agent = new ProtocolAgent(this.agent, store);

    const taskRequestBody: TaskRequestBody = parseBufferToJson(
      args.request.body
    );
    const createdTask = agent.createTask(taskRequestBody);

    const step = agent.runNextStep(createdTask.task_id, stepRequestBody);

    return response.ok().json(step);
  }

  routeGetAgentTasks(args: Args_routeGetAgentTasks): HttpServer_Response {
    const queryParams = args.request.query;
    const page = queryParams.find((param) => param.key === "page")?.value;
    const pageSize = queryParams.find(
      (param) => param.key === "page_size"
    )?.value;

    const store = new ProtocolStore();
    const agent = new ProtocolAgent(this.agent, store);

    const allTasks = agent.getTasks();
    const paginatedTasks =
      page && pageSize
        ? ProtocolStore.paginate(allTasks, parseInt(page), parseInt(pageSize))
        : allTasks;

    return response.ok().json({
      items: paginatedTasks,
      pagination: createPaginationResponse({
        items: allTasks,
        page,
        pageSize,
      }),
    });
  }

  routeGetAgentTasksById(
    args: Args_routeGetAgentTasksById
  ): HttpServer_Response {
    const routeParams = args.request.params;
    const task_id = routeParams.find((param) => param.key === "task_id")?.value;

    if (!task_id) throw new Error("task_id is required");

    const store = new ProtocolStore();
    const agent = new ProtocolAgent(this.agent, store);

    const task = agent.getTaskById(task_id);

    if (!task) {
      return response.notFound();
    }

    return response.ok()
      .json(task);
  }

  routeGetAgentTasksByIdSteps(
    args: Args_routeGetAgentTasksByIdSteps
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }

  routePostAgentTasksByIdSteps(
    args: Args_routePostAgentTasksByIdSteps
  ): HttpServer_Response {
    if (args.request.body === null) {
      throw new Error("Request body is null");
    }

    const stepRequestBody: StepRequestBody = parseBufferToJson(
      args.request.body
    );

    const store = new ProtocolStore();
    const agent = new ProtocolAgent(this.agent, store);

    const task = agent.getTaskById(args.request.params.find((param) => param.key === "task_id")?.value ?? "");
    if (!task) {
      return response.notFound();
    }

    const step = agent.runNextStep(task.task_id, stepRequestBody);

    return response.ok().json(step);
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
    const agent = new ProtocolAgent(this.agent, store);

    const task = agent.getTaskById(task_id);

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
        ? ProtocolStore.paginate(
            allArtifacts,
            parseInt(page),
            parseInt(pageSize)
          )
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
    const textDecoder = new TextDecoder();

    if (!body) {
      throw new Error("Request body is required");
    }

    const taskId = args.request.params.find((param) => param.key === "task_id")?.value;

    if (!taskId) {
      throw new Error("task_id is required");
    }

    const headers = args.request.headers.map((header) => ({
      key: header.key,
      value: header.value,
    }));

    const decodedBody = textDecoder.decode(body);
    const boundary = headers.find((header) => header.key === "Content-Type")?.value ?? "";

    const multipartData = processMultipartRequest(decodedBody, boundary);
    const relativePath = multipartData.fields.relative_path;

    if (!relativePath) {
      throw new Error("relative_path is required");
    }

    const files = multipartData.files;

    if (!Object.keys(files).length) {
      throw new Error("No files found in request");
    }

    const file = Object.values(files)[0]

    const protocolStore = new ProtocolStore();
    const workspace = new InMemoryWorkspace();
    const agent = new Agent(protocolStore, workspace);
    const protocolAgent = new ProtocolAgent(agent, protocolStore, workspace);
    const artifact = protocolAgent.createArtifact({
      taskId,
      file: {
        data: file.data,
        name: file.filename
      },
      relativePath
    })

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
    const routeParams = args.request.params;

    const task_id = routeParams.find((param) => param.key === "task_id")?.value;
    if (!task_id) throw new Error("task_id is required");

    const artifact_id = routeParams.find((param) => param.key === "artifact_id")?.value;
    if (!artifact_id) throw new Error("artifact_id is required");

    const protocolStore = new ProtocolStore();
    const workspace = new InMemoryWorkspace();
    const agent = new Agent(protocolStore, workspace);
    const protocolAgent = new ProtocolAgent(agent, protocolStore, workspace);

    const artifact = protocolAgent.getArtifactById(task_id, artifact_id);

    if (!artifact) {
      return {
        statusCode: 404,
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: objectToArrayBuffer({ error: "Artifact not found" }),
      };
    }

    const content = workspace.readFileSync(`${task_id}/${artifact.relative_path}/${artifact.file_name}`);

    return {
      statusCode: 200,
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
      body: objectToArrayBuffer({
        content
      }),
    };
  }

  routeGetAgentTasksByIdArtifactsById(
    args: Args_routeGetAgentTasksByIdArtifactsById
  ): HttpServer_Response {
    throw new Error("Method not implemented.");
  }

  routeInfo(
    args: Args_routeInfo
  ): HttpServer_Response {
    let uri = this.uri.slice("wrap://https/".length);
    console.log("URI", uri);
    let resp = Http_Module.get({ url: `https://${uri}/cat?arg=wrap.info`, request: null }).value;
    console.log(resp);
    if (!resp?.headers) {
      throw new Error("No headers returned!");
    }
    const headers = String.fromCharCode.apply(String, (resp.headers as any)[1]);
    let cid = headers.substring(headers.indexOf("wrap://ipfs/Qm"))
    cid = cid.slice("wrap://ipfs/".length);

    return response.ok().json({
      cid,
      uri: this.uri
    });
  }

  get uri(): string {
    if (thisUri) {
      return thisUri;
    }

    let context = InvocationContext_Module.getOwnContext({});
    if (!context.ok || !context.value) {
      throw new Error(context.error);
    }

    thisUri = context.value.originUri;
    return thisUri;
  }
}

const response = {
  notFound: (): HttpServer_Response => {
    return {
      statusCode: 404,
      headers: [],
      body: null,
    };
  },
  ok: () => {
    return {
      text: (body: string): HttpServer_Response => {
        return {
          statusCode: 200,
          headers: [
            {
              key: "Content-Type",
              value: "text/html; charset=utf-8",
            },
          ],
          body: stringToArrayBuffer(body),
        };
      },
      json: <T>(body: T): HttpServer_Response => {
        return {
          statusCode: 200,
          headers: [
            {
              key: "Content-Type",
              value: "application/json",
            },
          ],
          body: objectToArrayBuffer(body),
        };
      }
    }
  }
};

function createPaginationResponse(args: {
  items: any[];
  page?: string;
  pageSize?: string;
}) {
  const { items, page, pageSize } = args;

  return {
    total: items.length,
    pages: pageSize ? items.length / parseInt(pageSize) : 1,
    current: parseInt(page ?? "1"),
    pageSize: pageSize ? parseInt(pageSize) : items.length,
  };
};

let thisUri: string | null = null;