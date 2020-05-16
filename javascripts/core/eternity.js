"use strict";

function giveEternityRewards(auto) {
  player.bestEternity = Math.min(player.thisEternity, player.bestEternity);
  player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints());

  const newEternities = new Decimal(RealityUpgrade(3).effectOrDefault(1))
    .times(getAdjustedGlyphEffect("timeetermult"));
  if (player.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  addEternityTime(
    player.thisEternity,
    player.thisEternityRealTime,
    gainedEternityPoints(),
    newEternities
  );

  player.eternities = player.eternities.add(newEternities);

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion();
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion();
        completionCount++;
      }
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.etercreq = 0;
    respecTimeStudies(auto);
  }

  player.bestEternitiesPerMs = player.bestEternitiesPerMs.clampMin(
    RealityUpgrade(3).effectOrDefault(1) / Math.clampMin(33, player.thisEternityRealTime)
  );
  player.bestEPminThisReality = player.bestEPminThisReality.max(player.bestEPminThisEternity);

  player.infinitiedBank = player.infinitiedBank.plusEffectsOf(
    Achievement(131),
    TimeStudy(191)
  );

  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    beginProcessReality(getRealityProps(true));
  }

  if (player.bestEP.lt(player.eternityPoints)) {
    player.bestEP = new Decimal(player.eternityPoints);
    player.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
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
    if (!auto && !askEternityConfirmation()) return false;
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    // If somehow someone manages to force their first eternity
    // (e.g., by starting an EC), they haven't really eternitied yet.
    player.noEternitiesThisReality = false;
  }

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
  Replicanti.reset();
  resetChallengeStuff();
  NormalDimensions.reset();

  if (!specialConditions.enteringEC && player.respec) {
    respecTimeStudies(auto);
    player.respec = false;
  }

  player.infinityPoints = Player.startingIP;
  InfinityDimensions.resetAmount();
  player.bestEPminThisEternity = new Decimal(0);
  player.bestIPminThisInfinity = new Decimal(0);
  player.bestIPminThisEternity = new Decimal(0);
  player.bestInfinitiesPerMs = new Decimal(0);
  player.bestIpPerMsWithoutMaxAll = new Decimal(0);
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  applyRealityUpgradesAfterEternity();
  player.thisInfinityMaxAM = new Decimal(0);
  player.thisEternityMaxAM = new Decimal(0);
  Currency.antimatter.reset();

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
  player.infinitied = new Decimal(0);
  player.bestInfinityTime = 9999999999;
  player.thisInfinityTime = 0;
  player.thisInfinityLastBuyTime = 0;
  player.thisInfinityRealTime = 0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? 4 : 0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? 1 : 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  player.infinityPower = new Decimal(1);
  player.timeShards = new Decimal(0);
  player.thisEternity = 0;
  player.thisEternityRealTime = 0;
  player.totalTickGained = 0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  if (!EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityRebuyables = [0, 0, 0];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
  }
  player.noSacrifices = true;
  player.onlyEighthDimensions = true;
  player.onlyFirstDimensions = true;
  player.noEighthDimensions = true;
  player.noFirstDimensions = true;
  player.noReplicantiGalaxies = true;
}

function applyRealityUpgradesAfterEternity(buySingleTD = false) {
  if (RealityUpgrade(13).isBought) {
    if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();
    for (let i = 1; i < 9; i++) {
      if (player.reality.tdbuyers[i - 1]) {
        if (buySingleTD) buySingleTimeDimension(i);
        else buyMaxTimeDimension(i);
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

function askEternityConfirmation() {
    if (!player.options.confirmations.eternity) {
        return true;
    }
    const message = "Eternity will reset everything except achievements and challenge records. " +
        "You will also gain an Eternity point and unlock various upgrades.";
    return confirm(message);
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

  get isCustomEffect() {
    return true;
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
