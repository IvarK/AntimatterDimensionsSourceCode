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

  lock() {
    player.achievements.delete(this.id);
  }

  unlock() {
    if (this.isUnlocked) return;
    player.achievements.add(this.id);
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

  get period() {
    return 1800 * 1000;
  }

  row: row => Array.range(row * 10 + 1, 8).map(Achievement),

  rows: (start, count) => Array.range(start, count).map(Achievements.row),

  autoAchieveUpdate(diff) {
    if (player.realities === 0) return;
    if (GameCache.achSkipPerkCount.value >= 13) return;
    player.reality.achTimer += diff;
    // Don't bother making the disabled list if we don't need it
    if (player.reality.achTimer < this.period) return;
    const disabled = Achievements.all.filter(a => !a.isEnabled);
    while (disabled.length > 0 && disabled[0].row <= 13 && player.reality.achTimer >= this.period) {
      player.reality.achTimer -= this.period;
      disabled.shift().unlock();
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
