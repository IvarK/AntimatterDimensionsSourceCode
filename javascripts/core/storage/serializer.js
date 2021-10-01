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
  // Define these now so we don't keep creating new ones, which vaguely seems bad.
  encoder: new TextEncoder(),
  decoder: new TextDecoder(),
  // Steps are given in encoding order.
  // It's important that `this` is what it should be in these function calls
  // (encoder/decoded for the first element, window for the fourth)
  // which is why we shouldn't do e.g. { encode: encoder.encode, decode: encoder.decode }
  // In the fifth element, order of operations is important: we don't want to encode 0s we added in encoding
  // (i.e. + -> 0b -> 0ab is undesired) or to accidentally decode 0ac -> 0c -> / (slash)
  // when encoding says (as it should) 0c -> 0ac.
  steps: [
    // This step transforms saves into unsigned 8-bit arrays, as pako requires.
    { encode: x => GameSaveSerializer.encoder.encode(x), decode: x => GameSaveSerializer.decoder.decode(x) },
    // This step is  where the compression actually happens. The pako library works with unsigned 8-bit arrays.
    { encode: x => pako.deflate(x), decode: x => pako.inflate(x) },
    // This step converts from unsigned 8-bit arrays to strings with codepoints less than 256.
    // We need to do this outselves because GameSaveSerializer.decoder would give us unicode sometimes.
    {
      encode: x => Array.from(x).map(i => String.fromCharCode(i)).join(''),
      decode: x => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    // This step makes the characters in saves printable.
    { encode: x => btoa(x), decode: x => atob(x) },
    // This step removes + and /, because if they occur, you can double-click on a save and get
    // everything up to the first + or /, which can be hard to debug. We don't do anything with =
    // because although double-click doesn't copy it, btoa ignores it and is happy without trailing =
    // (it's disregarded padding).
    // These regex have no potentially-unicode characters, I think, and they're applied to strings
    // with just ASCII anyway, but I'm adding u to make Codeacy happy.
    {
      encode: x => x.replace(/0/gu, '0a').replace(/\+/gu, '0b').replace(/\//gu, '0c'),
      decode: x => x.replace(/0b/gu, '+').replace(/0c/gu, '/').replace(/0a/gu, '0')
    },
    // This is a version marker. If we change how we encode saves,
    // we can replace Paa by Pab, etc. (P is for pako).
    // If we run out of two-letter combinations,
    // it's because we had over 500 versions, which would be bad for other reasons.
    { encode: x => 'Paa' + x, decode: x => x.slice(3) }
  ],
  // Apply each step's encode function in encoding order.
  encodeText(text) {
    return this.steps.reduce((x, step) => step.encode(x), text);
  },
  // Apply each step's decode function in decoding order (reverse of encoding order).
  // Only do this if we recognize the initial version. If not, just use atob.
  // Old saves always started with eYJ and old automator scripts (where this
  // function is also used) won't start with Paa (atob of it will start with an equals sign).
  decodeText(text) {
    if (text.startsWith('Paa')) {
      return this.steps.reduceRight((x, step) => step.decode(x), text);
    } else {
      return atob(text);
    }
  }
};
