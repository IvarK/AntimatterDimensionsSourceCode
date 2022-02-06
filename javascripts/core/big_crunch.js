import { GameMechanicState, SetPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";
import { SpeedrunMilestones } from "./speedrun.js";

export function bigCrunchAnimation() {
  document.body.style.animation = "implode 2s 1";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 2000);
}

function handleChallengeCompletion() {
  const challenge = Player.antimatterChallenge;
  if (!challenge && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }
  if (!challenge) return;
  challenge.complete();
  challenge.updateChallengeTime();
  if (!player.options.retryChallenge) {
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;
  }
}

export function bigCrunchResetRequest(disableAnimation = false) {
  if (!Player.canCrunch) return;
  if (!disableAnimation && player.options.animations.bigCrunch && document.body.style.animation === "") {
    bigCrunchAnimation();
    setTimeout(bigCrunchReset, 1000);
  } else {
    bigCrunchReset();
  }
}

export function bigCrunchReset() {
  if (!Player.canCrunch) return;

  const firstInfinity = !PlayerProgress.infinityUnlocked();
  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_BEFORE);

  bigCrunchUpdateStatistics();

  const infinityPoints = gainedInfinityPoints();
  Currency.infinityPoints.add(infinityPoints);
  Currency.infinities.add(gainedInfinities().round());

  bigCrunchTabChange(firstInfinity);
  bigCrunchResetValues();
  bigCrunchCheckUnlocks();

  if (Pelle.isDoomed) PelleStrikes.infinity.trigger();

  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_AFTER);
  if (firstInfinity && !Pelle.isDoomed) Modal.message.show(`Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter
  Galaxies are reset, but in return, you gain an Infinity Point (IP). This allows you to buy multiple upgrades that
  you can find in the Infinity tab. You will also gain one Infinity, which is the stat shown in the Statistics 
  tab.`);
}

function bigCrunchUpdateStatistics() {
  player.records.bestInfinity.bestIPminEternity =
    player.records.bestInfinity.bestIPminEternity.clampMin(player.records.thisInfinity.bestIPmin);
  player.records.thisInfinity.bestIPmin = DC.D0;

  player.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs.clampMin(
    gainedInfinities().round().dividedBy(Math.clampMin(33, player.records.thisInfinity.realTime))
  );

  const infinityPoints = gainedInfinityPoints();

  addInfinityTime(
    player.records.thisInfinity.time,
    player.records.thisInfinity.realTime,
    infinityPoints,
    gainedInfinities().round()
  );

  player.records.bestInfinity.time =
    Math.min(player.records.bestInfinity.time, player.records.thisInfinity.time);
  player.records.bestInfinity.realTime =
    Math.min(player.records.bestInfinity.realTime, player.records.thisInfinity.realTime);

  player.requirementChecks.reality.noInfinities = false;

  if (!player.requirementChecks.infinity.maxAll) {
    const bestIpPerMsWithoutMaxAll = infinityPoints.dividedBy(Math.clampMin(33, player.records.thisInfinity.realTime));
    player.records.thisEternity.bestIPMsWithoutMaxAll =
      Decimal.max(bestIpPerMsWithoutMaxAll, player.records.thisEternity.bestIPMsWithoutMaxAll);
  }
}

function bigCrunchTabChange(firstInfinity) {
  const earlyGame = player.records.bestInfinity.time > 60000 && !player.break;
  const inAntimatterChallenge = Player.isInAntimatterChallenge;
  handleChallengeCompletion();

  if (firstInfinity) {
    Tab.infinity.upgrades.show();
  } else if (earlyGame || (inAntimatterChallenge && !player.options.retryChallenge)) {
    Tab.dimensions.antimatter.show();
  }
}

export function bigCrunchResetValues() {
  const currentReplicanti = Replicanti.amount;
  const currentReplicantiGalaxies = player.replicanti.galaxies;
  // For unknown reasons, everything but keeping of RGs (including resetting of RGs)
  // is done in the function called below. For now, we're just trying to keep
  // code structure similar to what it was before to avoid new bugs.
  secondSoftReset(true);

  let remainingGalaxies = 0;
  if (Achievement(95).isUnlocked) {
    Replicanti.amount = currentReplicanti;
    remainingGalaxies += Math.min(currentReplicantiGalaxies, 1);
  }
  if (TimeStudy(33).isBought) {
    remainingGalaxies += Math.floor(currentReplicantiGalaxies / 2);
  }

  if (PelleUpgrade.replicantiGalaxyNoReset.canBeApplied) {
    remainingGalaxies = currentReplicantiGalaxies;
  }
  // I don't think this Math.clampMax is technically needed, but if we add another source
  // of keeping Replicanti Galaxies then it might be.
  player.replicanti.galaxies = Math.clampMax(remainingGalaxies, currentReplicantiGalaxies);
}

function bigCrunchCheckUnlocks() {
  if (EternityChallenge(4).tryFail()) return;

  if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
    EffarigUnlock.infinity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function secondSoftReset(forcedNDReset = false) {
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.records.thisInfinity.maxAM = DC.D0;
  Currency.antimatter.reset();
  softReset(0, forcedNDReset);
  InfinityDimensions.resetAmount();
  if (player.replicanti.unl) Replicanti.amount = DC.D1;
  player.replicanti.galaxies = 0;
  player.records.thisInfinity.time = 0;
  player.records.thisInfinity.lastBuyTime = 0;
  player.records.thisInfinity.realTime = 0;
  Player.resetRequirements("infinity");
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

export class InfinityUpgrade extends SetPurchasableMechanicState {
  constructor(config, requirement) {
    super(config);
    if (Array.isArray(requirement) || typeof requirement === "function") {
      this._requirements = requirement;
    } else if (requirement === undefined) {
      this._requirements = [];
    } else {
      this._requirements = [requirement];
    }
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
    return typeof this._requirements === "function" ? this._requirements()
      : this._requirements.every(x => x.isBought);
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      // This applies the 4th column of infinity upgrades retroactively
      if (this.config.id.includes("skip")) skipResetsIfPossible();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined;
  }

  get isCharged() {
    return player.celestials.ra.charged.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      Ra.chargesLeft !== 0 &&
      !Pelle.isDisabled("chargedInfinityUpgrades");
  }

  charge() {
    player.celestials.ra.charged.add(this.id);
  }

  disCharge() {
    player.celestials.ra.charged.delete(this.id);
  }
}

export function totalIPMult() {
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) {
    return DC.D1;
  }
  let ipMult = DC.D1
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
  ipMult = ipMult.times(Replicanti.amount.powEffectOf(AlchemyResource.exponential));
  return ipMult;
}

export function disChargeAll() {
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

  InfinityUpgrade.ipOffline = upgrade(db.ipOffline, () => Achievement(41).isUnlocked);
}());

// The repeatable 2xIP upgrade has an odd cost structure - it follows a shallow exponential (step *10) up to e3M, at
// which point it follows a steeper one (step *1e10) up to e6M before finally hardcapping. At the hardcap, there's
// an extra bump that increases the multipler itself from e993k to e1M. All these numbers are specified in
// GameDatabase.infinity.upgrades.ipMult
class InfinityIPMultUpgrade extends GameMechanicState {
  get cost() {
    if (this.purchaseCount >= this.purchasesAtIncrease) {
      return this.config.costIncreaseThreshold
        .times(Decimal.pow(this.costIncrease, this.purchaseCount - this.purchasesAtIncrease));
    }
    return Decimal.pow(this.costIncrease, this.purchaseCount + 1);
  }

  get purchaseCount() {
    return player.infMult;
  }

  get purchasesAtIncrease() {
    return this.config.costIncreaseThreshold.log10() - 1;
  }

  get hasIncreasedCost() {
    return this.purchaseCount >= this.purchasesAtIncrease;
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
    return Achievement(41).isUnlocked;
  }

  get canBeBought() {
    return !this.isCapped && Currency.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  }

  // This is only ever called with amount = 1 or within buyMax under conditions that ensure the scaling doesn't
  // change mid-purchase
  purchase(amount = 1) {
    if (!this.canBeBought) return;
    if (!TimeStudy(181).isBought) {
      Autobuyer.bigCrunch.bumpAmount(DC.D2.pow(amount));
    }
    Currency.infinityPoints.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    player.infMult += amount;
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      // Only allow IP below the softcap to be used
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costIncreaseThreshold);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costCap);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
}

InfinityUpgrade.ipMult = new InfinityIPMultUpgrade(GameDatabase.infinity.upgrades.ipMult);

export class BreakInfinityUpgrade extends SetPurchasableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  onPurchased() {
    if (this.id === "postGalaxy") {
      SpeedrunMilestones(7).tryComplete();
      PelleStrikes.powerGalaxies.trigger();
    }
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
  BreakInfinityUpgrade.autobuyMaxDimboosts = upgrade(db.autobuyMaxDimboosts);
  BreakInfinityUpgrade.autobuyerSpeed = upgrade(db.autobuyerSpeed);
}());

class RebuyableBreakInfinityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get boughtAmount() {
    return player.infinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.infinityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount === this.config.maxUpgrades;
  }
}

BreakInfinityUpgrade.tickspeedCostMult = new class extends RebuyableBreakInfinityUpgradeState {
  onPurchased() {
    GameCache.tickSpeedMultDecrease.invalidate();
  }
}(GameDatabase.infinity.breakUpgrades.tickspeedCostMult);

BreakInfinityUpgrade.dimCostMult = new class extends RebuyableBreakInfinityUpgradeState {
  onPurchased() {
    GameCache.dimensionMultDecrease.invalidate();
  }
}(GameDatabase.infinity.breakUpgrades.dimCostMult);

BreakInfinityUpgrade.ipGen = new RebuyableBreakInfinityUpgradeState(GameDatabase.infinity.breakUpgrades.ipGen);

export function preProductionGenerateIP(diff) {
  if (InfinityUpgrade.ipGen.isBought) {
    const genPeriod = Time.bestInfinity.totalMilliseconds * 10;
    let genCount;
    if (diff >= 1e300 * genPeriod) {
      genCount = Decimal.div(diff, genPeriod);
    } else {
      // Partial progress (fractions from 0 to 1) are stored in player.partInfinityPoint
      player.partInfinityPoint += diff / genPeriod;
      genCount = Math.floor(player.partInfinityPoint);
      player.partInfinityPoint -= genCount;
    }
    let gainedPerGen = InfinityUpgrade.ipGen.effectValue;
    if (Laitela.isRunning) gainedPerGen = dilatedValueOf(gainedPerGen);
    const gainedThisTick = new Decimal(genCount).times(gainedPerGen);
    Currency.infinityPoints.add(gainedThisTick);
  }
  Currency.infinityPoints.add(BreakInfinityUpgrade.ipGen.effectOrDefault(DC.D0).times(diff / 60000));
}
