import { ProtocolStore, StoreKey } from "./store";
import { InMemoryWorkspace } from "./workspaces";
import { OpenAI } from "./llm";
import { OPENAI_API_KEY } from "./constants";
import { ChatCompletionRequestMessage } from "openai";

export class Agent {
  constructor(
    private store: ProtocolStore,
    private workspace?: InMemoryWorkspace
  ) {}
  run(input: string): {
    isLast: boolean;
    output: string | null;
  }  {
    const chat: ChatCompletionRequestMessage[] = [
      { role: "system", content: "You are a helpful assistant" },
    ];

    this.saveChat(chat);

    return this.runStep(input);
  }

  runStep(input: string | null): {
    isLast: boolean;
    output: string | null;
  } {
    const chat = this.store.get<ChatCompletionRequestMessage[]>(StoreKey.Chat);
    if (!chat) {
      return this.run(input ?? "");
    }

    const openai = new OpenAI(
      OPENAI_API_KEY,
      "gpt-3.5-turbo",
      4000,
      1000
    );

    input && chat.push({ role: "user", content: input });

    const response = openai.getResponse(chat);

    chat.push({ role: "assistant", content: response.content });

    this.saveChat(chat);

    return {
      isLast: false,
      output: response.content ?? null,
    };
  }

  saveChat(chat: ChatCompletionRequestMessage[]) {
    this.store.set({
      key: StoreKey.Chat,
      value: chat
    });
  }

  loadChat(): ChatCompletionRequestMessage[] {
    const chat = this.store.get<ChatCompletionRequestMessage[]>(StoreKey.Chat);
    if (!chat) {
      throw new Error("Chat not found. Run the agent first.");
    }

    return chat;
  }
}
