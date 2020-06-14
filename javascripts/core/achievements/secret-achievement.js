"use strict";

class SecretAchievementState extends GameMechanicState {
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

  get isUnlocked() {
    // eslint-disable-next-line no-bitwise
    return (player.secretAchievementBits[this.row - 1] & this._bitmask) !== 0;
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    // eslint-disable-next-line no-bitwise
    player.secretAchievementBits[this.row - 1] |= this._bitmask;
    GameUI.notify.success(this.name);
    EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
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
  all: SecretAchievement.index.compact()
};