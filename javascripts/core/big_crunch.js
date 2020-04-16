"use strict";

function bigCrunchAnimation() {
  document.body.style.animation = "implode 2s 1";
  setTimeout(() => {
      document.body.style.animation = "";
  }, 2000);
}

function canCrunch() {
  if (Enslaved.isRunning && NormalChallenge.isRunning &&
    !Enslaved.BROKEN_CHALLENGE_EXEMPTIONS.includes(NormalChallenge.current.id)) {
    return true;
  }
  const challenge = NormalChallenge.current || InfinityChallenge.current;
  const goal = challenge === undefined ? Decimal.NUMBER_MAX_VALUE : challenge.goal;
  if (player.thisInfinityMaxAM.lt(goal)) return false;
  return true;
}

function handleChallengeCompletion() {
  if (!NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }
  const challenge = NormalChallenge.current || InfinityChallenge.current;
  if (!challenge) return;
  challenge.complete();
  challenge.updateChallengeTime();
  if (!player.options.retryChallenge) {
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;
  }
}

function bigCrunchResetRequest(disableAnimation = false) {
  if (!canCrunch()) return;
  const earlyGame = player.bestInfinityTime > 60000 && !player.break;
  if (earlyGame && !disableAnimation && player.options.animations.bigCrunch) {
    bigCrunchAnimation();
    setTimeout(bigCrunchReset(), 1000);
  } else {
    bigCrunchReset();
  }
}

function bigCrunchReset() {
  if (!canCrunch()) return;
  player.bestIPminThisEternity = player.bestIPminThisEternity.clampMin(player.bestIPminThisInfinity);
  player.bestIPminThisInfinity = new Decimal(0);

  player.bestInfinitiesPerMs = player.bestInfinitiesPerMs.clampMin(
    gainedInfinities().round().dividedBy(player.thisInfinityRealTime)
  );

  const earlyGame = player.bestInfinityTime > 60000 && !player.break;
  const challenge = NormalChallenge.current || InfinityChallenge.current;
  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_BEFORE);
  handleChallengeCompletion();

  if (earlyGame || (challenge && !player.options.retryChallenge)) {
    Tab.dimensions.normal.show();
  }
  const infinityPoints = gainedInfinityPoints();
  player.infinityPoints = player.infinityPoints.plus(infinityPoints);
  addInfinityTime(player.thisInfinityTime, player.thisInfinityRealTime, infinityPoints, gainedInfinities().round());

  player.infinitied = player.infinitied.plus(gainedInfinities().round());
  player.bestInfinityTime = Math.min(player.bestInfinityTime, player.thisInfinityTime);
  
  player.noInfinitiesThisReality = false;

  if (!player.usedMaxAll) {
    const bestIpPerMsWithoutMaxAll = infinityPoints.dividedBy(player.thisInfinityRealTime);
    player.bestIpPerMsWithoutMaxAll = Decimal.max(bestIpPerMsWithoutMaxAll, player.bestIpPerMsWithoutMaxAll);
  }
  player.usedMaxAll = false;

  if (EternityChallenge(4).tryFail()) return;

  const currentReplicanti = player.replicanti.amount;
  const currentReplicantiGalaxies = player.replicanti.galaxies;
  secondSoftReset(true);

  if (Achievement(95).isUnlocked) {
    player.replicanti.amount = currentReplicanti;
  }
  if (TimeStudy(33).isBought) {
    player.replicanti.galaxies = Math.floor(currentReplicantiGalaxies / 2);
  }

  if (EternityMilestone.autobuyerID(1).isReached &&
      !EternityChallenge(8).isRunning &&
      !EternityChallenge(2).isRunning &&
      !EternityChallenge(10).isRunning) {
    for (let i = 1; i <= player.eternities.sub(10).clampMax(8).toNumber(); i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i);
        buyManyInfinityDimension(i);
      }
    }
  }

  autoBuyReplicantiUpgrades();

  if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
    EffarigUnlock.infinity.unlock();
    beginProcessReality(getRealityProps(true));
  }
  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_AFTER);

}

function secondSoftReset(forcedNDReset = false) {
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.antimatter = Player.startingAM;
  player.thisInfinityMaxAM = Player.startingAM;
  softReset(0, forcedNDReset);
  InfinityDimensions.resetAmount();
  if (player.replicanti.unl)
    player.replicanti.amount = new Decimal(1);
  player.replicanti.galaxies = 0;
  player.thisInfinityTime = 0;
  player.thisInfinityLastBuyTime = 0;
  player.thisInfinityRealTime = 0;
  player.noEighthDimensions = true;
  player.noSacrifices = true;
  AchievementTimers.marathon2.reset();
}

class ChargedInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

class InfinityUpgrade extends SetPurchasableMechanicState {
  constructor(config, requirement) {
    super(config);
    this._requirement = requirement;
    if (config.charged) {
      this._chargedEffect = new ChargedInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isAvailableForPurchase() {
    return this._requirement === undefined || this._requirement.isBought;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) return true;
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

function totalIPMult() {
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) {
    return new Decimal(1);
  }
  let ipMult = new Decimal(1)
    .times(ShopPurchase.IPPurchases.currentMult)
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
      Achievement(141).effects.ipGain,
      InfinityUpgrade.ipMult,
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );
  ipMult = ipMult.times(player.replicanti.amount.powEffectOf(AlchemyResource.exponential));
  return ipMult;
}

function disChargeAll() {
  const upgrades = [
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.dim18mult,
    InfinityUpgrade.dim36mult,
    InfinityUpgrade.resetBoost,
    InfinityUpgrade.buy10Mult,
    InfinityUpgrade.dim27mult,
    InfinityUpgrade.dim45mult,
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.thisInfinityTimeMult,
    InfinityUpgrade.unspentIPMult,
    InfinityUpgrade.dimboostMult,
    InfinityUpgrade.ipGen
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.ra.disCharge = false;
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

  InfinityUpgrade.ipOffline = upgrade(db.ipOffline, InfinityUpgrade.totalTimeMult);
}());

class InfinityIPMultUpgrade extends GameMechanicState {
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
    const mult = Decimal.pow(2, amount);
    player.infMult = player.infMult.times(mult);
    if (!TimeStudy(181).isBought) {
      Autobuyer.bigCrunch.bumpAmount(mult);
    }
    const costIncrease = this.costIncrease;
    player.infMultCost = this.cost.times(Decimal.pow(costIncrease, amount));
    player.infinityPoints = player.infinityPoints.minus(this.cost.dividedBy(costIncrease));
    this.adjustToCap();
    GameUI.update();
  }

  adjustToCap() {
    if (this.isCapped) {
      player.infMult.copyFrom(this.config.cap());
      player.infMultCost.copyFrom(this.config.costCap);
    }
  }

  autobuyerTick() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      // The purchase at 1e3000000 is considered post-softcap because that purchase increases the cost by 1e10x.
      const buyUntil = Math.min(player.infinityPoints.exponent, this.config.costIncreaseThreshold.exponent - 1);
      const purchases = buyUntil - this.cost.exponent + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const buyUntil = Math.min(player.infinityPoints.exponent, this.config.costCap.exponent);
      const purchases = Math.floor((buyUntil - player.infMultCost.exponent) / 10) + 1;
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
}

InfinityUpgrade.ipMult = new InfinityIPMultUpgrade(GameDatabase.infinity.upgrades.ipMult);

class BreakInfinityUpgrade extends SetPurchasableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
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
}());

class BreakInfinityMultiplierCostUpgrade extends RebuyableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get boughtAmount() {
    return player.infinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.infinityRebuyables[this.id] = value;
  }

  get isMaxed() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  get isAvailableForPurchase() {
    return !this.isMaxed;
  }

  purchase() {
    if (!super.purchase()) return false;
    GameCache.dimensionMultDecrease.invalidate();
    GameCache.tickSpeedMultDecrease.invalidate();
    return true;
  }
}

BreakInfinityUpgrade.tickspeedCostMult = new BreakInfinityMultiplierCostUpgrade(
  GameDatabase.infinity.breakUpgrades.tickspeedCostMult
);

BreakInfinityUpgrade.dimCostMult = new BreakInfinityMultiplierCostUpgrade(
  GameDatabase.infinity.breakUpgrades.dimCostMult
);

class BreakInfinityIPGenUpgrade extends GameMechanicState {
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

function preProductionGenerateIP(diff) {
  if (InfinityUpgrade.ipGen.isBought) {
    const genPeriod = Time.bestInfinity.totalMilliseconds * 10;
    // Partial progress (fractions from 0 to 1) are stored in player.partInfinityPoint
    player.partInfinityPoint += diff / genPeriod;
    if (player.partInfinityPoint >= 1) {
      const genCount = Math.floor(player.partInfinityPoint);
      let gainedPerGen = InfinityUpgrade.ipGen.effectValue;
      if (Laitela.isRunning) gainedPerGen = dilatedValueOf(gainedPerGen, 1);
      const gainedThisTick = new Decimal(genCount).times(gainedPerGen);
      player.infinityPoints = player.infinityPoints.plus(gainedThisTick);
      player.partInfinityPoint -= genCount;
    }
  }
  player.infinityPoints = player.infinityPoints
    .plus(Player.bestRunIPPM.times(player.offlineProd / 100).times(diff / 60000));
}
