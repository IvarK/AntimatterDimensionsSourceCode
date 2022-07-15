import { GameMechanicState } from "./game-mechanics/index";

// This function does *not* reset anything. Only call it when you've already
// done all the non-UI stuff. Right now the only UI thing to do is switch to
// the AD tab.
function startChallengeUI() {
  if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
}

export function tryCompleteInfinityChallenges() {
  if (EternityMilestone.autoIC.isReached) {
    const toComplete = InfinityChallenges.all.filter(x => x.isUnlocked && !x.isCompleted);
    for (const challenge of toComplete) challenge.complete();
  }
}

class InfinityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.isCompleted;
  }
}

class InfinityChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new InfinityChallengeRewardState(config.reward, this);
  }

  get unlockAM() {
    return this.config.unlockAM;
  }

  get isUnlocked() {
    return player.records.thisEternity.maxAM.gte(this.unlockAM) || (Achievement(133).isUnlocked && !Pelle.isDoomed) ||
      (PelleUpgrade.keepInfinityChallenges.canBeApplied && Pelle.cel.records.totalAntimatter.gte(this.unlockAM));
  }

  get isRunning() {
    return player.challenge.infinity.current === this.id;
  }

  requestStart() {
    if (!this.isUnlocked) return;
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startInfinityChallenge.show(this.id);
  }

  start() {
    if (!this.isUnlocked || this.isRunning) return;
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = this.id;
    bigCrunchResetValues();
    startChallengeUI();
    player.break = true;
    if (EternityChallenge.isRunning) Achievement(115).unlock();
  }

  get isCompleted() {
    // eslint-disable-next-line no-bitwise
    return (player.challenge.infinity.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    // eslint-disable-next-line no-bitwise
    player.challenge.infinity.completedBits |= 1 << this.id;
    EventHub.dispatch(GAME_EVENT.INFINITY_CHALLENGE_COMPLETED);
  }

  get isEffectActive() {
    return this.isRunning;
  }

  /**
   * @return {InfinityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get goal() {
    return this.config.goal;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.infinity.bestTimes;
    if (bestTimes[this.id - 1] <= player.records.thisInfinity.time) {
      return;
    }
    // TODO: remove splice once player.challenge.infinity.bestTimes is not reactive
    bestTimes.splice(this.id - 1, 1, player.records.thisInfinity.time);
    GameCache.infinityChallengeTimeSum.invalidate();
  }

  exit() {
    player.challenge.infinity.current = 0;
    bigCrunchResetValues();
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {InfinityChallengeState}
 */
export const InfinityChallenge = InfinityChallengeState.createAccessor(GameDatabase.challenges.infinity);

/**
 * @returns {InfinityChallengeState}
 */
Object.defineProperty(InfinityChallenge, "current", {
  get: () => (player.challenge.infinity.current > 0
    ? InfinityChallenge(player.challenge.infinity.current)
    : undefined),
});

Object.defineProperty(InfinityChallenge, "isRunning", {
  get: () => InfinityChallenge.current !== undefined,
});

export const InfinityChallenges = {
  /**
   * @type {InfinityChallengeState[]}
   */
  all: InfinityChallenge.index.compact(),
  completeAll() {
    for (const challenge of InfinityChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.infinity.completedBits = 0;
  },
  get nextIC() {
    return InfinityChallenges.all.find(x => !x.isUnlocked);
  },
  get nextICUnlockAM() {
    return this.nextIC?.unlockAM;
  },
  /**
   * Displays a notification if the antimatter gained will surpass the next unlockAM requirement.
   * @param value {Decimal} - total antimatter
   */
  notifyICUnlock(value) {
    // Disable the popup if the user will automatically complete the IC.
    if (EternityMilestone.autoIC.isReached) return;
    if (InfinityChallenges.nextIC === undefined) return;
    for (const ic of InfinityChallenges.all) {
      if (ic.isUnlocked || ic.isCompleted) continue;
      if (value.lt(ic.unlockAM)) break;
      GameUI.notify.infinity(`You have unlocked Infinity Challenge ${ic.id}`);
    }
  },
  /**
   * @returns {InfinityChallengeState[]}
   */
  get completed() {
    return InfinityChallenges.all.filter(ic => ic.isCompleted);
  }
};
