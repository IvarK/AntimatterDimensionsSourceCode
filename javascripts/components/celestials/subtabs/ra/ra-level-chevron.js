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
    importantLevels: Array
  },
  data() {
    return {
      mouseOverInterval: 0,
      isMouseOver: false
    };
  },
  computed: {
    percentPerLevel() {
      return this.singleLevel ? 0 : 100 / (this.goal - 1);
    },
    levelPosition() {
      if (this.level === this.goal)
        return {
          right: "0%",
        };
      return {
        left: `${this.percentPerLevel * (this.level - 1)}%`,
      };
    },
    isImportantLevel() {
      return this.importantLevels.includes(this.level);
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
    <span>
      {{level}}
    </span>
  </div>
  `
});