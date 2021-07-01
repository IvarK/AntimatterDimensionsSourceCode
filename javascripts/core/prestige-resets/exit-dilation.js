"use strict";

class ExitDilationReset extends EternityReset {
  get confirmationOption() {
    return player.options.confirmations.dilation;
  }

  set confirmationOption(value) {
    player.options.confirmations.dilation = value;
  }

  confirmation(props) {
    Reset.exitDilation(props);
    GameUI.notify.error("its being worked on sorry", 100000);
    GameUI.notify.error("for now you get no modal", 100000);
    GameUI.notify.error("TODO: Exiting Dilation Modal NYI", 100000);
  }

  get animationOption() {
    return player.options.animations.dilation;
  }

  set animationOption(value) {
    player.options.animations.dilation = value;
  }

  animation() {
    document.body.style.animation = "undilate 2s 1 linear";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }

  // eslint-disable-next-line no-empty-function
  tabChange() { }

  gain() {
    Currency.tachyonParticles.bumpTo(getTP(Currency.antimatter.value));
    player.dilation.lastEP.copyFrom(Currency.eternityPoints);
  }

  reset() {
    player.challenge.eternity.current = 0;
    player.dilation.active = false;
    super.reset();
  }

  get canBePerformed() {
    return player.dilation.active;
  }
}

Reset.exitDilation = new ExitDilationReset();
