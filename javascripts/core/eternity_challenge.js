"use strict";

function startEternityChallenge() {
  initializeChallengeCompletions();
  initializeResourcesAfterEternity();
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  player.replicanti.galaxies = 0;
  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  Currency.antimatter.reset();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  ECTimeStudyState.invalidateCachedRequirements();
}

class EternityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    const effect = config.effect;
    const configCopy = deepmerge.all([{}, config]);
    configCopy.effect = () => effect(challenge.completions);
    super(configCopy);
    this._challenge = challenge;
  }

  get isEffectActive() {
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

  get isEffectActive() {
    return this.isRunning;
  }

  get completions() {
    const completions = player.eternityChalls[this.fullId];
    return completions === undefined ? 0 : completions;
  }

  set completions(value) {
    player.eternityChalls[this.fullId] = Math.min(value, this.maxCompletions);
  }

  get maxCompletions() {
    return Enslaved.isRunning && this.id === 1 ? 1000 : 5;
  }

  get remainingCompletions() {
    return this.maxCompletions - this.completions;
  }

  get isFullyCompleted() {
    return this.completions === this.maxCompletions;
  }

  get maxValidCompletions() {
    if (this.id !== 4 && this.id !== 12) return this.maxCompletions;
    let completions = this.completions;
    while (completions < this.maxCompletions && this.isWithinRestrictionAtCompletions(completions)) {
      completions++;
    }
    return completions;
  }

  get gainedCompletionStatus() {
    const status = {
      gainedCompletions: 0,
      totalCompletions: this.completions,
    };
    if (this.isFullyCompleted) return status;
    if (!Perk.studyECBulk.isBought) {
      if (this.canBeCompleted) {
        ++status.totalCompletions;
        status.gainedCompletions = 1;
      }
      return status;
    }

    let totalCompletions = this.completionsAtIP(Currency.infinityPoints.value);
    const maxValidCompletions = this.maxValidCompletions;
    if (totalCompletions > maxValidCompletions) {
      totalCompletions = maxValidCompletions;
      status.failedRestriction = this.config.failedRestriction;
    }
    status.totalCompletions = totalCompletions;
    status.gainedCompletions = totalCompletions - this.completions;
    status.hasMoreCompletions = this.completions + status.gainedCompletions < this.maxCompletions;
    status.nextGoalAt = this.goalAtCompletions(status.totalCompletions);
    return status;
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
    return Currency.infinityPoints.gte(this.currentGoal);
  }

  get canBeCompleted() {
    return this.isGoalReached && this.isWithinRestriction;
  }

  goalAtCompletions(completions) {
    return completions > 0
      ? this.initialGoal.times(this.goalIncrease.pow(Math.min(completions, this.maxCompletions - 1)))
      : this.initialGoal;
  }

  completionsAtIP(ip) {
    if (ip.lt(this.initialGoal)) return 0;
    const completions = 1 + (ip.dividedBy(this.initialGoal)).log10() / this.goalIncrease.log10();
    return Math.min(Math.floor(completions), this.maxCompletions);
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

  requestStart() {
    if (!Tab.challenges.eternity.isUnlocked || this.isRunning) return;
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    if (this.isUnlocked) Modal.startEternityChallenge.show(this.id);
  }

  start(auto) {
    if (EternityChallenge.isRunning) return false;
    if (!this.isUnlocked) return false;

    // If dilation is active, the { enteringEC: true } parameter will cause
    // dilation to not be disabled. We still don't force-eternity, though;
    // this causes TP to still be gained.
    if (Player.canEternity) eternity(false, auto, { enteringEC: true });
    player.challenge.eternity.current = this.id;
    if (this.id === 12) {
      if (player.requirementChecks.reality.slowestBH < 1) {
        SecretAchievement(42).unlock();
      }
      player.requirementChecks.reality.slowestBH = 1;
    }
    if (Enslaved.isRunning) {
      if (this.id === 6 && this.completions === 5) EnslavedProgress.ec6.giveProgress();
      if (EnslavedProgress.challengeCombo.hasProgress) Tab.challenges.normal.show();
    }
    startEternityChallenge();
    return true;
  }

  /**
   * @return {EternityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isWithinRestriction() {
    return this.isWithinRestrictionAtCompletions(this.completions);
  }

  isWithinRestrictionAtCompletions(completions) {
    return this.config.restriction === undefined ||
      this.config.checkRestriction(this.config.restriction(completions));
  }

  exit() {
    if (Player.isInAntimatterChallenge) {
      Player.antimatterChallenge.exit();
    }
    player.challenge.eternity.current = 0;
    eternity(true);
  }

  fail() {
    this.exit();
    let reason;
    if (this.id === 4) {
      reason = restriction => `having more than ${quantifyInt("Infinity", restriction)}`;
    } else if (this.id === 12) {
      reason = restriction => `spending more than ${quantify("in-game second", restriction, 0, 1)} in it`;
    }
    Modal.message.show(`You failed Eternity Challenge ${this.id} due to
      ${reason(this.config.restriction(this.completions))}; you have now exited it.`);
    EventHub.dispatch(GAME_EVENT.CHALLENGE_FAILED);
  }

  tryFail() {
    if (this.isRunning && !this.isWithinRestriction) {
      this.fail();
      return true;
    }
    return false;
  }
}

/**
 * @param id
 * @return {EternityChallengeState}
 */
const EternityChallenge = EternityChallengeState.createAccessor(GameDatabase.challenges.eternity);

/**
 * @returns {EternityChallengeState}
 */
Object.defineProperty(EternityChallenge, "current", {
  get: () => (player.challenge.eternity.current > 0
    ? EternityChallenge(player.challenge.eternity.current)
    : undefined),
});

Object.defineProperty(EternityChallenge, "isRunning", {
  get: () => player.challenge.eternity.current !== 0,
});

const EternityChallenges = {
  /**
   * @type {EternityChallengeState[]}
   */
  all: EternityChallenge.index.compact(),

  get completions() {
    return EternityChallenges.all
      .map(ec => ec.completions)
      .sum();
  },

  get maxCompletions() {
    return EternityChallenges.all
      .map(ec => ec.maxCompletions)
      .sum();
  },

  get remainingCompletions() {
    return EternityChallenges.all
      .map(ec => ec.remainingCompletions)
      .sum();
  },

  autoComplete: {
    tick() {
      if (!player.reality.autoEC) return;
      if (Ra.has(RA_UNLOCKS.AUTO_RU_AND_INSTANT_EC)) {
        let next = this.nextChallenge;
        while (next !== undefined) {
          while (!next.isFullyCompleted) {
            next.addCompletion();
          }
          next = this.nextChallenge;
        }
        return;
      }
      const interval = this.interval;
      let next = this.nextChallenge;
      while (player.reality.lastAutoEC - interval > 0 && next !== undefined) {
        player.reality.lastAutoEC -= interval;
        next.addCompletion();
        next = this.nextChallenge;
      }
      player.reality.lastAutoEC %= interval;
    },

    get nextChallenge() {
      return EternityChallenges.all.find(ec => !ec.isFullyCompleted);
    },

    get interval() {
      if (!Perk.autocompleteEC1.isBought) return Infinity;
      let minutes = Effects.min(
        Number.MAX_VALUE,
        Perk.autocompleteEC1,
        Perk.autocompleteEC2,
        Perk.autocompleteEC3,
        Perk.autocompleteEC4
      );
      if (V.has(V_UNLOCKS.FAST_AUTO_EC)) minutes /= V_UNLOCKS.FAST_AUTO_EC.effect();
      return TimeSpan.fromMinutes(minutes).totalMilliseconds;
    }
  }
};
