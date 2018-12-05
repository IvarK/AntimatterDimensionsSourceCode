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
    if (player.currentChallenge === "challenge5") {
        kong.submitStats('Challenge 9 time record (ms)', Math.floor(player.thisInfinityTime * 100));
    }
    let infinityPoints = gainedInfinityPoints();
    player.infinityPoints = player.infinityPoints.plus(infinityPoints);
    addTime(player.thisInfinityTime, player.thisInfinityRealTime, infinityPoints);
    if (player.realities > 0 && Player.totalInfinitied === 0 && player.eternities === 0 && player.galaxies <= 1) {
      unlockRealityUpgrade(7);
    }
    if (player.currentEternityChall === "eterc4" && player.infinitied >= 16 - (ECTimesCompleted("eterc4") * 4)) {
        failChallenge();
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

    checkBigCrunchAchievements();
    if (!player.options.retryChallenge)
        player.currentChallenge = "";

    checkForEndMe();

    kong.submitStats('Infinitied', Player.totalInfinitied);
    kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime * 100));

    let currenReplicanti = player.replicanti.amount;
    let currentReplicantiGalaxies = player.replicanti.galaxies;
    secondSoftReset();

    if (isAchEnabled("r95")) {
        player.replicanti.amount = currenReplicanti;
    }
    if (TimeStudy(33).isBought) {
        player.replicanti.galaxies = Math.floor(currentReplicantiGalaxies / 2);
    }

    if (player.eternities > 10 && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc10") {
        for (var i = 1; i < player.eternities - 9 && i < 9; i++) {
            if (player.infDimBuyers[i - 1]) {
                buyMaxInfDims(i);
                buyManyInfinityDimension(i)
            }
        }
    }

    if (player.eternities >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.chanceCost) && player.currentEternityChall !== "eterc8" && player.replicanti.chance < 1) upgradeReplicantiChance()
    }

    if (player.eternities >= 60 && player.replicanti.auto[1] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && (TimeStudy(22).isBought ? player.replicanti.interval > 1 : player.replicanti.interval > 50)) upgradeReplicantiInterval()
    }

    if (player.eternities >= 80 && player.replicanti.auto[2] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.galCost)) upgradeReplicantiGalaxy()
    }

    updateChallengeTimes();
    updateLastTenRuns();
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
    if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) {
      player.challenges.push("challenge1");
      Autobuyer.tryUnlockAny();
    }
    if (player.thisInfinityTime <= 7200000) giveAchievement("That's fast!");
    if (player.thisInfinityTime <= 600000) giveAchievement("That's faster!");
    if (player.thisInfinityTime <= 60000) giveAchievement("Forever isn't that long");
    if (player.thisInfinityTime <= 200) giveAchievement("Blink of an eye");
    if (player.eightAmount === 0) giveAchievement("You didn't need it anyway");
    if (player.galaxies === 1) giveAchievement("Claustrophobic");
    if (player.galaxies === 0 && player.resets === 0) giveAchievement("Zero Deaths");
    if (player.currentChallenge === "challenge2" && player.thisInfinityTime <= 180000) giveAchievement("Many Deaths");
    if (player.currentChallenge === "challenge11" && player.thisInfinityTime <= 180000) giveAchievement("Gift from the Gods");
    if (player.currentChallenge === "challenge5" && player.thisInfinityTime <= 180000) giveAchievement("Is this hell?");
    if (player.currentChallenge === "challenge3" && player.thisInfinityTime <= 10000) giveAchievement("You did this again just for the achievement right?");
    if (player.firstAmount === 1 && player.resets === 0 && player.galaxies === 0 && player.currentChallenge === "challenge12") giveAchievement("ERROR 909: Dimension not found");
    if (player.currentChallenge === "postc5" && player.thisInfinityTime <= 10000) giveAchievement("Hevipelle did nothing wrong");
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
    if (!player.achievements.includes("r111") && player.lastTenRuns[9][1] !== 1) {
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
  let mult = player.infMult
    .times(kongIPMult)
    .timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143)
    );

  if (isAchEnabled("r85")) {
    mult = mult.times(4);
  }
  if (isAchEnabled("r93")) {
    mult = mult.times(4);
  }
  if (isAchEnabled("r116")) {
    mult = mult.times(Decimal.pow(2, Math.log10(Player.totalInfinitied + 1)));
  }
  if (isAchEnabled("r125")) {
    // All "this inf time" or "best inf time" mults are * 10
    const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
    mult = mult.times(Decimal.pow(2, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.11)));
  }
  if (isAchEnabled("r141")) {
    mult = mult.times(4);
  }
  if (player.dilation.upgrades.includes(7)) {
    mult = mult.times(player.dilation.dilatedTime.pow(1000).max(1));
  }
  return mult.times(Decimal.max(getAdjustedGlyphEffect("infinityipgain"), 1));
}

class InfinityUpgrade {
  constructor(props, requirement) {
    this._id = props.id;
    this._cost = props.cost;
    this._effect = props.effect;
    this._requirement = requirement;
  }

  get cost() {
    return this._cost;
  }
  
  get isBought() {
    return player.infinityUpgrades.includes(this._id);
  }

  get isAvailable() {
    return this.isRequirementSatisfied && player.infinityPoints.gte(this.cost) && !this.isBought;
  }

  get isRequirementSatisfied() {
    return this._requirement === undefined || this._requirement.isBought;
  }
  
  purchase() {
    if (!this.isAvailable) return;
    player.infinityUpgrades.push(this._id);
    player.infinityPoints = player.infinityPoints.minus(this._cost);
    GameUI.update();
  }

  get effectValue() {
    return this._effect();
  }

  applyEffect(applyFn) {
    if (this.isBought) {
      applyFn(this.effectValue);
    }
  }
}

(function() {
  const db = GameDatabase.infinity.upgrades;
  const upgrade = (props, requirement) => new InfinityUpgrade(props, requirement);
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

InfinityUpgrade.ipMult = {
  capValue: new Decimal("1e6000000"),
  costIncreaseThreshold: new Decimal("1e3000000"),
  get cost() {
    return player.infMultCost;
  },
  set cost(value) {
    player.infMultCost = value;
  },
  get hasIncreasedCost() {
    return this.cost.gte(this.costIncreaseThreshold);
  },
  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  },
  get isCapped() {
    return this.cost.gte(this.capValue);
  },
  get isRequirementSatisfied() {
    return InfinityUpgrade.resetBoost.isBought &&
      InfinityUpgrade.galaxyBoost.isBought &&
      InfinityUpgrade.ipGen.isBought &&
      InfinityUpgrade.skipResetGalaxy.isBought;
  },
  get effectValue() {
    return player.infMult;
  },
  get isAvailable() {
    return !this.isCapped && player.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  },
  purchase(amount = 1) {
    if (!this.isAvailable) return;
    const costIncrease = this.costIncrease;
    const mult = Decimal.pow(2, amount);
    player.infMult = player.infMult.times(mult);
    player.autoIP = player.autoIP.times(mult);
    Autobuyer.infinity.bumpLimit(mult);
    this.cost = this.cost.times(Decimal.pow(costIncrease, amount));
    player.infinityPoints = player.infinityPoints.minus(this.cost.dividedBy(costIncrease));
    GameUI.update();
  },
  autobuyerTick() {
    if (!this.isAvailable) return;
    if (!this.hasIncreasedCost) {
      const buyUntil = Math.min(player.infinityPoints.exponent, this.costIncreaseThreshold.exponent);
      const purchases = buyUntil - this.cost.exponent + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to 1e3000000 and then it will go in this part)
    if (this.hasIncreasedCost) {
      const buyUntil = Math.min(player.infinityPoints.exponent, this.capValue.exponent);
      const purchases = Math.floor((buyUntil - player.infMultCost.exponent) / 10) + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
};

class BreakInfinityUpgrade extends InfinityUpgrade {
  constructor(props) {
    super(props);
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

class BreakInfinityMultiplierCostUpgrade extends BreakInfinityUpgrade {
  constructor(props) {
    super(props);
    this._getCost = props.getCost;
    this._setCost = props.setCost;
    this._costIncrease = props.costIncrease;
    this._getValue = props.getValue;
    this._setValue = props.setValue;
    this._maxValue = props.maxValue;
    this._minValue = props.minValue;
  }

  get cost() {
    return this._getCost();
  }

  get isBought() {
    return this.effectValue <= this._minValue;
  }

  purchase() {
    if (!this.isAvailable) return;
    this._setValue(this.effectValue - 1);
    const cost = this.cost;
    player.infinityPoints = player.infinityPoints.minus(cost);
    this._setCost(cost * this._costIncrease);
    GameUI.update();
  }

  get effectValue() {
    return this._getValue();
  }

  get maxValue() {
    return this._maxValue;
  }
}

BreakInfinityUpgrade.tickspeedCostMult = new BreakInfinityMultiplierCostUpgrade({
  getCost: () => player.tickSpeedMultDecreaseCost,
  setCost: value => player.tickSpeedMultDecreaseCost = value,
  costIncrease: 5,
  getValue: () => player.tickSpeedMultDecrease,
  setValue: value => player.tickSpeedMultDecrease = value,
  maxValue: 10,
  minValue: 2
});
BreakInfinityUpgrade.dimCostMult = new BreakInfinityMultiplierCostUpgrade({
  getCost: () => player.dimensionMultDecreaseCost,
  setCost: value => player.dimensionMultDecreaseCost = value,
  costIncrease: 5000,
  getValue: () => player.dimensionMultDecrease,
  setValue: value => player.dimensionMultDecrease = value,
  maxValue: 10,
  minValue: 3
});

class BreakInfinityIPGenUpgrade extends BreakInfinityUpgrade {
  constructor() {
    super({});
  }

  get cost() {
    return player.offlineProdCost;
  }

  get isBought() {
    return player.offlineProd === 50;
  }

  purchase() {
    if (!this.isAvailable) return;
    player.infinityPoints = player.infinityPoints.minus(player.offlineProdCost);
    player.offlineProdCost *= 10;
    player.offlineProd += 5;
    GameUI.update();
  }

  get effectValue() {
    return player.offlineProd;
  }
}

BreakInfinityUpgrade.ipGen = new BreakInfinityIPGenUpgrade();