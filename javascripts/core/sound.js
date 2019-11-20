"use strict";

class SoundEffectState extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  play() {
      new Audio(`audio/${this.config.fileName}`).play();
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