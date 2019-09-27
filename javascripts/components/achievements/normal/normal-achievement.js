"use strict";

Vue.component("normal-achievement", {
  props: {
    achievement: Object
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      mouseOverInterval: 0,
      isCancer: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    styleObject() {
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--locked": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--blink": this.id === 78 && !this.isUnlocked,
        "o-achievement--normal": !this.isCancer,
        "o-achievement--cancer": this.isCancer
      };
    },
    detailsTooltip() {
      function evaluateText(prop) {
        return typeof prop === "function" ? prop() : prop;
      }
      const config = this.achievement.config;
      let tooltip = evaluateText(config.tooltip);
      if (config.reward !== undefined) {
        tooltip += ` Reward: ${evaluateText(config.reward)}`;
      }
      return tooltip;
    },
    tooltip() {
      return this.detailsTooltip;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.isCancer = Theme.current().name === "S4" || player.secretUnlocks.cancerAchievements;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 500);
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      :ach-tooltip="tooltip"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave">
      <hint-text class="l-hint-text--achievement">{{id}}</hint-text>
      <br>
     </div>`
});
