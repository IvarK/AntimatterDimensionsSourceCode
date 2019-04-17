function bigCrunchAnimation() {
  document.body.style.animation = "implode 2s 1";
  setTimeout(() => {
      document.body.style.animation = "";
  }, 2000);
  setTimeout(bigCrunchReset(true), 1000);
}

function bigCrunchReset(disableAnimation = false) {
  const challenge = NormalChallenge.current() || InfinityChallenge.current();
  if (player.money.lt(Decimal.MAX_NUMBER) || (challenge && player.money.lt(challenge.goal))) {
    return;
  }
  const earlyGame = player.bestInfinityTime > 60000 && !player.break;
  if (earlyGame && !disableAnimation && player.options.animations.bigCrunch) {
    bigCrunchAnimation();
    return;
  }
  EventHub.dispatch(GameEvent.BIG_CRUNCH_BEFORE);
  if (challenge) {
    if (!challenge.isCompleted) {
      challenge.complete();
      Autobuyer.tryUnlockAny();
    }
    challenge.updateChallengeTime();
  }
  if (earlyGame || (challenge && !player.options.retryChallenge)) showTab("dimensions");
  if (NormalChallenge(9).isRunning) {
    kong.submitStats('NormalChallenge 9 time record (ms)', Math.floor(player.thisInfinityTime));
  }
  let infinityPoints = gainedInfinityPoints();
  player.infinityPoints = player.infinityPoints.plus(infinityPoints);
  addInfinityTime(player.thisInfinityTime, player.thisInfinityRealTime, infinityPoints);
  RealityUpgrades.tryUnlock([7, 8]);

  if (autoS && auto) {
    let autoIp = infinityPoints.dividedBy(player.thisInfinityTime / 100);
    if (autoIp.gt(player.autoIP) && !player.break) player.autoIP = autoIp;
    if (player.thisInfinityTime < player.autoTime) player.autoTime = player.thisInfinityTime;
  }
  auto = autoS; //only allow autoing if prev crunch was autoed
  autoS = true;
  player.infinitied = player.infinitied.plus(gainedInfinities().round());
  player.bestInfinityTime = Math.min(player.bestInfinityTime, player.thisInfinityTime);
  if (EternityChallenge(4).isRunning && !EternityChallenge(4).isWithinRestriction) {
    failChallenge();
  }
  if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
    Autobuyer.tryUnlockAny();
  }
  if (!player.options.retryChallenge) {
    player.currentChallenge = "";
  }

  // FIXME: Infinitified is now Decimal so decide what happens here!
  //kong.submitStats('Infinitied', Player.totalInfinitied);
  kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime));

  const currenReplicanti = player.replicanti.amount;
  const currentReplicantiGalaxies = player.replicanti.galaxies;
  secondSoftReset();

  if (Achievement(95).isEnabled) {
    player.replicanti.amount = currenReplicanti;
  }
  if (TimeStudy(33).isBought) {
    player.replicanti.galaxies = Math.floor(currentReplicantiGalaxies / 2);
  }

  if (player.eternities > 10 && !EternityChallenge(8).isRunning && !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning) {
    for (let i = 1; i < player.eternities - 9 && i < 9; i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i);
        buyManyInfinityDimension(i)
      }
    }
  }

  autoBuyReplicantiUpgrades();

  if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
    EffarigUnlock.infinity.unlock();
    Modal.message.show(`Effarig Infinity reward: Glyph Level cap raised to ${Effarig.glyphLevelCap} and IP multipliers apply up to 1e50; infinitied count raises replicanti limit and gives you free RG.`);
  }
  EventHub.dispatch(GameEvent.BIG_CRUNCH_AFTER);

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
    AchievementTimers.marathon2.reset();
}

document.getElementById("bigcrunch").onclick = bigCrunchReset;

function totalIPMult() {
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) {
    return new Decimal(1);
  }
  let ipMult = new Decimal(1)
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
      InfinityUpgrade.ipMult,
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );
  return ipMult;
}

class ChargedInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get canBeApplied() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

class InfinityUpgrade extends PurchasableMechanicState {
  constructor(config, requirement) {
    super(config, Currency.infinityPoints, () => player.infinityUpgrades);
    this._requirement = requirement;
    if (config.charged) {
      this._chargedEffect = new ChargedInfinityUpgradeState(config.charged, this);
    }
  }

  get isAvailable() {
    return this._requirement === undefined || this._requirement.isBought;
  }

  get canBeApplied() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) return true;
    if (this.isCharged) {
      this.disCharge();
      return true;
    }
    if (this.canCharge) {
      this.charge();
      return true;
    }
    return false;
  }

  get isCharged() {
    return player.celestials.ra.charged.has(this.id);
  }

  get canCharge() {
    return this.isBought && !this.isCharged && !this.config.bannedFromCharging && Ra.chargesLeft !== 0;
  }

  charge() {
    player.celestials.ra.charged.add(this.id);
  }

  disCharge() {
    player.celestials.ra.charged.delete(this.id);
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
}());

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

  get canBeApplied() {
    return true;
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
      const capOffset = this.config.cap().dividedBy(player.infMult);
      player.autoIP = player.autoIP.times(capOffset);
      player.infMult.copyFrom(this.config.cap());
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
