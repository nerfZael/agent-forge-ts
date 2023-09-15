export function stringToArrayBuffer(str: string) {
  const encoder = new TextEncoder();
  return Uint8Array.from(encoder.encode(str));
}

export function objectToArrayBuffer(obj: any) {
  return stringToArrayBuffer(JSON.stringify(obj));
}

export function parseBufferToJson(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const textDecoder = new TextDecoder();
  return JSON.parse(textDecoder.decode(uint8Array));
}

export function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
