"use strict";

Vue.component("challenge-box", {
  props: {
    name: String,
    isUnlocked: false,
    isRunning: false,
    isCompleted: false,
    overrideLabel: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      isEC: false,
    };
  },
  computed: {
    update() {
      this.isEC = this.name.startsWith("EC");
      this.inC1 = this.name === "C1" && !this.isCompleted && NormalChallenge.current === undefined &&
        InfinityChallenge.current === undefined;
    },
    buttonClassObject() {
      const classObject = {
        "o-challenge-btn": true
      };
      if (this.isRunning || this.inC1) {
        classObject["o-challenge-btn--running"] = true;
      } else if (this.isCompleted && ((this.isUnlocked && !this.isEC) || (!this.isUnlocked && this.isEC))) {
        classObject["o-challenge-btn--completed"] = true;
      } else if (this.isCompleted && this.isUnlocked && this.isEC) {
        classObject["o-challenge-btn--redo"] = true;
      } else if (this.isUnlocked) {
        classObject["o-challenge-btn--unlocked"] = true;
      } else {
        classObject["o-challenge-btn--locked"] = true;
      }
      // ECs can be not unlocked and also not locked, because they're fully completed,
      // but in that case you can't enter them and so it's important to give them a property
      // that disables cursor on hover. The same thing happens with challenges that are running,
      // of any type, and with Challenge 1.
      classObject["o-challenge-btn--unenterable"] = !this.isUnlocked || this.isRunning || this.name === "C1";
      return classObject;
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning || this.inC1) return "Running";
      if (this.isCompleted) {
        if (this.isEC && this.isUnlocked) return "Redo";
        return "Completed";
      }
      if (this.isUnlocked) return "Start";
      return "Locked";
    }
  },
  template:
    `<div class="c-challenge-box l-challenge-box">
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