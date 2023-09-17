// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  CoreClient,
  InvokeResult,
  Uri,
} from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "wrap://http/http.wrappers.dev/u/test/agent-forge-ts" */
export interface Agent_Step {
  state: Types.Json;
  output?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/wraps.eth:logging@1.0.0" */
export interface Logging_Module_Args_debug {
  message: Types.String;
}

/* URI: "ens/wraps.eth:logging@1.0.0" */
export interface Logging_Module_Args_info {
  message: Types.String;
}

/* URI: "ens/wraps.eth:logging@1.0.0" */
export interface Logging_Module_Args_warn {
  message: Types.String;
}

/* URI: "ens/wraps.eth:logging@1.0.0" */
export interface Logging_Module_Args_error {
  message: Types.String;
}

/* URI: "ens/wraps.eth:logging@1.0.0" */
export interface Logging_Module_Args_loggers {
}

/* URI: "ens/wraps.eth:logging@1.0.0" */
export class Logging {
  protected _defaultClient: CoreClient;
  protected _defaultUri: string;
  protected _defaultEnv?: Record<string, unknown>;

  constructor(
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ) {
    this._defaultClient = this._getClient(client);
    this._defaultEnv = this._getEnv(env);
    this._defaultUri = this._getUri(uri);
  }

  public get client(): CoreClient {
    return this._defaultClient;
  }

  public get uri(): string {
    return this._defaultUri;
  }

  public get env(): Record<string, unknown> | undefined {
    return this._defaultEnv;
  }

  private _getClient(client?: CoreClient): CoreClient {
    return client || this._defaultClient || this._getDefaultClient();
  }

  private _getUri(uri?: string): string {
    return uri || this._defaultUri || this._getDefaultUri();
  }

  private _getEnv(env?: Record<string, unknown>): Record<string, unknown> | undefined {
    return env || this._defaultEnv || this._getDefaultEnv();
  }

  protected _getDefaultClient(): CoreClient {
    return new PolywrapClient();
  }
  protected _getDefaultUri(): string {
    return "ens/wraps.eth:logging@1.0.0";
  }
  protected _getDefaultEnv(): Record<string, unknown> | undefined {
    return undefined;
  }

  async debug(
    args: Logging_Module_Args_debug,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Boolean>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Boolean>({
      uri: Uri.from(_uri),
      method: "debug",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async info(
    args: Logging_Module_Args_info,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Boolean>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Boolean>({
      uri: Uri.from(_uri),
      method: "info",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async warn(
    args: Logging_Module_Args_warn,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Boolean>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Boolean>({
      uri: Uri.from(_uri),
      method: "warn",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async error(
    args: Logging_Module_Args_error,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Boolean>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Boolean>({
      uri: Uri.from(_uri),
      method: "error",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async loggers(
    args: Logging_Module_Args_loggers,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Array<Types.String>>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Array<Types.String>>({
      uri: Uri.from(_uri),
      method: "loggers",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };
};

/* URI: "wrap://http/http.wrappers.dev/u/test/agent-forge-ts" */
export interface Agent_Module_Args_main {
  args: Array<Types.String>;
}

/* URI: "wrap://http/http.wrappers.dev/u/test/agent-forge-ts" */
export interface Agent_Module_Args_run {
  goal: Types.String;
}

/* URI: "wrap://http/http.wrappers.dev/u/test/agent-forge-ts" */
export interface Agent_Module_Args_runStep {
  input?: Types.String | null;
  state: Types.Json;
}

/* URI: "wrap://http/http.wrappers.dev/u/test/agent-forge-ts" */
export class Agent {
  protected _defaultClient: CoreClient;
  protected _defaultUri: string;
  protected _defaultEnv?: Record<string, unknown>;

  constructor(
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ) {
    this._defaultClient = this._getClient(client);
    this._defaultEnv = this._getEnv(env);
    this._defaultUri = this._getUri(uri);
  }

  public get client(): CoreClient {
    return this._defaultClient;
  }

  public get uri(): string {
    return this._defaultUri;
  }

  public get env(): Record<string, unknown> | undefined {
    return this._defaultEnv;
  }

  private _getClient(client?: CoreClient): CoreClient {
    return client || this._defaultClient || this._getDefaultClient();
  }

  private _getUri(uri?: string): string {
    return uri || this._defaultUri || this._getDefaultUri();
  }

  private _getEnv(env?: Record<string, unknown>): Record<string, unknown> | undefined {
    return env || this._defaultEnv || this._getDefaultEnv();
  }

  protected _getDefaultClient(): CoreClient {
    return new PolywrapClient();
  }
  protected _getDefaultUri(): string {
    return "wrap://http/http.wrappers.dev/u/test/agent-forge-ts";
  }
  protected _getDefaultEnv(): Record<string, unknown> | undefined {
    return undefined;
  }

  async main(
    args: Agent_Module_Args_main,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Int32>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Int32>({
      uri: Uri.from(_uri),
      method: "main",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async run(
    args: Agent_Module_Args_run,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Agent_Step>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Agent_Step>({
      uri: Uri.from(_uri),
      method: "run",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };

  async runStep(
    args: Agent_Module_Args_runStep,
    client?: CoreClient,
    env?: Record<string, unknown>,
    uri?: string,
  ): Promise<InvokeResult<Types.Agent_Step>> {
    const _client = this._getClient(client);
    const _env = this._getEnv(env);
    const _uri = this._getUri(uri);

    return _client.invoke<Types.Agent_Step>({
      uri: Uri.from(_uri),
      method: "runStep",
      args: (args as unknown) as Record<string, unknown>,
      env: _env,
    });
  };
};

/// Imported Modules END ///
