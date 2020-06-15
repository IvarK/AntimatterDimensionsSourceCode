"use strict";

class SoundEffectState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryPlay(args));
  }

  tryPlay() {
    const option = player.options.audio[this.config.name.camelize()];
    if (option === 0) return;
    const path = this.config.options
      ? `audio/${this.config.name} ${this.config.options[option - 1].toLowerCase()}.wav`
      : `audio/${this.config.name}.wav`;
    const sound = new Audio(path);
    sound.volume = 0.5;
    sound.play();
  }
}

/**
 * @param {number} id
 * @returns {SoundEffectState}
 */
const SoundEffect = SoundEffectState.createAccessor(GameDatabase.sounds);

const SoundEffects = {
  /**
   * @type {SoundEffectState[]}
   */
  all: SoundEffect.index.compact()
};