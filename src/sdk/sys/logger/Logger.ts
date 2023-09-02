import { Message } from "../../llm";

export interface ILogger {
  info: (info: string) => void;
  message: (msg: Message) => void;
  action: (msg: Message) => void;
  notice: (msg: string) => void;
  success: (msg: string) => void;
  warning: (msg: string) => void;
  error: (msg: string, error?: unknown) => void;
}

export interface LoggerCallbacks {
  promptUser: (query: string) => Promise<string>;
  logUserPrompt: (response: string) => void;
}

export class Logger implements ILogger {
  protected _logDir: string = "chats";

  constructor(
    protected _loggers: ILogger[],
    protected _callbacks: LoggerCallbacks
  ) { }

  info(info: string) {
    this._loggers.forEach((l) => l.info(info));
  }

  message(msg: Message) {
    this._loggers.forEach((l) => l.message(msg));
  };

  action(msg: Message) {
    this._loggers.forEach((l) => l.action(msg));
  }

  notice(msg: string) {
    this._loggers.forEach((l) => l.notice(msg));
  }

  success(msg: string) {
    this._loggers.forEach((l) => l.success(msg));
  }

  warning(msg: string) {
    this._loggers.forEach((l) => l.warning(msg));
  }

  error(msg: string, error?: unknown) {
    if (!error) {
      this._loggers.forEach((l) => l.error(msg));
      return;
    }

    let errorStr: string = "";
    let errorObj = error as Record<string, unknown>;
    if (
      typeof error === "object" &&
      errorObj.message
    ) {
      if (errorObj.response) {
        const responseObj = errorObj.response as Record<string, unknown>;
        const status = responseObj.status || "N/A";
        const data = responseObj.data || "N/A";
        errorStr += `\nResponse Status: ${status}`;
        errorStr += `\nResponse Data: ${JSON.stringify(data, null, 2)}`;
      }
      errorStr += `\nMessage: ${errorObj.message}`;
    }

    this._loggers.forEach((l) => l.error(`${msg}${errorStr}`));
  }

  async prompt(query: string): Promise<string> {
    const response = await this._callbacks.promptUser(query);
    this._callbacks.logUserPrompt(response);
    return response;
  }
}
