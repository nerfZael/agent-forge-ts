export function stringToArrayBuffer(str: string) {
  const uint8Array = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
      uint8Array[i] = str.charCodeAt(i);
  }
  return uint8Array.buffer;
}

export function objectToArrayBuffer(obj: any) {
  return stringToArrayBuffer(JSON.stringify(obj));
}

export function parseBufferToJson(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  let jsonString = '';

  uint8Array.forEach(byte => {
    jsonString += String.fromCharCode(byte);
  });

  return JSON.parse(jsonString);
}

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
