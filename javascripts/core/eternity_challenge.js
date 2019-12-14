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
  player.infinityPoints = Player.startingIP;
  InfinityDimensions.resetAmount();
  player.bestIPminThisInfinity = new Decimal(0);
  player.bestEPminThisEternity = new Decimal(0);
  resetTimeDimensions();
  // FIXME: Eternity count is now a Decimal, also why is this submitted twice?
  // kong.submitStats("Eternities", player.eternities);
  resetTickspeed();
  player.antimatter = Player.startingAM;
  player.thisInfinityMaxAM = Player.startingAM;
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  if (Enslaved.isRunning && Enslaved.foundEC6C10) Tab.challenges.normal.show();
  return true;
}

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

    let totalCompletions = this.completionsAtIP(player.infinityPoints);
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
    return player.infinityPoints.gte(this.currentGoal);
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

  start(auto) {
    if (!this.isUnlocked || EternityChallenge.isRunning) return false;
    if (!auto && player.options.confirmations.challenges) {
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
    if (this.id === 12) {
      if (TimeCompression.isActive) SecretAchievement(42).unlock();
      TimeCompression.isActive = false;
    }
    return startEternityChallenge();
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
  all: EternityChallengeState.index.compact(),

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
      if (Ra.has(RA_UNLOCKS.INSTANT_AUTOEC)) {
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
      let hours = Effects.min(
        Number.MAX_VALUE,
        Perk.autocompleteEC1,
        Perk.autocompleteEC2,
        Perk.autocompleteEC3,
        Perk.autocompleteEC4,
        Perk.autocompleteEC5
      );
      if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0])) hours /= V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0].effect();
      return hours === Number.MAX_VALUE ? Infinity : TimeSpan.fromHours(hours).totalMilliseconds;
    }
  }
};
