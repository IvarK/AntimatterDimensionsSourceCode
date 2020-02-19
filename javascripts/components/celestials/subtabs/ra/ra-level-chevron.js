"use strict";

Vue.component("ra-level-chevron", {
  props: {
    level: Number,
    goal: Number,
    unlock: Object,
    singleLevel: {
      type: Boolean,
      defualt: false
    },
    isImportantLevel: Boolean
  },
  data() {
    return {
      mouseOverInterval: 0,
      isMouseOver: false
    };
  },
  computed: {
    levelPercent() {
      return 100 * Ra.totalExpForLevel(this.level) / Ra.totalExpForLevel(this.goal);
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
  methods: {
    onMouseEnter() {
      if (this.$viewModel.shiftDown) return;
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 500);
    }
  },
  template: `
  <div
    class="l-ra-lvl-chevron"
    :style="levelPosition"
    :class="classList"
    @mouseenter="onMouseEnter"
    @click="onMouseEnter"
    @mouseleave="onMouseLeave">
    <div v-if="isMouseOver && isImportantLevel" class="o-ra-unlock-hover-text">
      {{unlock.reward}}
    </div>
    <span v-if="levelPercent > 20">
      {{level}}
    </span>
  </div>
  `
});
