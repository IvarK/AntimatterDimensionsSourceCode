const GalaxyType = {
  NORMAL: "Antimatter Galaxies",
  DISTANT: "Distant Antimatter Galaxies",
  REMOTE: "Remote Antimatter Galaxies"
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return NormalDimension(this.tier).amount.gte(this.amount);
  }
}

class Galaxy {
  static get requirement() {
    const galaxies = player.galaxies;
    let amount = 80 + (galaxies * 60);
    if (player.timestudy.studies.includes(42)) amount = 80 + ((galaxies) * 52);
    if (player.currentChallenge === "challenge4") amount = 99 + ((galaxies) * 90);

    let type = this.type;

    if (type === GalaxyType.DISTANT && player.currentEternityChall === "eterc5") {
      amount += Math.pow(galaxies, 2) + galaxies;
    } else if (type === GalaxyType.DISTANT || type === GalaxyType.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      amount += Math.pow((galaxies) - (galaxyCostScalingStart - 1), 2) + (galaxies) - (galaxyCostScalingStart - 1);
    }

    if (type === GalaxyType.REMOTE) {
      amount = Math.floor(amount * Math.pow(1.002, (galaxies - (799 + getGlyphSacEffect("power")))));
    }

    if (player.infinityUpgrades.includes("resetBoost")) amount -= 9;
    if (player.challenges.includes("postc5")) amount -= 1;
    const tier = player.currentChallenge === "challenge4" ? 6 : 8;
    return new GalaxyRequirement(tier, amount);
  }

  static get costScalingStart() {
    let amount = 100;
    EternityChallenge(5).applyReward(value => amount += value);
    const studies = player.timestudy.studies;
    if (studies.includes(223)) amount += 7;
    if (studies.includes(224)) amount += Math.floor(player.resets / 2000);
    return amount;
  }

  static get type() {
    if (player.galaxies >= 800 + getGlyphSacEffect("power")) {
      return GalaxyType.REMOTE;
    }
    if (player.currentEternityChall === "eterc5" || player.galaxies >= this.costScalingStart) {
      return GalaxyType.DISTANT;
    }
    return GalaxyType.NORMAL;
  }

  // TODO: Move to replicanti class once it's established
  static get totalReplicantiGalaxies() {
    let extraGals = player.replicanti.galaxies;
    if (player.timestudy.studies.includes(225)) {
      extraGals += Math.floor(player.replicanti.amount.e / 1000);
    }
    if (player.timestudy.studies.includes(226)) {
      extraGals += Math.floor(player.replicanti.gal / 15);
    }
    return extraGals;
  }

  static checkAchievements() {
    if (player.spreadingCancer >= 10) giveAchievement("Spreading Cancer");
    if (player.spreadingCancer >= 100000) giveAchievement("Cancer = Spread");
    if (player.galaxies >= 50) giveAchievement("YOU CAN GET 50 GALAXIES!??");
    if (player.galaxies >= 2) giveAchievement("Double Galaxy");
    if (player.galaxies >= 1) giveAchievement("You got past The Big Wall");
    if (player.galaxies >= 630 && player.replicanti.galaxies === 0) giveAchievement("Unique snowflakes");
  }
}

function galaxyReset() {
  if (autoS) auto = false;
  autoS = true;
  if (player.sacrificed === 0) giveAchievement("I don't believe in Gods");
  player.galaxies++;
  player.tickDecrease -= 0.03;
  player.resets = 0;
  softReset(0);
  if (Notation.current().isCancer()) player.spreadingCancer += 1;
  Galaxy.checkAchievements();
}

function galaxyResetBtnClick() {
  if (player.currentEternityChall === "eterc6") {
    return;
  }
  const canDoReset = player.currentChallenge !== "challenge11" && player.currentChallenge !== "postc1" && player.currentChallenge !== "postc7" && (player.break || player.money.lte(Number.MAX_VALUE));
  if (!canDoReset) {
    return;
  }
  if (!Galaxy.requirement.isSatisfied) {
    return;
  }
  if (player.eternities >= 7 && !shiftDown) maxBuyGalaxies(true);
  else galaxyReset();
}