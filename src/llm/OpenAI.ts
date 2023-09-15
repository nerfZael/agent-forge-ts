import { LlmApi, LlmOptions, LlmResponse } from ".";

import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessageFunctionCall,
  OpenAIApi,
  CreateChatCompletionResponse
} from "openai";
import { Http_Module, Http_ResponseType } from "../wrap";

export {
  ChatCompletionResponseMessage as OpenAIResponse,
  ChatCompletionRequestMessageFunctionCall as OpenAIFunctionCall
};

export class OpenAI implements LlmApi {
  public _api: OpenAIApi;

  constructor(
    private readonly _apiKey: string,
    private readonly _defaultModel: string,
    private readonly _defaultMaxTokens: number,
    private readonly _defaultMaxResponseTokens: number,
  ) {
  }

  getMaxContextTokens() {
    return this._defaultMaxTokens;
  }

  getModel() {
    return this._defaultModel;
  }

  getResponse(
    chatMessages: ChatCompletionRequestMessage[],
    functionDefinitions?: any[],
    options?: LlmOptions,
  ): LlmResponse {
    const completion = this._createChatCompletion({
      messages: chatMessages,
      functions: functionDefinitions,
      temperature: options ? options.temperature : 0,
      max_tokens: options ? options.max_tokens : this._defaultMaxResponseTokens
    });

    if (completion.choices.length < 1) {
      throw Error("Chat completion choices length was 0...");
    }

    const choice = completion.choices[0];

    if (!choice.message) {
      throw Error(
        `Chat completion message was undefined: ${JSON.stringify(choice, null, 2)}`
      );
    }

    return choice.message;
  }

  private _createChatCompletion(options: {
    messages: ChatCompletionRequestMessage[];
    model?: string;
    functions?: any;
  } & LlmOptions): CreateChatCompletionResponse {
    const result = Http_Module.post({
      url: "https://api.openai.com/v1/chat/completions",
      request: {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this._apiKey}` 
        },
        body: JSON.stringify({
          messages: options.messages,
          model: options.model || this._defaultModel,
          functions: options.functions,
          function_call: options.functions ? "auto" : undefined,
          temperature: options.temperature || 0,
          max_tokens: options.max_tokens
        }),
        responseType: Http_ResponseType.TEXT
      }
    });

    if (!result.ok) {
      throw new Error(`Failed to create chat completion: ${result.error}`);
    } else if(result.value!.status !== 200) {
      throw new Error(`Failed to create chat completion, code: ${result.value?.status}`);
    }

    const body = result.value?.body;
    const obj: CreateChatCompletionResponse | null = body ? JSON.parse(body) : null;

    if (!obj) {
      throw new Error(`Failed to parse response body: ${body}`);
    }
    return obj;
  }
}
