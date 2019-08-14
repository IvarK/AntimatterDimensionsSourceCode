const GameDatabase = {
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
  celestials: {}
};

function mapGameData(gameData, mapFn) {
  const result = [];
  for (let data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
}