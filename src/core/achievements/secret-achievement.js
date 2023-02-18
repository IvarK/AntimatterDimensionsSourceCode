import { GameMechanicState } from "../game-mechanics";

class SecretAchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._row = Math.floor(this.id / 10);
    this._column = this.id % 10;
    this._bitmask = 1 << (this.column - 1);
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

  get isUnlocked() {
    return (player.secretAchievementBits[this.row - 1] & this._bitmask) !== 0;
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    player.secretAchievementBits[this.row - 1] |= this._bitmask;
    GameUI.notify.success(`Secret Achievement: ${this.name}`);
    EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
  }

  lock() {
    player.secretAchievementBits[this.row - 1] &= this._inverseBitmask;
  }
}

/**
 * @param {number} id
 * @returns {SecretAchievementState}
 */
export const SecretAchievement = SecretAchievementState.createAccessor(GameDatabase.achievements.secret);

export const SecretAchievements = {
  /**
   * @type {SecretAchievementState[]}
   */
  all: SecretAchievement.index.compact(),

  get allRows() {
    const count = SecretAchievements.all.map(a => a.row).max();
    return SecretAchievements.rows(1, count);
  },

  rows: (start, count) => Array.range(start, count).map(SecretAchievements.row),

  row: row => Array.range(row * 10 + 1, 8).map(SecretAchievement),
};
