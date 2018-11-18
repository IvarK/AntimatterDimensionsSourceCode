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
    addTime(player.thisInfinityTime, infinityPoints);
    if (player.realities > 0 && getInfinitied() === 0 && player.eternities === 0 && player.galaxies <= 1) {
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

    kong.submitStats('Infinitied', getInfinitied());
    kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime * 100));

    let currenReplicanti = player.replicanti.amount;
    let currentReplicantiGalaxies = player.replicanti.galaxies;
    secondSoftReset();

    if (isAchEnabled("r95")) {
        player.replicanti.amount = currenReplicanti;
    }
    if (player.timestudy.studies.includes(33)) {
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
        while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && ((player.timestudy.studies.includes(22)) ? player.replicanti.interval > 1 : player.replicanti.interval > 50)) upgradeReplicantiInterval()
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
    updateAutobuyers();
    resetInfDimensions();
    IPminpeak = new Decimal(0);
    if (player.replicanti.unl)
        player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    player.thisInfinityTime = 0;
    updateChallengeElements();
    Marathon2 = 0;
}

function updateChallengeElements() {
    if (player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6")
        document.getElementById("matter").style.display = "block";
    else
        document.getElementById("matter").style.display = "none";
}

function checkBigCrunchAchievements() {
    giveAchievement("To infinity!");
    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
    if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
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
  let mult = player.infMult.times(kongIPMult);
  if (player.timestudy.studies.includes(41)) {
    mult = mult.times(Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies));
  }
  if (player.timestudy.studies.includes(51)) {
    mult = mult.times(1e15);
  }
  // All "this inf time" or "best inf time" mults are * 10
  const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
  const timStudyMult = Decimal.pow(15, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.125));
  if (player.timestudy.studies.includes(141)) {
    mult = mult.times(Decimal.divide(1e45, timStudyMult).max(1));
  }
  if (player.timestudy.studies.includes(142)) {
    mult = mult.times(1e25);
  }
  if (player.timestudy.studies.includes(143)) {
    mult = mult.times(timStudyMult);
  }
  if (isAchEnabled("r85")) {
    mult = mult.times(4);
  }
  if (isAchEnabled("r93")) {
    mult = mult.times(4);
  }
  if (isAchEnabled("r116")) {
    mult = mult.times(Decimal.pow(2, Math.log10(getInfinitied() + 1)));
  }
  if (isAchEnabled("r125")) {
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
  constructor(props) {
    this._id = props.id;
    this._cost = props.cost;
    this._requirement = props.requirement;
    this._staticEffect = props.staticEffect;
    this._dynamicEffect = props.dynamicEffect;
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

  get hasStaticEffect() {
    return this._staticEffect !== undefined;
  }

  get hasDynamicEffect() {
    return this._dynamicEffect !== undefined;
  }

  get effectValue() {
    return this.hasStaticEffect ? this._staticEffect : this._dynamicEffect();
  }

  apply(applyFn) {
    if (this.isBought) {
      applyFn(this.effectValue);
    }
  }
}

InfinityUpgrade.totalTimeMult = new InfinityUpgrade({
  id: "timeMult",
  cost: 1,
  dynamicEffect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15)
});
InfinityUpgrade.dimInfinityMult = () => 1 + (getInfinitied() * 0.2);
InfinityUpgrade.dim18mult = new InfinityUpgrade({
  id: "18Mult",
  cost: 1,
  requirement: InfinityUpgrade.totalTimeMult,
  dynamicEffect: InfinityUpgrade.dimInfinityMult
});
InfinityUpgrade.dim36mult = new InfinityUpgrade({
  id: "36Mult",
  cost: 1,
  requirement: InfinityUpgrade.dim18mult,
  dynamicEffect: InfinityUpgrade.dimInfinityMult
});
InfinityUpgrade.resetBoost = new InfinityUpgrade({
  id: "resetBoost",
  cost: 1,
  requirement: InfinityUpgrade.dim36mult,
  staticEffect: 9
});

InfinityUpgrade.buy10Mult = new InfinityUpgrade({
  id: "dimMult",
  cost: 1,
  staticEffect: 1.1
});
InfinityUpgrade.dim27mult = new InfinityUpgrade({
  id: "27Mult",
  cost: 1,
  requirement: InfinityUpgrade.buy10Mult,
  dynamicEffect: InfinityUpgrade.dimInfinityMult
});
InfinityUpgrade.dim45mult = new InfinityUpgrade({
  id: "45Mult",
  cost: 1,
  requirement: InfinityUpgrade.dim27mult,
  dynamicEffect: InfinityUpgrade.dimInfinityMult
});
InfinityUpgrade.galaxyBoost = new InfinityUpgrade({
  id: "galaxyBoost",
  cost: 2,
  requirement: InfinityUpgrade.dim45mult,
  staticEffect: 2
});

InfinityUpgrade.thisInfinityTimeMult = new InfinityUpgrade({
  id: "timeMult2",
  cost: 3,
  dynamicEffect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1)
});
InfinityUpgrade.unspentIPMult = new InfinityUpgrade({
  id: "unspentBonus",
  cost: 5,
  requirement: InfinityUpgrade.thisInfinityTimeMult,
  dynamicEffect: () => player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
});
InfinityUpgrade.dimboostMult = new InfinityUpgrade({
  id: "resetMult",
  cost: 7,
  requirement: InfinityUpgrade.unspentIPMult,
  staticEffect: 2.5
});
InfinityUpgrade.ipGen = new InfinityUpgrade({
  id: "passiveGen",
  cost: 10,
  requirement: InfinityUpgrade.dimboostMult
});

InfinityUpgrade.skipReset1 = new InfinityUpgrade({
  id: "skipReset1",
  cost: 20
});
InfinityUpgrade.skipReset2 = new InfinityUpgrade({
  id: "skipReset2",
  cost: 40,
  requirement: InfinityUpgrade.skipReset1
});
InfinityUpgrade.skipReset3 = new InfinityUpgrade({
  id: "skipReset3",
  cost: 80,
  requirement: InfinityUpgrade.skipReset2
});
InfinityUpgrade.skipResetGalaxy = new InfinityUpgrade({
  id: "skipResetGalaxy",
  cost: 300,
  requirement: InfinityUpgrade.skipReset3
});

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

BreakInfinityUpgrade.totalAMMult = new BreakInfinityUpgrade({
  id: "totalMult",
  cost: 1e4,
  dynamicEffect: () => Math.pow(player.totalmoney.exponent + 1, 0.5)
});
BreakInfinityUpgrade.currentAMMult = new BreakInfinityUpgrade({
  id: "currentMult",
  cost: 5e4,
  dynamicEffect: () => Math.pow(player.money.exponent + 1, 0.5)
});
BreakInfinityUpgrade.galaxyBoost = new BreakInfinityUpgrade({
  id: "postGalaxy",
  cost: 5e11,
  staticEffect: 1.5
});

BreakInfinityUpgrade.infinitiedMult = new BreakInfinityUpgrade({
  id: "infinitiedMult",
  cost: 1e5,
  dynamicEffect: () => 1 + Math.log10(getInfinitied() + 1) * 10
});
BreakInfinityUpgrade.achievementMult = new BreakInfinityUpgrade({
  id: "achievementMult",
  cost: 1e6,
  dynamicEffect: () => Math.max(Math.pow((player.achievements.length - 30 - getSecretAchAmount()), 3) / 40, 1)
});
BreakInfinityUpgrade.slowestChallengeMult = new BreakInfinityUpgrade({
  id: "challengeMult",
  cost: 1e7,
  dynamicEffect: () => Decimal.max(10 * 3000 / worstChallengeTime, 1)
});

BreakInfinityUpgrade.infinitiedGen = new BreakInfinityUpgrade({
  id: "infinitiedGeneration",
  cost: 2e7
});
BreakInfinityUpgrade.bulkDimBoost = new BreakInfinityUpgrade({
  id: "bulkBoost",
  cost: 5e9
});
BreakInfinityUpgrade.autobuyerSpeed = new BreakInfinityUpgrade({
  id: "autoBuyerUpgrade",
  cost: 1e15
});

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
    player.infinityPoints = player.infinityPoints.minus(cost)
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