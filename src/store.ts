import { stringToArrayBuffer } from "./utils";
import { KeyValueStore_Module } from "./wrap";

export enum StoreKey {
  Tasks = "tasks",
  Chat = "chat",
}

export interface PaginationOpts {
  page: number;
  pageSize: number;
}

export class ProtocolStore {
  private _store = KeyValueStore_Module;

  static paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }

  get<T>(key: StoreKey): T | null {
    const result = this._store.get({ key });

    if (!result.ok) {
      throw new Error(`Error getting key '${key}' from store`);
    }

    if (!result.value) {
      return null;
    }

    return this.decode<T>(result.value);
  }

  set({ key, value }: { key: StoreKey; value: any }) {
    const result = this._store.set({
      key,
      value: this.encode(value),
    });

    if (!result.ok) {
      throw new Error(`Error setting key '${key}' in store`);
    }

    return value;
  }

  private encode(value: any) {
    const json = JSON.stringify(value);
    return stringToArrayBuffer(json);
  }

  private decode<T>(arrayBuffer: ArrayBuffer): T {
    const uint8Array = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder();
    return JSON.parse(textDecoder.decode(uint8Array));
  }
}
