"use strict";

class AchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._row = Math.floor(this.id / 10);
    this._column = this.id % 10;
    // eslint-disable-next-line no-bitwise
    this._bitmask = 1 << (this.column - 1);
    // eslint-disable-next-line no-bitwise
    this._inverseBitmask = ~this._bitmask;
  }

  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    // eslint-disable-next-line no-bitwise
    return (player.achievementBits[this.row - 1] & this._bitmask) !== 0;
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

  lock() {
    // eslint-disable-next-line no-bitwise
    player.achievementBits[this.row - 1] &= this._inverseBitmask;
  }

  unlock() {
    if (this.isUnlocked) return;
    // eslint-disable-next-line no-bitwise
    player.achievementBits[this.row - 1] |= this._bitmask;
    if (this.id === 85 || this.id === 93) {
      Autobuyer.bigCrunch.bumpAmount(4);
    }
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    GameCache.achievementPower.invalidate();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }

  get isEnabled() {
    return this.isUnlocked;
  }

  get isEffectActive() {
    return this.isUnlocked;
  }
}

/**
 * @param {number} id
 * @returns {AchievementState}
 */
const Achievement = AchievementState.createAccessor(GameDatabase.achievements.normal);

const Achievements = {
  /**
   * @type {AchievementState[]}
   */
  all: Achievement.index.compact(),

  get effectiveCount() {
    const additionalAchievements = Ra.has(RA_UNLOCKS.V_UNLOCK)
      ? Ra.pets.v.level
      : 0;
    const enabledAchievements = Achievements.all.filter(a => a.isEnabled).length;
    return enabledAchievements + additionalAchievements;
  },

  get period() {
    return 1800 * 1000;
  },

  row: row => Array.range(row * 10 + 1, 8).map(Achievement),

  rows: (start, count) => Array.range(start, count).map(Achievements.row),

  autoAchieveUpdate(diff) {
    if (player.realities === 0) return;
    if (Achievements.rows(1, 13).every(row => row.every(a => a.isUnlocked))) return;

    const disabled = Achievements.all.filter(a => !a.isEnabled);
    while (disabled[0].row <= GameCache.achSkipPerkCount.value) {
      disabled.shift().unlock();
    }

    if (player.reality.disableAutoAchieve) return;
    player.reality.achTimer += diff;

    // Don't bother making the disabled list if we don't need it
    if (player.reality.achTimer < this.period) return;
    while (disabled.length > 0 && disabled[0].row <= 13 && player.reality.achTimer >= this.period) {
      player.reality.achTimer -= this.period;
      disabled.shift().unlock();
      player.reality.gainedAutoAchievements = true;
    }


  },

  timeToNextAutoAchieve() {
    if (player.realities === 0) return 0;
    if (GameCache.achSkipPerkCount.value >= 13) return 0;
    const disabled = Achievements.all.filter(a => !a.isEnabled);
    if (disabled.length === 0 || disabled[0].row > 13) return 0;
    return Math.max(this.period - player.reality.achTimer, 1);
  },
};

EventHub.registerStateCollectionEvents(
  Achievements.all,
  achievement => achievement.config.checkEvent,
  // eslint-disable-next-line max-params
  (achievement, a1, a2, a3) => achievement.tryUnlock(a1, a2, a3)
);

class SecretAchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._row = Math.floor(this.id / 10);
    this._column = this.id % 10;
    // eslint-disable-next-line no-bitwise
    this._bitmask = 1 << (this.column - 1);
    // eslint-disable-next-line no-bitwise
    this._inverseBitmask = ~this._bitmask;
  }

  get name() {
    return this.config.name;
  }

  get row() {
    return this._row;
  }

  get column() {
    return this._column;
  }

  get isUnlocked() {
    // eslint-disable-next-line no-bitwise
    return (player.secretAchievementBits[this.row - 1] & this._bitmask) !== 0;
  }

  tryUnlock(a1, a2, a3) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(a1, a2, a3)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    // eslint-disable-next-line no-bitwise
    player.secretAchievementBits[this.row - 1] |= this._bitmask;
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }

  lock() {
    // eslint-disable-next-line no-bitwise
    player.secretAchievementBits[this.row - 1] &= this._inverseBitmask;
  }
}

/**
 * @param {number} id
 * @returns {SecretAchievementState}
 */
const SecretAchievement = SecretAchievementState.createAccessor(GameDatabase.achievements.secret);

const SecretAchievements = {
  /**
   * @type {SecretAchievementState[]}
   */
  all: SecretAchievement.index.compact(),

  get enabledCount() {
    return SecretAchievements.all.filter(a => a.isEnabled).length;
  },
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
  constructor(isRealTime) {
    this.time = 0;
    this.realTime = isRealTime;
  }

  reset() {
    this.time = 0;
  }

  advance() {
    const addedTime = this.realTime
      ? Time.unscaledDeltaTime.totalSeconds
      : Time.deltaTime;
    this.time += addedTime;
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
  marathon1: new AchievementTimer(false),
  marathon2: new AchievementTimer(false),
  pain: new AchievementTimer(true),
  stats: new AchievementTimer(true)
};
