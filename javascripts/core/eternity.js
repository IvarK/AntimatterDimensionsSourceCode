"use strict";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Math.min(player.records.thisEternity.time, player.records.bestEternity.time);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = new Decimal(RealityUpgrade(3).effectOrDefault(1))
    .times(getAdjustedGlyphEffect("timeetermult"));
  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  addEternityTime(
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  Currency.eternities.add(newEternities);

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion();
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion();
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.etercreq = 0;
    respecTimeStudies(auto);
  }

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    RealityUpgrade(3).effectOrDefault(1) / Math.clampMin(33, player.records.thisEternity.realTime)
  );
  player.records.bestEternity.bestEPminReality =
    player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);

  Currency.infinitiesBanked.value = Currency.infinitiesBanked.value.plusEffectsOf(
    Achievement(131),
    TimeStudy(191)
  );

  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

function eternityAnimation() {
  document.body.style.animation = "eternify 3s 1";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 3000);
}

function eternityResetRequest() {
  if (!Player.canEternity) return;
  askEternityConfirmation();
}

function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  if (force) {
    player.challenge.eternity.current = 0;
  } else {
    if (!Player.canEternity) return false;
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    if (!player.dilation.active) giveEternityRewards(auto);
    // If somehow someone manages to force their first eternity
    // (e.g., by starting an EC), they haven't really done an eternity yet.
    player.achievementChecks.noEternitiesThisReality = false;
  }

  if (player.dilation.active && (!force || Currency.infinityPoints.gte(Number.MAX_VALUE))) {
    rewardTP();
  }

  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if (!EternityMilestone.keepAutobuyers.isReached) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();

  if (!specialConditions.enteringEC && player.respec) {
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = new Decimal(0);
  player.records.bestInfinity.bestIPminEternity = new Decimal(0);
  player.records.thisEternity.bestEPmin = new Decimal(0);
  player.records.thisEternity.bestInfinitiesPerMs = new Decimal(0);
  player.records.thisEternity.bestIPMsWithoutMaxAll = new Decimal(0);
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyRealityUpgradesAfterEternity();
  player.records.thisInfinity.maxAM = new Decimal(0);
  player.records.thisEternity.maxAM = new Decimal(0);
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();

  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

function initializeChallengeCompletions(isReality) {
  NormalChallenges.clearCompletions();
  InfinityChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked) {
    player.postChallUnlocked = 8;
    InfinityChallenges.completeAll();
  } else {
    player.postChallUnlocked = 0;
  }
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

function initializeResourcesAfterEternity() {
  player.sacrificed = new Decimal(0);
  Currency.infinities.reset();
  player.records.bestInfinity.time = 999999999999;
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time = 0;
  player.records.thisInfinity.lastBuyTime = 0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? 4 : 0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? 1 : 0;
  player.spreadingCancer = 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = 0;
  player.records.thisEternity.realTime = 0;
  player.totalTickGained = 0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.achievementChecks.noSacrifices = true;
  player.achievementChecks.onlyEighthDimensions = true;
  player.achievementChecks.onlyFirstDimensions = true;
  player.achievementChecks.noEighthDimensions = true;
  player.achievementChecks.noFirstDimensions = true;
  player.achievementChecks.noReplicantiGalaxies = true;
}

function applyRealityUpgradesAfterEternity() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.isBought) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

function askEternityConfirmation() {
  if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else if (player.options.animations.eternity && document.body.style.animation === "") {
    eternityAnimation();
    setTimeout(eternity, 2250);
  } else {
    eternity();
  }
}

class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return Currency.eternities.gte(this.config.eternities);
  }
}

const EternityMilestone = (function() {
  const db = GameDatabase.eternity.milestones;
  const infinityDims = Array.dimensionTiers
    .map(tier => new EternityMilestoneState(db[`autobuyerID${tier}`]));
  return {
    autobuyerIPMult: new EternityMilestoneState(db.autobuyerIPMult),
    keepAutobuyers: new EternityMilestoneState(db.keepAutobuyers),
    autobuyerReplicantiGalaxy: new EternityMilestoneState(db.autobuyerReplicantiGalaxy),
    keepInfinityUpgrades: new EternityMilestoneState(db.keepInfinityUpgrades),
    bigCrunchModes: new EternityMilestoneState(db.bigCrunchModes),
    autoEP: new EternityMilestoneState(db.autoEP),
    autoIC: new EternityMilestoneState(db.autoIC),
    autobuyMaxGalaxies: new EternityMilestoneState(db.autobuyMaxGalaxies),
    unlockReplicanti: new EternityMilestoneState(db.unlockReplicanti),
    autobuyerID: tier => infinityDims[tier - 1],
    keepBreakUpgrades: new EternityMilestoneState(db.keepBreakUpgrades),
    autoUnlockID: new EternityMilestoneState(db.autoUnlockID),
    unlockAllND: new EternityMilestoneState(db.unlockAllND),
    replicantiNoReset: new EternityMilestoneState(db.replicantiNoReset),
    autobuyerReplicantiChance: new EternityMilestoneState(db.autobuyerReplicantiChance),
    autobuyerReplicantiInterval: new EternityMilestoneState(db.autobuyerReplicantiInterval),
    autobuyerReplicantiMaxGalaxies: new EternityMilestoneState(db.autobuyerReplicantiMaxGalaxies),
    autobuyerEternity: new EternityMilestoneState(db.autobuyerEternity),
    autoEternities: new EternityMilestoneState(db.autoEternities),
    autoInfinities: new EternityMilestoneState(db.autoInfinities),
  };
}());

const EternityMilestones = {
  // This is a bit of a hack because autobuyerID is a function that returns EternityMilestoneState objects instead of a
  // EternityMilestoneState object itself
  all: Object.values(EternityMilestone)
    .filter(m => typeof m !== "function")
    .concat(Array.dimensionTiers
      .map(tier => new EternityMilestoneState(GameDatabase.eternity.milestones[`autobuyerID${tier}`]))
    )
};

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => Decimal.pow(5, player.epmultUpgrades));
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    const diff = value - player.epmultUpgrades;
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(Decimal.pow(5, diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    ++this.boughtAmount;
    return true;
  }

  buyMax() {
    const bulk = bulkBuyBinarySearch(Currency.eternityPoints.value, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount);
    if (!bulk) return false;
    Currency.eternityPoints.subtract(bulk.purchasePrice);
    this.boughtAmount += bulk.quantity;
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  get costIncreaseThresholds() {
    return [1e100, Decimal.NUMBER_MAX_VALUE, "1e1300", "1e4000"];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    return Decimal.pow(1000, count + Math.pow(Math.clampMin(count - 1334, 0), 1.2)).times(500);
  }
}


const EternityUpgrade = (function() {
  const db = GameDatabase.eternity.upgrades;
  return {
    idMultEP: new EternityUpgradeState(db.idMultEP),
    idMultEternities: new EternityUpgradeState(db.idMultEternities),
    idMultICRecords: new EternityUpgradeState(db.idMultICRecords),
    tdMultAchs: new EternityUpgradeState(db.tdMultAchs),
    tdMultTheorems: new EternityUpgradeState(db.tdMultTheorems),
    tdMultRealTime: new EternityUpgradeState(db.tdMultRealTime),
    epMult: new EPMultiplierState(),
  };
}());
