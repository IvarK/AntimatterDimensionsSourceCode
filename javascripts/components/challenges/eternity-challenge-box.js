"use strict";

Vue.component("eternity-challenge-box", {
  props: {
    name: String,
    isUnlocked: false,
    isRunning: false,
    isCompleted: false,
    canBeUnlocked: false,
    overrideLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      challengeId: Number,
    };
  },
  computed: {
    // eslint-disable-next-line complexity
    buttonClassObject() {
      const challengeDone = this.isCompleted && !this.isUnlocked;
      const challengeRedo = this.isCompleted && this.isUnlocked && !this.isRunning;
      const challengeUnlock = this.isUnlocked || this.canBeUnlocked;
      const challengeLocked = !(this.isCompleted || this.isRunning || challengeUnlock) && !challengeDone;
      // ECs can be not unlocked and also not locked, because they're fully completed,
      // but in that case you can't enter them and so it's important to give them a property
      // that disables cursor on hover. The same thing happens if it is running.
      const challengeClickable = !this.isRunning && ((!this.isCompleted && this.canBeUnlocked) || this.isUnlocked);
      return {
        "o-challenge-btn": true,
        "o-challenge-btn--running": this.isRunning,
        "o-challenge-btn--completed": challengeDone,
        "o-challenge-btn--redo": challengeRedo,
        "o-challenge-btn--unlocked": !challengeDone && challengeUnlock,
        "o-challenge-btn--locked": challengeLocked,
        "o-challenge-btn--unenterable": !challengeClickable,
      };
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning) return "Running";
      if (this.isCompleted) {
        if (this.isUnlocked) return "Redo";
        return "Completed";
      }
      if (this.isUnlocked) return "Start";
      if (this.canBeUnlocked) return "Unlock";
      return "Locked";
    }
  },
  template:
    `<div class="c-challenge-box l-challenge-box c-challenge-box--eternity">
      <hint-text type="challenges" class="l-hint-text--challenge">{{name}}</hint-text>
      <slot name="top" />
      <div class="l-challenge-box__fill" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >{{buttonText}}</button>
      <slot name="bottom" />
    </div>`
});
