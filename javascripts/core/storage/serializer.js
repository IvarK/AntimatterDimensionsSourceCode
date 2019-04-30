"use strict";

const GameSaveSerializer = {
  serialize(save) {
    const json = JSON.stringify(save, this.jsonConverter);
    return btoa(json);
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
      const json = atob(data);
      // eslint-disable-next-line no-unused-vars
      return JSON.parse(json, (k, v) => ((v === Infinity) ? "Infinity" : v));
    } catch (e) {
      return undefined;
    }
  }
};
