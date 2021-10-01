"use strict";

const GameSaveSerializer = {
  serialize(save) {
    const json = JSON.stringify(save, this.jsonConverter);
    return this.encodeText(json);
  },
  // eslint-disable-next-line no-unused-vars
  jsonConverter(key, value) {
    if (value === Infinity) {
      return "Infinity";
    }
    if (value instanceof Set) {
      return Array.from(value.keys());
    }
    return value;
  },
  deserialize(data) {
    if (typeof data !== "string") return undefined;
    try {
      const json = this.decodeText(data);
      // eslint-disable-next-line no-unused-vars
      return JSON.parse(json, (k, v) => ((v === Infinity) ? "Infinity" : v));
    } catch (e) {
      return undefined;
    }
  },
  encoder: new TextEncoder(),
  decoder: new TextDecoder(),
  
  // It's important that `this` is what it should be in these function calls
  // (encoder/decoded for the first element, window for the fourth)
  // which is why we shouldn't do e.g. {'encode': encoder.encode, 'decode': encoder.decode}
  // In the fifth element, order of operations is important: we don't want to encode 0s we added in encoding
  // (i.e. + -> 0b -> 0ab is undesired) or to accidentally decode 0ac -> 0c -> / (slash)
  // when encoding says (as it should) 0c -> 0ac.
  steps: [
    {'encode': x => GameSaveSerializer.encoder.encode(x), 'decode': x => GameSaveSerializer.decoder.decode(x)},
    {'encode': x => pako.deflate(x), 'decode': x => pako.inflate(x)},
    {
      'encode': x => Array.from(x).map(i => String.fromCharCode(i)).join(''),
      'decode': x => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    {'encode': x => btoa(x), 'decode': x => atob(x)},
    {
      'encode': x => x.replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
      'decode': x => x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0')
    },
    {'encode': x => 'Pa' + x, 'decode': x => x.slice(2)}
  ],
  encodeText(text) {
    return this.steps.reduce((x, step) => step.encode(x), text);
  },
  decodeText (text) {
    if (text.startsWith('Pa')) {
      return this.steps.reduceRight((x, step) => step.decode(x), text);
    } else {
      return atob(text);
    }
  }
};
