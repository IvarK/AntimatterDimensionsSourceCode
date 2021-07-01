"use strict";

class EnterDilationReset extends EternityReset {
  get confirmationOption() {
    return player.options.confirmations.dilation;
  }

  set confirmationOption(value) {
    player.options.confirmations.dilation = value;
  }

  confirmation(props) {
    Modal.enterDilation.show(props);
  }

  get animationOption() {
    return player.options.animations.dilation;
  }

  set animationOption(value) {
    player.options.animations.dilation = value;
  }

  animation() {
    document.body.style.animation = "dilate 2s 1 linear";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }

  // eslint-disable-next-line no-empty-function
  tabChange() { }

  gain() {
    Achievement(136).unlock();
    player.dilation.active = true;
  }

  reset() {
    Reset.eternity.request({ force: true });
    player.challenge.eternity.current = 0;
  }

  get canBePerformed() {
    return PlayerProgress.dilationUnlocked();
  }
}

Reset.enterDilation = new EnterDilationReset();
