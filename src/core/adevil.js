/* eslint-disable max-len */
export const ADevil = {
  randomIndex(array) {
    let type = array;
    // Start with infinity upgrades for now
    type = InfinityUpgrade.all;
    let current = type.length, random;

    while (current > 0) {

      random = Math.floor(Math.random() * current);
      current--;

      [type[current], type[random]] =
        [type[random], type[current]];
    }

    return type;
  },
  shuffleArray(array) {
    for (let i = 0; i < array.length - 1; i++) {
      const j = i + Math.floor(Math.random() * (array.length - i));
      const temporary = array[j];
      array[j] = array[i];
      array[i] = temporary;
    }
    return array;
  },
  getInfinityUpgradeGrid() {
    let upgrades = [
      InfinityUpgrade.totalTimeMult, InfinityUpgrade.dim18mult, InfinityUpgrade.dim36mult, InfinityUpgrade.resetBoost,
      InfinityUpgrade.buy10Mult, InfinityUpgrade.dim27mult, InfinityUpgrade.dim45mult, InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.thisInfinityTimeMult, InfinityUpgrade.unspentIPMult, InfinityUpgrade.dimboostMult,
      InfinityUpgrade.ipGen, InfinityUpgrade.skipReset1, InfinityUpgrade.skipReset2, InfinityUpgrade.skipReset3,
      InfinityUpgrade.skipResetGalaxy
    ];
    upgrades = ADevil.shuffleArray(upgrades);
    const names = [];
    for (let i = 0; i < 16; i++) {
      names.push(upgrades[i].config.id);
    }
    player.ADevil.infUpgGridNames = names;
    const cl1 = upgrades.splice(0, 4);
    const cl2 = upgrades.splice(0, 4);
    const cl3 = upgrades.splice(0, 4);
    const cl4 = upgrades;

    return [
      cl1, cl2, cl3, cl4
    ];
  },
  canBuyUpgrade(array) {
    const upgrades = player.ADevil.infUpgGridNames;

    let numbor = 0;
    let rangeLow = 0;
    for (let i = 0; i < 16; i++) {
      if (upgrades[i] === array) {
        numbor = i;
        rangeLow = 4 * Math.floor(numbor / 4);
      }
    }
    const upgradesToCheck = [];
    for (let j = rangeLow; j < numbor; j++) {
      upgradesToCheck.push(upgrades[j]);
    }
    if (InfinityUpgrade.all.filter(u => upgradesToCheck.includes(u.id) && u.isBought).length === numbor - rangeLow) return true;
    return false;
  }
};