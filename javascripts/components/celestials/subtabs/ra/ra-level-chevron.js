"use strict";

Vue.component("ra-level-chevron", {
  props: {
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
      return 100 * Math.sqrt(Ra.totalExpForLevel(this.level) / Ra.totalExpForLevel(this.goal));
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
  <div
    class="l-ra-lvl-chevron"
    :style="levelPosition"
    :class="classList">
    <span v-if="levelPercent > 15">
      {{level}}
    </span>
  </div>
  `
});
