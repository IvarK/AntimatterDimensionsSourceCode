function bigCrunchReset() {
    var challNumber = parseInt(player.currentChallenge[player.currentChallenge.length-1]);
    if (player.currentChallenge.length === 11) challNumber = parseInt("1"+player.currentChallenge[player.currentChallenge.length-1]);
    const isInChallenge = player.currentChallenge !== "";
    const isInPreBreakChallenge = isInChallenge && !player.currentChallenge.includes("post");
    if (player.money.lt(Number.MAX_VALUE)) {
        return;
    }
    if (isInChallenge && player.money.lt(player.challengeTarget)) {
        return;
    }

    if ((player.bestInfinityTime > 60000 && !player.break) && implosionCheck === 0 && player.options.animations.bigCrunch) {
        implosionCheck = 1;
        document.body.style.animation = "implode 2s 1";
        setTimeout(function() {
            document.body.style.animation = "";
        }, 2000);
        setTimeout(bigCrunchReset, 1000);
        return
    }
    implosionCheck = 0;
    if (player.currentChallenge !== "" && !player.challenges.includes(player.currentChallenge)) {
        player.challenges.push(player.currentChallenge);
        Autobuyer.tryUnlockAny();
    }
    if (player.currentChallenge !== "" && player.challengeTimes[challNumber - 2] > player.thisInfinityTime) {
        setChallengeTime(challNumber - 2, player.thisInfinityTime);
    }
    if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber - 1] > player.thisInfinityTime) {
        setInfChallengeTime(challNumber - 1, player.thisInfinityTime);
    }
    if ((player.bestInfinityTime > 60000 && !player.break) || (player.currentChallenge !== "" && !player.options.retryChallenge)) showTab("dimensions");
    if (Challenge(9).isRunning) {
        kong.submitStats('Challenge 9 time record (ms)', Math.floor(player.thisInfinityTime * 100));
    }
    let infinityPoints = gainedInfinityPoints();
    player.infinityPoints = player.infinityPoints.plus(infinityPoints);
    addInfinityTime(player.thisInfinityTime, player.thisInfinityRealTime, infinityPoints);
    if (player.realities > 0 && Player.totalInfinitied === 0 && player.eternities === 0 && player.galaxies <= 1) {
      unlockRealityUpgrade(7);
    }

    if (player.realities > 0 && (player.eternities === 0 || (player.reality.upg.includes(10) && player.eternities === 100)) && player.infinitied === 0) {
        if (checkForRUPG8()) unlockRealityUpgrade(8);
    }

    if (autoS && auto) {
        let autoIp = infinityPoints.dividedBy(player.thisInfinityTime / 100);
        if (autoIp.gt(player.autoIP) && !player.break) player.autoIP = autoIp;
        if (player.thisInfinityTime < player.autoTime) player.autoTime = player.thisInfinityTime;
    }

    auto = autoS; //only allow autoing if prev crunch was autoed
    autoS = true;
    player.infinitied = player.infinitied + Math.round(gainedInfinities());
    player.bestInfinityTime = Math.min(player.bestInfinityTime, player.thisInfinityTime);

    if (EternityChallenge(4).isRunning && !EternityChallenge(4).isWithinRestriction) {
      failChallenge();
    }

    checkBigCrunchAchievements();
    if (!player.options.retryChallenge)
        player.currentChallenge = "";

    checkForEndMe();

    kong.submitStats('Infinitied', Player.totalInfinitied);
    kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime * 100));

    let currenReplicanti = player.replicanti.amount;
    let currentReplicantiGalaxies = player.replicanti.galaxies;
    secondSoftReset();

    if (Achievement(95).isEnabled) {
        player.replicanti.amount = currenReplicanti;
    }
    if (TimeStudy(33).isBought) {
        player.replicanti.galaxies = Math.floor(currentReplicantiGalaxies / 2);
    }

    if (player.eternities > 10 && !EternityChallenge(8).isRunning && !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning) {
        for (var i = 1; i < player.eternities - 9 && i < 9; i++) {
            if (player.infDimBuyers[i - 1]) {
                buyMaxInfDims(i);
                buyManyInfinityDimension(i)
            }
        }
    }

    autoBuyReplicantiUpgrades();

    if (Effarig.isRunning && !Effarig.has(EFFARIG_UNLOCKS.INFINITY_COMPLETE)) {
      Effarig.unlock(EFFARIG_UNLOCKS.INFINITY_COMPLETE);
      Modal.message.show("Effarig Infinity reward: Glyph Level cap raised to 3000 and IP multipliers apply up to 1e50; infinitied count raises replicanti limit and gives you free RG.");
    }
}

function secondSoftReset() {
    player.resets = 0;
    player.galaxies = 0;
    player.tickDecrease = 0.9;
    resetMoney();
    softReset(0);
    resetInfDimensions();
    IPminpeak = new Decimal(0);
    if (player.replicanti.unl)
        player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    player.thisInfinityTime = 0;
    player.thisInfinityRealTime = 0;
    Marathon2 = 0;
}

function checkBigCrunchAchievements() {
    giveAchievement("To infinity!");
    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
    if (player.infinitied > 0 && !Challenge(1).isCompleted) {
      Challenge(1).complete();
      Autobuyer.tryUnlockAny();
    }
    if (player.thisInfinityTime <= 7200000) giveAchievement("That's fast!");
    if (player.thisInfinityTime <= 600000) giveAchievement("That's faster!");
    if (player.thisInfinityTime <= 60000) giveAchievement("Forever isn't that long");
    if (player.thisInfinityTime <= 200) giveAchievement("Blink of an eye");
    if (player.eightAmount.eq(0)) giveAchievement("You didn't need it anyway");
    if (player.galaxies === 1) giveAchievement("Claustrophobic");
    if (player.galaxies === 0 && player.resets === 0) giveAchievement("Zero Deaths");
    if (Challenge(2).isRunning && player.thisInfinityTime <= 180000) giveAchievement("Many Deaths");
    if (Challenge(8).isRunning && player.thisInfinityTime <= 180000) giveAchievement("Gift from the Gods");
    if (Challenge(9).isRunning && player.thisInfinityTime <= 180000) giveAchievement("Is this hell?");
    if (Challenge(3).isRunning && player.thisInfinityTime <= 10000) giveAchievement("You did this again just for the achievement right?");
    if (player.firstAmount.eq(1) && player.resets === 0 && player.galaxies === 0 && Challenge(11).isRunning) giveAchievement("ERROR 909: Dimension not found");
    if (InfinityChallenge(5).isRunning && player.thisInfinityTime <= 10000) giveAchievement("Hevipelle did nothing wrong");
    if (player.challenges.length >= 2) giveAchievement("Daredevil");
    if (player.challenges.length === 12) giveAchievement("AntiChallenged");
    if (player.challenges.length > 12) giveAchievement("Infinitely Challenging");
    if (player.challenges.length === 20) giveAchievement("Anti-antichallenged");
    if (player.break && player.currentChallenge === "") {
        const infinityPoints = gainedInfinityPoints();
        if (infinityPoints.gte(1e150)) giveAchievement("All your IP are belong to us");
        if (infinityPoints.gte(1e200) && player.thisInfinityTime <= 2000) giveAchievement("Ludicrous Speed");
        if (infinityPoints.gte(1e250) && player.thisInfinityTime <= 20000) giveAchievement("I brake for nobody")
    }
    if (!Achievement(111).isUnlocked && player.lastTenRuns[9][1] !== 1) {
        var n = 0;
        for (i = 0; i < 9; i++) {
            if (player.lastTenRuns[i][1].gte(player.lastTenRuns[i + 1][1].times(Number.MAX_VALUE))) n++;
        }
        if (n === 9) giveAchievement("Yo dawg, I heard you liked infinities...")
    }
    if (player.bestInfinityTime <= 1) giveAchievement("Less than or equal to 0.001");
}

document.getElementById("bigcrunch").onclick = bigCrunchReset;

function totalIPMult() {
  if (Effarig.isRunning && !Effarig.has(EFFARIG_UNLOCKS.INFINITY_COMPLETE)) {
    return new Decimal(1);
  }
  let ipMult = InfinityUpgrade.ipMult.effectValue
    .times(kongIPMult)
    .timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141),
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );
  if (Enslaved.isRunning) return player.infMult.times(kongIPMult)
  return ipMult;
}

class InfinityUpgrade extends PurchasableMechanicState {
  constructor(config, requirement) {
    super(config, Currency.infinityPoints, () => player.infinityUpgrades);
    this._requirement = requirement;
  }

  get isAvailable() {
    return this._requirement === undefined || this._requirement.isBought;
  }
}

(function() {
  const db = GameDatabase.infinity.upgrades;
  const upgrade = (config, requirement) => new InfinityUpgrade(config, requirement);
  InfinityUpgrade.totalTimeMult = upgrade(db.totalTimeMult);
  InfinityUpgrade.dim18mult = upgrade(db.dim18mult, InfinityUpgrade.totalTimeMult);
  InfinityUpgrade.dim36mult = upgrade(db.dim36mult, InfinityUpgrade.dim18mult);
  InfinityUpgrade.resetBoost = upgrade(db.resetBoost, InfinityUpgrade.dim36mult);

  InfinityUpgrade.buy10Mult = upgrade(db.buy10Mult);
  InfinityUpgrade.dim27mult = upgrade(db.dim27mult, InfinityUpgrade.buy10Mult);
  InfinityUpgrade.dim45mult = upgrade(db.dim45mult, InfinityUpgrade.dim27mult);
  InfinityUpgrade.galaxyBoost = upgrade(db.galaxyBoost, InfinityUpgrade.dim45mult);

  InfinityUpgrade.thisInfinityTimeMult = upgrade(db.thisInfinityTimeMult);
  InfinityUpgrade.unspentIPMult = upgrade(db.unspentIPMult, InfinityUpgrade.thisInfinityTimeMult);
  InfinityUpgrade.dimboostMult = upgrade(db.dimboostMult, InfinityUpgrade.unspentIPMult);
  InfinityUpgrade.ipGen = upgrade(db.ipGen, InfinityUpgrade.dimboostMult);

  InfinityUpgrade.skipReset1 = upgrade(db.skipReset1);
  InfinityUpgrade.skipReset2 = upgrade(db.skipReset2, InfinityUpgrade.skipReset1);
  InfinityUpgrade.skipReset3 = upgrade(db.skipReset3, InfinityUpgrade.skipReset2);
  InfinityUpgrade.skipResetGalaxy = upgrade(db.skipResetGalaxy, InfinityUpgrade.skipReset3);
})();

class InfinityIPMultUpgrade extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get cost() {
    return this.config.cost();
  }

  get hasIncreasedCost() {
    return this.cost.gte(this.config.costIncreaseThreshold);
  }

  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  }

  get isCapped() {
    return this.cost.gte(this.config.costCap);
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return InfinityUpgrade.resetBoost.isBought &&
      InfinityUpgrade.galaxyBoost.isBought &&
      InfinityUpgrade.ipGen.isBought &&
      InfinityUpgrade.skipResetGalaxy.isBought;
  }

  get canBeBought() {
    return !this.isCapped && player.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  }

  purchase(amount = 1) {
    if (!this.canBeBought) return;
    const costIncrease = this.costIncrease;
    const mult = Decimal.pow(2, amount);
    player.infMult = player.infMult.times(mult);
    player.autoIP = player.autoIP.times(mult);
    Autobuyer.infinity.bumpLimit(mult);
    player.infMultCost = this.cost.times(Decimal.pow(costIncrease, amount));
    player.infinityPoints = player.infinityPoints.minus(this.cost.dividedBy(costIncrease));
    this.adjustToCap();
    GameUI.update();
  }

  adjustToCap() {
    if (this.isCapped) {
      const capOffset = this.config.cap.dividedBy(player.infMult);
      player.autoIP = player.autoIP.times(capOffset);
      player.infMult.copyFrom(this.config.cap);
      player.infMultCost.copyFrom(this.config.costCap);
    }
  }

  autobuyerTick() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      const buyUntil = Math.min(player.infinityPoints.exponent, this.config.costIncreaseThreshold.exponent);
      const purchases = buyUntil - this.cost.exponent + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to 1e3000000 and then it will go in this part)
    if (this.hasIncreasedCost) {
      const buyUntil = Math.min(player.infinityPoints.exponent, this.config.costCap.exponent);
      const purchases = Math.floor((buyUntil - player.infMultCost.exponent) / 10) + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
}

InfinityUpgrade.ipMult = new InfinityIPMultUpgrade(GameDatabase.infinity.upgrades.ipMult);

class BreakInfinityUpgrade extends PurchasableMechanicState {
  constructor(config) {
    super(config, Currency.infinityPoints, () => player.infinityUpgrades);
  }
}

(function() {
  const db = GameDatabase.infinity.breakUpgrades;
  const upgrade = props => new BreakInfinityUpgrade(props);
  BreakInfinityUpgrade.totalAMMult = upgrade(db.totalAMMult);
  BreakInfinityUpgrade.currentAMMult = upgrade(db.currentAMMult);
  BreakInfinityUpgrade.galaxyBoost = upgrade(db.galaxyBoost);

  BreakInfinityUpgrade.infinitiedMult = upgrade(db.infinitiedMult);
  BreakInfinityUpgrade.achievementMult = upgrade(db.achievementMult);
  BreakInfinityUpgrade.slowestChallengeMult = upgrade(db.slowestChallengeMult);

  BreakInfinityUpgrade.infinitiedGen = upgrade(db.infinitiedGen);
  BreakInfinityUpgrade.bulkDimBoost = upgrade(db.bulkDimBoost);
  BreakInfinityUpgrade.autobuyerSpeed = upgrade(db.autobuyerSpeed);
})();

class BreakInfinityMultiplierCostUpgrade extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get cost() {
    return this.config.cost();
  }

  get canBeApplied() {
    return this.boughtAmount > 0;
  }

  get boughtAmount() {
    return this.effectValue;
  }

  get isMaxed() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  get isAffordable() {
    return player.infinityPoints.gte(this.cost);
  }

  get canBeBought() {
    return !this.isMaxed && this.isAffordable;
  }

  purchase() {
    if (!this.canBeBought) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    player.infinityRebuyables[this.config.id]++;
    GameCache.dimensionMultDecrease.invalidate();
    GameCache.tickSpeedMultDecrease.invalidate();
    GameUI.update();
  }
}

BreakInfinityUpgrade.tickspeedCostMult = new BreakInfinityMultiplierCostUpgrade(
  GameDatabase.infinity.breakUpgrades.tickspeedCostMult
);

BreakInfinityUpgrade.dimCostMult = new BreakInfinityMultiplierCostUpgrade(
  GameDatabase.infinity.breakUpgrades.dimCostMult
);

class BreakInfinityIPGenUpgrade extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get cost() {
    return this.config.cost();
  }

  get isMaxed() {
    return player.offlineProd === 50;
  }

  get isAffordable() {
    return player.infinityPoints.gte(this.cost);
  }

  get canBeBought() {
    return !this.isMaxed && this.isAffordable;
  }

  purchase() {
    if (!this.canBeBought) return;
    player.infinityPoints = player.infinityPoints.minus(player.offlineProdCost);
    player.offlineProdCost *= 10;
    player.offlineProd += 5;
    GameUI.update();
  }
}

BreakInfinityUpgrade.ipGen = new BreakInfinityIPGenUpgrade(GameDatabase.infinity.breakUpgrades.ipGen);