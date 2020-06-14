"use strict";

Vue.component("ra-level-chevron", {
  props: {
    minLevel: Number,
    level: Number,
    goal: Number,
    singleLevel: {
      type: Boolean,
      defualt: false
    },
    isImportantLevel: Boolean
  },
  computed: {
    levelPercent() {
      const startScl = Math.sqrt(Ra.totalExpForLevel(this.minLevel));
      const endScl = Math.sqrt(Ra.totalExpForLevel(this.goal));
      const currentScl = Math.sqrt(Ra.totalExpForLevel(this.level));
      const expFraction = (currentScl - startScl) / (endScl - startScl);
      return 100 * expFraction;
    },
    levelPosition() {
      if (this.level === this.goal) return { right: "0%" };
      if (this.singleLevel) return { left: "0%" };
      return { left: `${this.levelPercent}%` };
    },
    classList() {
      return [
        this.isImportantLevel ? "c-important-chevron" : "",
        this.level === 1 || this.level === this.goal || this.singleLevel ? "l-ra-lvl-chevron--no-bar" : ""
      ];
    }
  },
  template: `
  <div v-if="level >= minLevel || singleLevel"
    class="l-ra-lvl-chevron"
    :style="levelPosition"
    :class="classList">
    <span v-if="isImportantLevel || level === goal">
      {{formatInt(level)}}
    </span>
  </div>
  `
});
