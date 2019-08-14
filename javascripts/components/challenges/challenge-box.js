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
  computed: {
    buttonClassObject() {
      const classObject = {
        "o-challenge-btn": true
      };
      if (this.isRunning) {
        classObject["o-challenge-btn--running"] = true;
      } else if (this.isCompleted) {
        classObject["o-challenge-btn--completed"] = true;
      } else if (this.isUnlocked) {
        classObject["o-challenge-btn--unlocked"] = true;
      } else {
        classObject["o-challenge-btn--locked"] = true;
      }
      return classObject;
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning) return "Running";
      if (this.isCompleted) return "Completed";
      if (this.isUnlocked) return "Start";
      return "Locked";
    }
  },
  template:
    `<div class="c-challenge-box l-challenge-box">
      <hint-text class="l-hint-text--challenge">{{name}}</hint-text>
      <slot name="top" />
      <div class="l-challenge-box__fill" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >{{buttonText}}</button>
      <slot name="bottom" />
    </div>`
});