"use strict";

/* eslint-disable no-empty-function */
class PrestigeMechanic {
  // TODO: Fix wasReached and wasReachedEver to actually be abstract once setup is finished.
  /**
   * @abstract
   * @returns {boolean}
   */
  get wasReached() { return false; }

  /**
   * @abstract
   * @returns {boolean}
   */
  get wasReachedEver() { return false; }

  /**
   * @abstract
   * @returns {Decimal}
   */
  get goal() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {Currency|Decimal}
   */
  get currencyRequired() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {GAME_EVENT}
   */
  get eventBefore() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {GAME_EVENT}
   */
  get eventAfter() { throw new NotImplementedError(); }


  /**
   * @returns {boolean} - the confirmation option, if none is provided, undefined.
   */
  get confirmationOption() { return undefined; }
  /**
   * @param {boolean} value - the value to set the confirmation option to.
   */
  set confirmationOption(value) { }

  confirmation() { }


  /**
   * @returns {boolean} - the animation option, if none is provided, undefined.
   */
  get animationOption() { return undefined; }
  /**
   * @param {boolean} value - the value to set the animation option to.
   */
  set animationOption(value) { }

  animation() { }


  tabChange() { }

  /** @abstract */
  statistics() { throw new NotImplementedError(); }

  /** @abstract */
  reset() { throw new NotImplementedError(); }

  /** @abstract */
  gain() { throw new NotImplementedError(); }


  /**
   * @returns {boolean} - if the current required is greater than the goal, we can perform this action.
   * commonly overriden if currencyRequired isn't a Decimal, goal is neither a Decimal nor a number,
   * or needs additional or alternative requirements.
   */
  get canBePerformed() {
    return this.currencyRequired.gte(this.goal);
  }


  /**
   * @param {object<string, boolean>} props - may contain one or more of the following booleans:
   * @param {boolean} auto - which prevents confirmation, force, or tab change from happening.
   * @param {boolean} confirmation - which determines if the confirmation modal needs to be displayed.
   * @param {boolean} force - which forces the reset without any gain
   * (does not play the animation or ask for confirmation)
   * @param {boolean} forceAnimation - used to force an animation to occur, even if the player has normally
   * disabled it. (use rarely)
   */
  request(props = {}) {
    const needsConfirmation = this.confirmationOption && !props.confirmation && !props.auto;
    if (needsConfirmation) {
      // If we need a confirmation and don't have it, go get it (the modal will return props with confirmation = true)
      props.confirmation = true;
      this.confirmation(props);
      return;
    }
    // If we don't have enough resources to actually do it, but we're forcing it, reset for no gain.
    const noGain = !this.canBePerformed && props.force;
    // If its not auto, the option is enabled, and we aren't resetting for no gain, play the animiation.
    // If playing the animation is forced, always do it.
    const animationPlays = (this.animationOption && !props.auto && !noGain) || props.forceAnimation;
    // If its not auto and not for no gain, we want to change tabs
    const tabChangeHappens = !props.auto && !noGain;

    EventHub.dispatch(this.eventBefore);
    if (animationPlays) this.animation();
    if (tabChangeHappens) this.tabChange();
    if (!noGain) this.gain();
    this.reset(true);
    EventHub.dispatch(this.eventAfter);
  }
}

const Reset = {};
