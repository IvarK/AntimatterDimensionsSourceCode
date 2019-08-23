"use strict";

Vue.component("normal-achievement", {
  props: {
    achievement: Object
  },
  data() {
    return {
      isUnlocked: false,
      isEnabled: false,
      remainingTime: 0,
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
        "o-achievement--unlocked": this.isUnlocked && this.isEnabled,
        "o-achievement--disabled": this.isUnlocked && !this.isEnabled,
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
    lockedTooltip() {
      const remainingTime = TimeSpan.fromMilliseconds(this.remainingTime);
      if (remainingTime.totalMinutes < 1) {
        const floored = Math.floor(remainingTime.totalSeconds);
        return `(Locked: ${floored} ${floored === 1 ? "second" : "seconds"})`;
      }
      if (remainingTime.totalHours < 1) {
        return `(Locked: ${remainingTime.totalMinutes.toFixed(1)} minutes)`;
      }
      if (remainingTime.totalDays < 1) {
        return `(Locked: ${remainingTime.totalHours.toFixed(1)} hours)`;
      }
      return `(Locked: ${remainingTime.totalDays.toFixed(1)} days)`;
    },
    tooltip() {
      if (this.isUnlocked && !this.isEnabled && this.isMouseOver) {
        return `${this.detailsTooltip}\n${this.lockedTooltip}`;
      }
      return this.detailsTooltip;
    }
  },
  methods: {
    update() {
      this.remainingTime = this.achievement.remainingDisabledTime;
      this.isUnlocked = this.achievement.isUnlocked;
      this.isEnabled = this.achievement.isEnabled;
      this.isCancer = Theme.current().name === "S4";
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
