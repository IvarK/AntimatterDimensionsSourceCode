"use strict";

class SoundEffectState {
  constructor(config) {
    if (!config) throw new Error("Must specify config for SoundEffectState");
    this.config = config;
  }

  static createIndex(gameData) {
    this.index = mapGameData(gameData, config => new this(config));
  }

  play() {
    const sound = new Audio(`audio/${this.config.fileName}.wav`);
    sound.volume = 0.5;
    sound.play();
  }
}

SoundEffectState.createIndex(GameDatabase.sounds);

/**
 * @param {number} id
 * @returns {SoundEffectState}
 */
const SoundEffect = id => SoundEffectState.index[id];

const SoundEffects = {
  /**
   * @type {SoundEffectState[]}
   */
  all: SoundEffectState.index.compact()
};

EventHub.registerStateCollectionEvents(
  SoundEffects.all,
  sound => sound.config.checkEvent,
  // eslint-disable-next-line max-params
  sound => sound.play()
);