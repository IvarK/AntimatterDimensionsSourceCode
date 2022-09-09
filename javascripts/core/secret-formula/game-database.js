export const GameDatabase = {
  achievements: {},
  challenges: {},
  infinity: {},
  eternity: {
    timeStudies: {}
  },
  reality: {
    glyphEffects: {},
    glyphSacrifice: {},
  },
  celestials: {
    effarig: {},
    alchemy: {},
    pelle: {},
    descriptions: {},
    quotes: {},
  }
};

window.GameDatabase = GameDatabase;

window.mapGameData = function mapGameData(gameData, mapFn) {
  const result = [];
  for (const data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
};

window.mapGameDataToObject = function mapGameDataToObject(gameData, mapFun) {
  const array = Object.entries(gameData);
  const out = {};
  for (let idx = 0; idx < array.length; idx++) {
    out[array[idx][0]] = mapFun(array[idx][1]);
  }
  return {
    all: Object.values(out),
    ...out
  };
};
