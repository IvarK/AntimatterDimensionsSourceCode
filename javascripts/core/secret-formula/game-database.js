const GameDatabase = {
  challenges: {},
  infinity: {},
  timeStudies: {},
  reality: {}
};

function mapGameData(gameData, mapFn) {
  const result = [];
  for (let item of gameData) {
    result[item.id] = mapFn(item);
  }
  return result;
}