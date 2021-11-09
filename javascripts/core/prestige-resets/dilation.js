"use strict";

class EnterDilationReset extends BaseEternityReset {
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
    return super.canBePerformed && PlayerProgress.dilationUnlocked();
  }
}

class ExitDilationReset extends BaseEternityReset {
  get confirmationOption() {
    return player.options.confirmations.dilation;
  }

  set confirmationOption(value) {
    player.options.confirmations.dilation = value;
  }

  confirmation(props) {
    Modal.exitDilation.show(props);
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
    return super.canBePerformed && player.dilation.active;
  }
}

Reset.enterDilation = new EnterDilationReset();

Reset.exitDilation = new ExitDilationReset();
