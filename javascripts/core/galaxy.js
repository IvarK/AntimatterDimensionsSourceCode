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
    let costBase = 80;
    let costMult = Effects.min(
      60,
      TimeStudy(42)
    );
    if (Challenge(10).isRunning) {
      costBase = 99;
      costMult = 90;
    }
    let amount = costBase + (galaxies * costMult);

    let type = this.type;

    if (type === GalaxyType.DISTANT && EternityChallenge(5).isRunning) {
      amount += Math.pow(galaxies, 2) + galaxies;
    } else if (type === GalaxyType.DISTANT || type === GalaxyType.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      amount += Math.pow((galaxies) - (galaxyCostScalingStart - 1), 2) + (galaxies) - (galaxyCostScalingStart - 1);
    }

    if (type === GalaxyType.REMOTE) {
      amount = Math.floor(amount * Math.pow(1.002, (galaxies - (799 + getGlyphSacEffect("power")))));
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;
    const tier = Challenge(10).isRunning ? 6 : 8;
    return new GalaxyRequirement(tier, amount);
  }

  static get costScalingStart() {
    return 100 + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward
    );
  }

  static get type() {
    if (player.galaxies >= 800 + getGlyphSacEffect("power")) {
      return GalaxyType.REMOTE;
    }
    if (EternityChallenge(5).isRunning || player.galaxies >= this.costScalingStart) {
      return GalaxyType.DISTANT;
    }
    return GalaxyType.NORMAL;
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
  if (Notation.current === Notation.cancer) player.spreadingCancer += 1;
  Galaxy.checkAchievements();
}

function galaxyResetBtnClick() {
  if (EternityChallenge(6).isRunning) {
    return;
  }
  const canDoReset = !Challenge(8).isRunning && player.currentChallenge !== "postc7" && (player.break || player.money.lte(Number.MAX_VALUE));
  if (!canDoReset) {
    return;
  }
  if (!Galaxy.requirement.isSatisfied) {
    return;
  }
  if (player.eternities >= 7 && !shiftDown) maxBuyGalaxies(true);
  else galaxyReset();
}

function maxBuyGalaxies(manual) {
  if (EternityChallenge(6).isRunning || Challenge(8).isRunning || player.currentChallenge === "postc7") return
  if (Autobuyer.galaxy.limit > player.galaxies || manual) {
    while (player.eightAmount.gt(Galaxy.requirement.amount) && (Autobuyer.galaxy.limit > player.galaxies || manual)) {
      if (Notation.current === Notation.cancer) player.spreadingCancer += 1;
      player.galaxies++;
    }
    player.galaxies--;
    galaxyReset();
  }
}