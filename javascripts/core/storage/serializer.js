"use strict";

const GameSaveSerializer = {
  serialize(save, cloud = false) {
    const json = JSON.stringify(save, this.jsonConverter);
    return this.encodeText(json, cloud);
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
  deserialize(data, cloud = false) {
    if (typeof data !== "string") return undefined;
    try {
      const json = this.decodeText(data, cloud);
      // eslint-disable-next-line no-unused-vars
      return JSON.parse(json, (k, v) => ((v === Infinity) ? "Infinity" : v));
    } catch (e) {
      return undefined;
    }
  },
  // Define these now so we don't keep creating new ones, which vaguely seems bad.
  encoder: new TextEncoder(),
  decoder: new TextDecoder(),
  // This is a magic string savefiles should start with.
  saveFileStartingString: 'AntimatterDimensionsSaveFileAAA',
  // Steps are given in encoding order.
  // This list contains steps common between export and cloud save.
  // It's important that `this` is what it should be in these function calls
  // (encoder/decoded for the first element, window for the fourth)
  // which is why we shouldn't do e.g. { encode: encoder.encode, decode: encoder.decode }
  // In the fifth element, order of operations is important: we don't want to encode 0s we added in encoding
  // (i.e. + -> 0b -> 0ab is undesired) or to accidentally decode 0ac -> 0c -> / (slash)
  // when encoding says (as it should) 0c -> 0ac.
  commonSteps: [
    // This step transforms saves into unsigned 8-bit arrays, as pako requires.
    { encode: x => GameSaveSerializer.encoder.encode(x), decode: x => GameSaveSerializer.decoder.decode(x) },
    // This step is  where the compression actually happens. The pako library works with unsigned 8-bit arrays.
    { encode: x => pako.deflate(x), decode: x => pako.inflate(x) },
  ],
  // These are steps we only do for export.
  exportSteps: [
    // This step converts from unsigned 8-bit arrays to strings with codepoints less than 256.
    // We need to do this outselves because GameSaveSerializer.decoder would give us unicode sometimes.
    {
      encode: x => Array.from(x).map(i => String.fromCharCode(i)).join(''),
      decode: x => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    // This step makes the characters in saves printable. At this point in the process, all characters
    // will already have codepoints less than 256 (from the previous step), so emoji in the original save
    // won't break this.
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
    // This is a version marker, as well as indicating to players that this is an AD save.
    // We can change the last 3 letters of the string savefiles start with from AAA
    // if we want a new version of savefile encoding.
    {
      encode: x => `${GameSaveSerializer.saveFileStartingString}${x}`,
      decode: x => x.slice(GameSaveSerializer.saveFileStartingString.length)
    },
  ],
  // These are steps we only do for cloud saves.
  cloudSteps: [
    // This combines pairs of characters into one, and adds an offset to the start
    // so we know if we had an odd or even number of characters.
    {
      encode(x) {
        const a = Array.from(x);
        return (a.length % 2) + [...Array(Math.floor(a.length / 2 + 1))].map(
          (x, i) => String.fromCharCode(a[2 * i] * 256 + (a[2 * i + 1] || 0))).join('');
      },
      decode(x) {
        const full = Array.from(x);
        const offset = +full[0];
        const a = full.slice(1);
        const nums = a.flatMap(function (i) {
          const code = i.charCodeAt(0);
          return [Math.floor(code / 256), code % 256];
        });
        if (offset) nums.pop();
        return Uint8Array.from(nums);
      }
    },
    // Add a version (as with exported saves)
    // This can't be in the list of common steps because it comes at the end
    // and the rest come at the start.
    {
      encode: x => `${GameSaveSerializer.saveFileStartingString}${x}`,
      decode: x => x.slice(GameSaveSerializer.saveFileStartingString.length)
    },
  ],
  steps(cloud) {
    return this.commonSteps.concat(cloud ? this.cloudSteps : this.exportSteps);
  },
  // Apply each step's encode function in encoding order.
  encodeText(text, cloud = false) {
    return this.steps(cloud).reduce((x, step) => step.encode(x), text);
  },
  // Apply each step's decode function in decoding order (reverse of encoding order).
  // Only do this if we recognize the initial version. If not, just use atob.
  // Old saves always started with eYJ and old automator scripts (where this
  // function is also used) are very unlikely to start with our magic string
  // due to it being more than a few characters long.
  decodeText(text, cloud = false) {
    if (text.startsWith(this.saveFileStartingString)) {
      return this.steps(cloud).reduceRight((x, step) => step.decode(x), text);
    }
    return atob(text);
  }
};
