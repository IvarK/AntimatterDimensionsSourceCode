import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Math.min(player.records.thisEternity.time, player.records.bestEternity.time);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = gainedEternities();

  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  Currency.eternities.add(newEternities);

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion(false);
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion(false);
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.challenge.eternity.requirementBits &= ~(1 << challenge.id);
    respecTimeStudies(auto);
  }

  addEternityTime(
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    newEternities.div(Math.clampMin(33, player.records.thisEternity.realTime))
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

export function eternityAnimation() {
  FullScreenAnimationHandler.display("a-eternify", 3);
}

export function eternityResetRequest() {
  if (!Player.canEternity) return;
  if (GameEnd.creditsEverClosed) return;
  askEternityConfirmation();
}

export function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  // We define this variable so we can use it in checking whether to give
  // the secret achievement for respec without studies.
  // Annoyingly, we need to check for studies right here; giveEternityRewards removes studies if we're in an EC,
  // so doing the check later doesn't give us the initial state of having studies or not.
  const noStudies = player.timestudy.studies.length === 0;
  if (!force) {
    if (!Player.canEternity) return false;
    if (RealityUpgrade(10).isLockingMechanics) {
      RealityUpgrade(10).tryShowWarningModal();
      return false;
    }
    if (RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) {
      RealityUpgrade(12).tryShowWarningModal();
      return false;
    }
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    player.requirementChecks.reality.noEternities = false;
  }

  if (player.dilation.active) rewardTP();

  // This needs to be after the dilation check for the "can gain TP" check in rewardTP to be correct.
  if (force) {
    player.challenge.eternity.current = 0;
  }

  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if (!EternityMilestone.keepAutobuyers.isReached && !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied)) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC && !Pelle.isDoomed) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();

  if (!specialConditions.enteringEC && player.respec) {
    if (noStudies) {
      SecretAchievement(34).unlock();
    }
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyEU1();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();

  PelleStrikes.eternity.trigger();

  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

// eslint-disable-next-line no-empty-function
export function animateAndEternity(callback) {
  if (!Player.canEternity) return false;
  const hasAnimation = !FullScreenAnimationHandler.isDisplaying &&
    !RealityUpgrade(10).isLockingMechanics &&
    !(RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) &&
    ((player.dilation.active && player.options.animations.dilation) ||
    (!player.dilation.active && player.options.animations.eternity));

  if (hasAnimation) {
    if (player.dilation.active) {
      animateAndUndilate(callback);
    } else {
      eternityAnimation();
      setTimeout(() => {
        eternity();
        if (callback) callback();
      }, 2250);
    }
  } else {
    eternity();
    if (callback) callback();
  }
  return hasAnimation;
}

export function initializeChallengeCompletions(isReality) {
  NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied) InfinityChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked && !Pelle.isDoomed) InfinityChallenges.completeAll();
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

export function initializeResourcesAfterEternity() {
  player.sacrificed = DC.D0;
  Currency.infinities.reset();
  player.records.bestInfinity.time = 999999999999;
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time = 0;
  player.records.thisInfinity.lastBuyTime = 0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? 4 : 0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? 1 : 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = 0;
  player.records.thisEternity.realTime = 0;
  player.totalTickGained = 0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.canBeApplied) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.canBeApplied) {
    const secondRow = EternityUpgrade.all.filter(u => u.id > 3);
    for (const upgrade of secondRow) {
      if (player.eternityPoints.gte(upgrade.cost / 1e10)) player.eternityUpgrades.add(upgrade.id);
    }
  }
}

function askEternityConfirmation() {
  if (player.dilation.active && player.options.confirmations.dilation) {
    Modal.exitDilation.show();
  } else if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else {
    animateAndEternity();
  }
}

export function gainedEternities() {
  return Pelle.isDisabled("eternityMults")
    ? new Decimal(1)
    : new Decimal(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3), Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

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
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return !Pelle.isDoomed && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Math.clampMin(value - player.epmultUpgrades, 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
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

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }
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
    return [DC.E100, Decimal.NUMBER_MAX_VALUE, DC.E1300, DC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    return DC.E3.pow(count + Math.pow(Math.clampMin(count - 1334, 0), 1.2)).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
