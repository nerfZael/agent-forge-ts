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