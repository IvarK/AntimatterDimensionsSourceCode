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
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
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

  get isPreReality() {
    return this.row < 14;
  }

  get isUnlocked() {
    // eslint-disable-next-line no-bitwise
    return (player.achievementBits[this.row - 1] & this._bitmask) !== 0;
  }

  get isEffectActive() {
    return this.isUnlocked;
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(args)) return;
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
    Achievements._power.invalidate();
    EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
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

  /**
   * @type {AchievementState[]}
   */
  get preReality() {
    return Achievements.all.filter(ach => ach.isPreReality);
  },

  get allRows() {
    const count = Achievements.all.map(a => a.row).max();
    return Achievements.rows(1, count);
  },

  get preRealityRows() {
    const count = Achievements.preReality.map(a => a.row).max();
    return Achievements.rows(1, count);
  },

  rows: (start, count) => Array.range(start, count).map(Achievements.row),

  row: row => Array.range(row * 10 + 1, 8).map(Achievement),

  get effectiveCount() {
    const unlockedAchievements = Achievements.all.countWhere(a => a.isUnlocked);
    const additionalAchievements = Ra.has(RA_UNLOCKS.V_UNLOCK) ? Ra.pets.v.level : 0;
    return unlockedAchievements + additionalAchievements;
  },

  get period() {
    return TimeSpan.fromMinutes(30).totalMilliseconds;
  },

  autoAchieveUpdate(diff) {
    if (player.realities === 0) return;
    if (!player.reality.autoAchieve) return;
    if (Achievements.preReality.every(a => a.isUnlocked)) return;

    player.reality.achTimer += diff;
    if (player.reality.achTimer < this.period) return;

    for (const achievement of Achievements.preReality.filter(a => !a.isUnlocked)) {
      achievement.unlock();
      player.reality.achTimer -= this.period;
      if (player.reality.achTimer < this.period) break;
    }
    player.reality.gainedAutoAchievements = true;
  },

  timeToNextAutoAchieve() {
    if (player.realities === 0) return 0;
    if (GameCache.achSkipPerkCount.value >= Achievements.preRealityRows.length) return 0;
    if (Achievements.preReality.countWhere(a => !a.isUnlocked) === 0) return 0;
    return Math.max(this.period - player.reality.achTimer, 1);
  },

  _power: new Lazy(() => {
    const unlockedRows = Achievements.allRows
      .countWhere(row => row.every(ach => ach.isUnlocked));
    const basePower = Math.pow(1.25, unlockedRows) * Math.pow(1.03, Achievements.effectiveCount);
    return basePower * getAdjustedGlyphEffect("effarigachievement");
  }),

  get power() {
    return Achievements._power.value;
  }
};

EventHub.logic.on(GAME_EVENT.PERK_BOUGHT, () => {
  const unlockedRows = GameCache.achSkipPerkCount.value;
  for (const row of Achievements.rows(1, unlockedRows)) {
    for (const achievement of row) {
      achievement.unlock();
    }
  }
});
