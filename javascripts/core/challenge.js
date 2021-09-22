"use strict";

function startChallenge() {
  if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
}

function tryUnlockInfinityChallenges() {
  while (player.postChallUnlocked < 8 &&
    player.records.thisEternity.maxAM.gte(InfinityChallenge(player.postChallUnlocked + 1).config.unlockAM)) {
    ++player.postChallUnlocked;
    TabNotification.ICUnlock.tryTrigger();
    if (EternityMilestone.autoIC.isReached) {
      InfinityChallenge(player.postChallUnlocked).complete();
    }
  }
}

function updateNormalAndInfinityChallenges(diff) {
  if (NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning) {
    if (AntimatterDimension(2).amount.neq(0)) {
      if (player.matter.eq(0)) player.matter = new Decimal(1);
      // These caps are values which occur at approximately e308 IP
      const cappedBase = 1.03 + Math.clampMax(DimBoost.totalBoosts, 400) / 200 +
        Math.clampMax(player.galaxies, 100) / 100;
      const finalMatterCap = Decimal.MAX_VALUE;
      player.matter = player.matter.times(Decimal.pow(cappedBase, diff / 100)).clampMax(finalMatterCap);
    }
    if (player.matter.gt(Currency.antimatter.value) && NormalChallenge(11).isRunning && !Player.canCrunch) {
      Modal.hideAll();
      Modal.message.show(`Your ${format(Currency.antimatter.value, 2, 2)} antimatter was annhiliated by ` +
        `${format(player.matter, 2, 2)} matter.`);
      softReset(0);
    }
  }

  if (NormalChallenge(3).isRunning) {
    player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff / 100)).clampMax(Decimal.NUMBER_MAX_VALUE);
  }

  if (NormalChallenge(2).isRunning) {
    player.chall2Pow = Math.min(player.chall2Pow + diff / 100 / 1800, 1);
  }

  if (InfinityChallenge(2).isRunning) {
    if (player.ic2Count >= 400) {
      if (AntimatterDimension(8).amount.gt(0)) {
        sacrificeReset();
      }
      player.ic2Count %= 400;
    } else {
      // Do not change to diff, as this may lead to a sacrifice softlock with high gamespeed
      player.ic2Count += Math.clamp(Date.now() - player.lastUpdate, 1, 21600000);
    }
  }
}

class NormalChallengeState extends GameMechanicState {
  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get isRunning() {
    const isPartOfIC1 = this.id !== 9 && this.id !== 12;
    return player.challenge.normal.current === this.id || (isPartOfIC1 && InfinityChallenge(1).isRunning);
  }

  get isUnlocked() {
    if (PlayerProgress.eternityUnlocked()) return true;
    if (this.id === 0) return true;
    const ip = GameDatabase.challenges.normal[this.id - 1].lockedAt;
    return Currency.infinitiesTotal.gte(ip);
  }

  get lockedAt() {
    return GameDatabase.challenges.normal[this.id].lockedAt;
  }

  requestStart() {
    if (!Tab.challenges.isUnlocked) return;
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startNormalChallenge.show(this.id);
  }

  start() {
    if (this.id === 1 || this.isRunning) return;
    if (!Tab.challenges.isUnlocked) return;
    bigCrunchResetRequest();

    player.challenge.normal.current = this.id;
    player.challenge.infinity.current = 0;

    if (Enslaved.isRunning && EternityChallenge(6).isRunning && this.id === 10) {
      EnslavedProgress.challengeCombo.giveProgress();
      Enslaved.quotes.show(Enslaved.quotes.EC6C10);
    }

    startChallenge();
  }

  get isCompleted() {
    // eslint-disable-next-line no-bitwise
    return (player.challenge.normal.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    // eslint-disable-next-line no-bitwise
    player.challenge.normal.completedBits |= 1 << this.id;
    // Since breaking infinity maxes even autobuyers that aren't unlocked,
    // it's possible to get r52 or r53 from completing a challenge
    // and thus unlocking an autobuyer.
    Achievement(52).tryUnlock();
    Achievement(53).tryUnlock();
  }

  get goal() {
    if (Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.id)) {
      return Decimal.pow10(1e15);
    }
    return Decimal.NUMBER_MAX_VALUE;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.normal.bestTimes;
    if (bestTimes[this.id - 2] <= player.records.thisInfinity.time) {
      return;
    }
    // TODO: remove splice once player.challenge.infinity.bestTimes is not reactive
    bestTimes.splice(this.id - 2, 1, player.records.thisInfinity.time);
    GameCache.challengeTimeSum.invalidate();
    GameCache.worstChallengeTime.invalidate();
  }

  exit() {
    player.challenge.normal.current = 0;
    bigCrunchResetRequest();
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {NormalChallengeState}
 */
const NormalChallenge = NormalChallengeState.createAccessor(GameDatabase.challenges.normal);

/**
 * @returns {NormalChallengeState}
 */
Object.defineProperty(NormalChallenge, "current", {
  get: () => (player.challenge.normal.current > 0
    ? NormalChallenge(player.challenge.normal.current)
    : undefined),
});

Object.defineProperty(NormalChallenge, "isRunning", {
  get: () => player.challenge.normal.current !== 0,
});

const NormalChallenges = {
  /**
   * @type {NormalChallengeState[]}
   */
  all: NormalChallenge.index.compact(),
  completeAll() {
    for (const challenge of NormalChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.normal.completedBits = 0;
  }
};

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

  get isUnlocked() {
    return player.postChallUnlocked >= this.id;
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
    bigCrunchReset();
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = this.id;
    startChallenge();
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
    bigCrunchReset();
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {InfinityChallengeState}
 */
const InfinityChallenge = InfinityChallengeState.createAccessor(GameDatabase.challenges.infinity);

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

const InfinityChallenges = {
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
  /**
   * @returns {InfinityChallengeState[]}
   */
  get completed() {
    return InfinityChallenges.all.filter(ic => ic.isCompleted);
  }
};
