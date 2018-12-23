const GameDatabase = {
  challenges: {},
  infinity: {},
  eternity: {
    timeStudies: {}
  },
  reality: {}
};

function mapGameData(gameData, mapFn) {
  const result = [];
  for (let data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
}