"use strict";

function startEternityChallenge() {
  initializeChallengeCompletions();
  initializeResourcesAfterEternity();
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  eternityResetReplicanti();
  resetChallengeStuff();
  NormalDimensions.reset();
  player.replicanti.galaxies = 0;
  resetInfinityPointsOnEternity();
  InfinityDimensions.resetAmount();
  IPminpeak = new Decimal(0);
  EPminpeak = new Decimal(0);
  resetTimeDimensions();
  if (player.eternities < 20) Autobuyer.dimboost.buyMaxInterval = 1;
  kong.submitStats('Eternities', player.eternities);
  resetTickspeed();
  resetMoney();
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  return true;
}

const TIERS_PER_EC = 5;

class EternityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get effectValue() {
    return this.config.effect(this._challenge.completions);
  }

  get canBeApplied() {
    return this._challenge.completions > 0;
  }
}

class EternityChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._fullId = `eterc${this.id}`;
    this._reward = new EternityChallengeRewardState(config.reward, this);
  }

  get fullId() {
    return this._fullId;
  }

  get isUnlocked() {
    return player.challenge.eternity.unlocked === this.id;
  }

  get isRunning() {
    return player.challenge.eternity.current === this.id;
  }

  get canBeApplied() {
    return this.isRunning;
  }

  get completions() {
    const completions = player.eternityChalls[this.fullId];
    return completions === undefined ? 0 : completions;
  }

  set completions(value) {
    if (Enslaved.isRunning && this.id === 1) {
      player.eternityChalls[this.fullId] = Math.min(1000, value);
      return;
    }
    player.eternityChalls[this.fullId] = Math.min(value, TIERS_PER_EC);
  }

  get isFullyCompleted() {
    if (Enslaved.isRunning && this.id === 1) return this.completions === 1000;
    return this.completions === TIERS_PER_EC;
  }

  get initialGoal() {
    return this.config.goal;
  }

  get goalIncrease() {
    return this.config.goalIncrease;
  }

  get currentGoal() {
    return this.goalAtCompletions(this.completions);
  }

  get isGoalReached() {
    return player.infinityPoints.gte(this.currentGoal);
  }

  get canBeCompleted() {
    return this.isGoalReached && this.isWithinRestriction;
  }

  goalAtCompletions(completions) {
    return completions > 0 ?
      this.initialGoal.times(this.goalIncrease.pow(completions)) :
      this.initialGoal;
  }

  addCompletion() {
    this.completions++;
    if (this.id === 6) {
      GameCache.dimensionMultDecrease.invalidate();
    }
    if (this.id === 11) {
      GameCache.tickSpeedMultDecrease.invalidate();
    }
  }

  start(auto) {
    if (!this.isUnlocked) return false;
    if (player.options.confirmations.challenges) {
      const confirmation =
        "You will start over with just your time studies, " +
        "eternity upgrades and achievements. " +
        "You need to reach a set IP with special conditions.";
      if (!confirm(confirmation)) return false;
    }
    // If dilation is active, the { enteringEC: true } parameter will cause
    // dilation to not be disabled. We still don't force-eternity, though;
    // this causes TP to still be gained.
    if (canEternity()) eternity(false, auto, { enteringEC: true });
    player.challenge.eternity.current = this.id;
    return startEternityChallenge();
  }

  /**
   * @return {EternityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isWithinRestriction() {
    return this.config.restriction === undefined ||
      this.config.checkRestriction(this.config.restriction(this.completions));
  }

  exit() {
    const nestedChallenge = NormalChallenge.current || InfinityChallenge.current;
    if (nestedChallenge !== undefined) {
      nestedChallenge.exit();
    }
    player.challenge.eternity.current = 0;
    eternity(true);
  }

  fail() {
    this.exit();
    Modal.message.show("You failed the challenge, you have now exited it.");
    EventHub.dispatch(GameEvent.CHALLENGE_FAILED);
  }

  tryFail() {
    if (this.isRunning && !this.isWithinRestriction) {
      this.fail();
      return true;
    }
    return false;
  }
}

EternityChallengeState.all = mapGameData(
  GameDatabase.challenges.eternity,
  config => new EternityChallengeState(config)
);

/**
 * @param id
 * @return {EternityChallengeState}
 */
function EternityChallenge(id) {
  return EternityChallengeState.all[id];
}

/**
 * @type {EternityChallengeState[]}
 */
EternityChallenge.all = EternityChallengeState.all;

/**
 * @returns {EternityChallengeState}
 */
Object.defineProperty(EternityChallenge, "current", {
  get: () => (player.challenge.eternity.current > 0
    ? EternityChallenge(player.challenge.eternity.current)
    : undefined),
});

Object.defineProperty(EternityChallenge, "isRunning", {
  get: () => EternityChallenge.current !== undefined,
});

EternityChallenge.TOTAL_TIER_COUNT = EternityChallenge.all.map(ec => ec.id).max() * TIERS_PER_EC;

EternityChallenge.completedTiers = () => {
  return EternityChallenge.all
    .map(ec => ec.completions)
    .sum();
};

EternityChallenge.remainingTiers = () => EternityChallenge.TOTAL_TIER_COUNT - EternityChallenge.completedTiers();

EternityChallenge.currentAutoCompleteThreshold = function() {
  let hours = Effects.min(
    Number.MAX_VALUE,
    Perk.autocompleteEC1,
    Perk.autocompleteEC2,
    Perk.autocompleteEC3,
    Perk.autocompleteEC4,
    Perk.autocompleteEC5
  );
  if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0])) hours /= V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0].effect()
  return hours === Number.MAX_VALUE ? Infinity : TimeSpan.fromHours(hours).totalMilliseconds;
};

EternityChallenge.autoCompleteNext = function() {
  const next = EternityChallenge.all.compact().find(ec => !ec.isFullyCompleted);
  if (next === undefined) return false;
  next.addCompletion();
  return true;
};

EternityChallenge.autoCompleteTick = function() {
  if (!player.reality.autoEC) return;
  if (Ra.has(RA_UNLOCKS.INSTANT_AUTOEC)) {
    while (this.autoCompleteNext());
    return;
  }
  const threshold = this.currentAutoCompleteThreshold();
  while (player.reality.lastAutoEC - threshold > 0 && this.autoCompleteNext()) {
    player.reality.lastAutoEC -= threshold;
  }
  player.reality.lastAutoEC %= threshold;
};
