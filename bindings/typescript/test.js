let utf8Encodings = [
  'utf8',
  'utf-8',
  'unicode-1-1-utf-8'
];

function TextEncoder(encoding) {
  if (utf8Encodings.indexOf(encoding) < 0 && typeof encoding !== 'undefined' && encoding != null) {
    throw new Error('Invalid encoding type. Only utf-8 is supported');
  } else {
    this.encoding = 'utf-8';
    this.encode = function(str) {
      if (typeof str !== 'string') {
        throw new Error('passed argument must be of tye string');
      }
      var binstr = unescape(encodeURIComponent(str)),
        arr = new Uint8Array(binstr.length);
      const split = binstr.split('');
      for (let i = 0; i < split.length; i++) {
        arr[i] = split[i].charCodeAt(0);
      }
      return arr;
    };
  }
}

function TextDecoder(encoding) {
  if (utf8Encodings.indexOf(encoding) < 0 && typeof encoding !== 'undefined' && encoding != null) {
    throw new Error('Invalid encoding type. Only utf-8 is supported');
  }
  else {
    this.encoding = 'utf-8';
    this.decode = function (view, options) {
      if (typeof view === 'undefined') {
        return '';
      }

      var stream = (typeof options !== 'undefined' && stream in options) ? options.stream : false;
      if (typeof stream !== 'boolean') {
        throw new Error('stream option must be boolean');
      }

      if (!ArrayBuffer.isView(view)) {
        throw new Error('passed argument must be an array buffer view');
      } else {
        var arr = new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
          charArr = new Array(arr.length);
        for (let i = 0; i < arr.length; i++) {
          charArr[i] = String.fromCharCode(arr[i]);
        }
        return decodeURIComponent(escape(charArr.join('')));
      }
    }
  }
}

const encoder = new TextEncoder('utf8');
encoder.encode('test');
