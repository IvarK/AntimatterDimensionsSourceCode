"use strict";

function canEternity() {
  return EternityChallenge.isRunning
    ? EternityChallenge.current.canBeCompleted
    : player.infinityPoints.gte(Decimal.MAX_NUMBER) && InfinityDimension(8).isUnlocked;
}

function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !canEternity()) {
    force = true;
  }
  
  if (force) {
    player.challenge.eternity.current = 0;
  }
  else {
    if (!canEternity()) return false;
    if (!auto && !askEternityConfirmation()) return false;
    EventHub.dispatch(GameEvent.ETERNITY_RESET_BEFORE);
    player.bestEternity = Math.min(player.thisEternity, player.bestEternity);
    player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints());
    addEternityTime(
      player.thisEternity, 
      player.thisEternityRealTime, 
      gainedEternityPoints(), 
      Effects.product(RealityUpgrade(3))
    );
    player.eternities = player.eternities.add(Effects.product(RealityUpgrade(3)));
  }

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion();
    if (Perk.studyECBulk.isBought) {
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion();
      }
    }
    player.etercreq = 0;
    respecTimeStudies(auto);
  }

  player.bestEternitiesPerMs = player.bestEternitiesPerMs.clampMin(
    Effects.product(RealityUpgrade(3)) / player.thisEternityRealTime
  );

  player.infinitiedBank = player.infinitiedBank.plusEffectsOf(
    Achievement(131),
    TimeStudy(191)
  );

  if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
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
  eternityResetReplicanti();
  resetChallengeStuff();
  NormalDimensions.reset();

  if (player.respec) respecTimeStudies(auto);
  player.respec = false;
  if (player.eternities.eq(1) ||
        (player.reality.rebuyables[3] > 0 &&
        player.eternities.eq(RealityUpgrade(3).effectValue) &&
        player.eternityPoints.lte(10))) {
    Tab.dimensions.time.show();
  }
  
  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked && player.infinityPoints.gt(Decimal.MAX_NUMBER)) {
    EffarigUnlock.eternity.unlock();
    Modal.message.show(`Effarig Eternity reward: Glyph Level cap raised to ${Effarig.glyphLevelCap} ` + 
      "and IP multipliers apply with full effect; eternity count generates infinities " + 
      "and The Enslaved Ones have been unlocked.");
  }
  
  resetInfinityPointsOnEternity();
  InfinityDimensions.resetAmount();
  player.bestEPminThisReality = player.bestEPminThisReality.max(player.bestEPminThisEternity);
  player.bestEPminThisEternity = new Decimal(0);
  player.bestIPminThisInfinity = new Decimal(0);
  player.bestIPminThisEternity = new Decimal(0);
  player.bestInfinitiesPerMs = new Decimal(0);
  player.bestIpPerMsWithoutMaxAll = new Decimal(0);
  resetTimeDimensions();
  try {
    // FIXME: Eternity count is a Decimal and also why is this submitted in so many places?
    // kong.submitStats('Eternities', player.eternities);
  } catch (err) {
      console.log("Couldn't load Kongregate API")
  }
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  applyRealityUpgrades();
  resetAntimatter();

  EventHub.dispatch(GameEvent.ETERNITY_RESET_AFTER);
  return true;
}

function initializeChallengeCompletions() {
  NormalChallenges.clearCompletions();
  InfinityChallenges.clearCompletions();
  if (EternityMilestone.keepAutobuyers.isReached) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isEnabled) {
    InfinityChallenges.completeAll();
  }
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

function initializeResourcesAfterEternity() {
  player.sacrificed = new Decimal(0);
  player.infinitied = new Decimal(0);
  player.bestInfinityTime = 9999999999;
  player.thisInfinityTime = 0;
  player.thisInfinityLastBuyTime = 0;
  player.thisInfinityRealTime = 0;
  player.resets = (EternityMilestone.keepInfinityUpgrades.isReached) ? 4 : 0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? 1 : 0;
  player.tickDecrease = 0.9;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  player.infinityPower = new Decimal(1);
  player.timeShards = new Decimal(0);
  player.tickThreshold = new Decimal(1);
  player.thisEternity = 0;
  player.thisEternityRealTime = 0;
  player.totalTickGained = 0;
  player.offlineProd = EternityMilestone.keepBreakUpgrades.isReached ? player.offlineProd : 0;
  player.offlineProdCost = EternityMilestone.keepBreakUpgrades.isReached ? player.offlineProdCost : 1e7;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  if (!EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityRebuyables = [0, 0];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
  }
  player.noSacrifices = true;
  player.onlyEighthDimensons = true;
  player.onlyFirstDimensions = true;
  player.noEighthDimensions = true;
  player.postChallUnlocked = Achievement(133).isEnabled ? 8 : 0;
}

function applyRealityUpgrades() {
  if (RealityUpgrade(13).isBought) {
      if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();
      for (let i = 1; i < 9; i++) {
          if (player.reality.tdbuyers[i - 1]) {
              buyMaxTimeDimTier(i);
          }
      }
  }
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.isBought) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.isBought) {
    for (const id of [4, 5, 6]) player.eternityUpgrades.add(id);
  }
}

function eternityResetReplicanti() {
  player.replicanti.unl = EternityMilestone.unlockReplicanti.isReached;
  player.replicanti.amount = player.replicanti.unl ? new Decimal(1) : new Decimal(0);
  player.replicanti.chance = 0.01;
  player.replicanti.chanceCost = new Decimal(1e150);
  player.replicanti.interval = 1000;
  player.replicanti.intervalCost = new Decimal(1e140);
  player.replicanti.gal = 0;
  player.replicanti.galaxies = 0;
  player.replicanti.galCost = new Decimal(1e170);
  if (EternityMilestone.autobuyerReplicantiGalaxy.isReached && 
    player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
}

function askEternityConfirmation() {
    if (!player.options.confirmations.eternity) {
        return true;
    }
    let message = "Eternity will reset everything except achievements and challenge records. " +
        "You will also gain an Eternity point and unlock various upgrades.";
    return confirm(message);
}

function resetInfinityPointsOnEternity() {
  resetInfinityPoints();
  Achievement(104).applyEffect(v => player.infinityPoints = player.infinityPoints.max(v));
}

function resetInfinityPoints() {
  player.infinityPoints = Effects.max(
    0,
    Perk.startIP1,
    Perk.startIP2
  ).toDecimal();
}

class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return player.eternities.gte(this.config.eternities);
  }
}

const EternityMilestone = (function() {
  const db = GameDatabase.eternity.milestones;
  const infinityDims = Array.dimensionTiers
    .map(tier => new EternityMilestoneState(db["autobuyerID" + tier]));
  return {
    autobuyerIPMult: new EternityMilestoneState(db.autobuyerIPMult),
    keepAutobuyers: new EternityMilestoneState(db.keepAutobuyers),
    autobuyerReplicantiGalaxy: new EternityMilestoneState(db.autobuyerReplicantiGalaxy),
    keepInfinityUpgrades: new EternityMilestoneState(db.keepInfinityUpgrades),
    bigCrunchModes: new EternityMilestoneState(db.bigCrunchModes),
    autoEP: new EternityMilestoneState(db.autoEP),
    autoIC: new EternityMilestoneState(db.autoIC),
    autobuyMaxGalaxies: new EternityMilestoneState(db.autobuyMaxGalaxies),
    autobuyMaxDimboosts: new EternityMilestoneState(db.autobuyMaxDimboosts),
    autobuyerID: tier => infinityDims[tier - 1],
    keepBreakUpgrades: new EternityMilestoneState(db.keepBreakUpgrades),
    autoUnlockID: new EternityMilestoneState(db.autoUnlockID),
    unlockAllND: new EternityMilestoneState(db.unlockAllND),
    autobuyerReplicantiChance: new EternityMilestoneState(db.autobuyerReplicantiChance),
    unlockReplicanti: new EternityMilestoneState(db.unlockReplicanti),
    autobuyerReplicantiInterval: new EternityMilestoneState(db.autobuyerReplicantiInterval),
    autobuyerReplicantiMaxGalaxies: new EternityMilestoneState(db.autobuyerReplicantiMaxGalaxies),
    autobuyerEternity: new EternityMilestoneState(db.autobuyerEternity),
    autoInfinities: new EternityMilestoneState(db.autoInfinities),
  };
}());

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
    this.autobuyer = {
      get isUnlocked() {
        return RealityUpgrade(13).isBought;
      },
      get isOn() {
        return player.reality.epmultbuyer;
      },
      set isOn(value) {
        player.reality.epmultbuyer = value;
      }
    };
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => Decimal.pow(5, player.epmultUpgrades));
  }

  get canBeApplied() {
    return true;
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
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

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    player.eternityPoints = player.eternityPoints.minus(this.cost);
    ++this.boughtAmount;
    return true;
  }

  buyMax() {
    const bulk = bulkBuyBinarySearch(player.eternityPoints, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount);
    if (!bulk) return false;
    player.eternityPoints = player.eternityPoints.minus(bulk.purchasePrice);
    this.boughtAmount += bulk.quantity;
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  costAfterCount(count) {
    // Up to just past 1e100
    if (count <= 58) return Decimal.pow(50, count).times(500);
    // Up to just past Number.MAX_VALUE
    if (count <= 153) return Decimal.pow(100, count).times(500);
    // Up to just past 1e1300
    if (count <= 481) return Decimal.pow(500, count).times(500);
    // Up to 1e4000
    if (count <= 1333) return Decimal.pow(1000, count).times(500);
    return Decimal.pow(1000, count + Math.pow(count - 1334, 1.2)).times(500);
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
