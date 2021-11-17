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
    descriptions: {},
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
