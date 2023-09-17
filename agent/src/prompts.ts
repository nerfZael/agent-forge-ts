import { THIS_URL } from "./constants";
import { Http_Module } from "./wrap";

export type PromptsFile = { name: string, value: string }[];
export class Prompts {
  constructor() {

  }

  list(): PromptsFile {
    let resp = Http_Module.get({ url: `https://${THIS_URL}/cat?arg=wrap.info`, request: null }).value;
    if (!resp?.headers) {
      throw new Error("No headers returned!");
    }
    const headers = String.fromCharCode.apply(String, (resp.headers as any)[1]);
    let cid = headers.substring(headers.indexOf("wrap://ipfs/Qm"))
    cid = cid.slice("wrap://ipfs/".length);

    resp = Http_Module.get({ url: `https://ipfs.io/api/v0/cat?arg=${cid}/prompts.json`, request: null }).value;

    const text = resp.body;

    const file = JSON.parse(text) as PromptsFile;

    return file;
  }
}