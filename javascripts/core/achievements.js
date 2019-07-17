"use strict";

class AchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (config.secondaryEffect) {
      const secondaryConfig = {
        id: config.id,
        effect: config.secondaryEffect
      };
      this._secondaryState = new AchievementState(secondaryConfig);
    }
    this._row = Math.floor(this.id / 10);
    this._column = this.id % 10;
    this._totalDisabledTime = new Lazy(() => {
      if (!this.hasLockedTime) return 0;
      const perkAdjustedRow = Math.clamp(this.row - GameCache.achSkipPerkCount.value, 1, this.row);
      const currentRowAchTime = Achievements.rowDisabledTime(perkAdjustedRow) / 8;
      if (this.id === 11) return currentRowAchTime;
      return currentRowAchTime + this.previousAchievement.totalDisabledTime;
      })
      .invalidateOn(
        GameEvent.REALITY_RESET_AFTER,
        GameEvent.PERK_BOUGHT
      );
  }

  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    return player.achievements.has(this.id);
  }

  get previousAchievement() {
    const previousAchColumn = Math.wrap(this.column - 1, 1, 8);
    const previousAchRow = previousAchColumn === 8 ? this.row - 1 : this.row;
    return Achievement(previousAchRow * 10 + previousAchColumn);
  }

  get row() {
    return this._row;
  }

  get column() {
    return this._column;
  }

  get isPreReality() {
    return this.row < 14;
  }
  
  tryUnlock(a1, a2, a3) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(a1, a2, a3)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    player.achievements.add(this.id);
    if (this.id === 85 || this.id === 93) {
      Autobuyer.infinity.bumpLimit(4);
    }
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    GameCache.achievementPower.invalidate();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }

  get isEnabled() {
    if (!this.isUnlocked) return false;
    if (!this.hasLockedTime) return true;
    // Keep player.thisReality instead of Time.thisReality here because this is a hot path
    return this.totalDisabledTime <= player.thisReality;
  }

  get remainingDisabledTime() {
    if (!this.isUnlocked || !this.hasLockedTime) return NaN;
    return Math.clampMin(this.totalDisabledTime - player.thisReality, 0);
  }

  get hasLockedTime() {
    return player.realities !== 0 &&
      this.isPreReality &&
      this.row > GameCache.achSkipPerkCount.value;
  }

  get totalDisabledTime() {
    return this._totalDisabledTime.value;
  }

  get isEffectConditionSatisfied() {
    return this.config.effectCondition === undefined || this.config.effectCondition();
  }

  get canBeApplied() {
    return this.isEnabled && this.isEffectConditionSatisfied;
  }

  get secondaryEffect() {
    return this._secondaryState;
  }
}

AchievementState.createIndex(GameDatabase.achievements.normal);

/**
 * @param {number} id
 * @returns {AchievementState}
 */
const Achievement = id => AchievementState.index[id];

const Achievements = {
  /**
   * @type {AchievementState[]}
   */
  all: AchievementState.index.compact(),

  get effectiveCount() {
    const additionalAchievements = Ra.has(RA_UNLOCKS.V_UNLOCK)
      ? Ra.pets.v.level
      : 0;
    const enabledAchievements = Achievements.all.filter(a => a.isEnabled).length;
    return enabledAchievements + additionalAchievements;
  },

  row: row => Array.range(row * 10 + 1, 8).map(Achievement),

  rows: (start, count) => Array.range(start, count).map(Achievements.row),

  get defaultDisabledTime() {
    return TimeSpan.fromDays(2);
  },

  get totalDisabledTime() {
    return Achievement(138).totalDisabledTime;
  },

  get nextTotalDisabledTime() {
    if (player.realities === 0) {
      return Achievements.defaultDisabledTime;
    }
    return GameCache.baseTimeForAllAchs.value.times(0.9);
  },

  get remainingDisabledTime() {
    return Achievement(138).remainingDisabledTime;
  },

  get timeUntilNext() {
    const firstDisabled = Achievements.all.find(a => !a.isEnabled);
    return firstDisabled === undefined ? 0 : firstDisabled.remainingDisabledTime;
  },

  rowDisabledTime(row) {
    const baseTimeForAllAchs = GameCache.baseTimeForAllAchs.value.totalMilliseconds;
    const PRE_REALITY_ACH_ROWS = 13;
    const baseRowTime = baseTimeForAllAchs / PRE_REALITY_ACH_ROWS;
    const realityModifier = GameCache.realityAchTimeModifier.value;
    const rowModifier = realityModifier * TimeSpan.fromSeconds(1600).totalMilliseconds;
    return Math.clampMin(baseRowTime + (row - 7) * rowModifier, 0);
  }
};

EventHub.registerStateCollectionEvents(
  Achievements.all,
  achievement => achievement.config.checkEvent,
  // eslint-disable-next-line max-params
  (achievement, a1, a2, a3) => achievement.tryUnlock(a1, a2, a3)
);

class SecretAchievementState extends GameMechanicState {
  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    return player.secretAchievements.has(this.id);
  }

  tryUnlock(a1, a2, a3) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(a1, a2, a3)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    player.secretAchievements.add(this.id);
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }
}

SecretAchievementState.createIndex(GameDatabase.achievements.secret);

/**
 * @param {number} id
 * @returns {SecretAchievementState}
 */
const SecretAchievement = id => SecretAchievementState.index[id];

const SecretAchievements = {
  /**
   * @type {SecretAchievementState[]}
   */
  all: SecretAchievementState.index.compact()
};

setInterval(() => {
  if (Math.random() < 0.00001) SecretAchievement(18).unlock();
}, 1000);

EventHub.registerStateCollectionEvents(
  SecretAchievements.all,
  achievement => achievement.config.checkEvent,
  // eslint-disable-next-line max-params
  (achievement, a1, a2, a3) => achievement.tryUnlock(a1, a2, a3)
);

class AchievementTimer {
  constructor() {
    this.time = 0;
  }
  
  reset() {
    this.time = 0;
  }
  
  advance() {
    this.time += Time.deltaTime;
  }
  
  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time >= duration;
  }
}

const AchievementTimers = {
  marathon1: new AchievementTimer(),
  marathon2: new AchievementTimer(),
  pain: new AchievementTimer(),
  stats: new AchievementTimer()
};
