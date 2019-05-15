"use strict";

Vue.component("normal-achievement", {
  props: {
    row: Number,
    column: Number
  },
  data() {
    return {
      isUnlocked: false,
      isEnabled: false,
      enablesAt: 0,
      remainingTime: 0,
      isMouseOver: false,
      mouseOverInterval: 0
    };
  },
  computed: {
    achId() {
      return this.row * 10 + this.column;
    },
    achievement() {
      return Achievement(this.achId);
    },
    styleObject() {
      return {
        "background-image": `url(images/r${this.achId}.png)`,
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--locked": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked && this.isEnabled,
        "o-achievement--disabled": this.isUnlocked && !this.isEnabled,
        "o-achievement--blink": this.achId === 78 && !this.isUnlocked
      };
    },
    detailsTooltip() {
      function evaluateText(prop) {
        return typeof prop === "function" ? prop() : prop;
      }
      const { config } = this.achievement;
      let tooltip = evaluateText(config.tooltip);
      if (config.reward !== undefined) {
        tooltip += ` Reward: ${evaluateText(config.reward)}`;
      }
      return tooltip;
    },
    lockedTooltip() {
      const remainingTime = this.remainingTime;
      if (remainingTime < 60) {
        const floored = Math.floor(remainingTime);
        return `(Locked: ${floored} ${floored === 1 ? "second" : "seconds"})`;
      }
      if (remainingTime < 3600) {
        return `(Locked: ${(remainingTime / 60).toFixed(1)} minutes)`;
      }
      if (remainingTime < 86400) {
        return `(Locked: ${(remainingTime / 3600).toFixed(1)} hours)`;
      }
      return `(Locked: ${(remainingTime / 86400).toFixed(1)} days)`;
    },
    tooltip() {
      if (this.isUnlocked && !this.isEnabled && this.isMouseOver) {
        return `${this.detailsTooltip}\n${this.lockedTooltip}`;
      }
      return this.detailsTooltip;
    },
    hintText() {
      return `${this.achId}`;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.on$(GameEvent.REALITY_RESET_AFTER, this.updateState);
    this.updateState();
  },
  methods: {
    update() {
      if (!this.isUnlocked || this.isEnabled) {
        return;
      }
      const remainingTime = this.enablesAt - new Date().getTime() / 1000;
      this.remainingTime = remainingTime;
      this.isEnabled = remainingTime <= 0;
    },
    updateState() {
      this.isUnlocked = this.achievement.isUnlocked;
      if (!this.isUnlocked) {
        return;
      }
      if (player.realities === 0) {
        this.isEnabled = true;
        return;
      }
      const remainingTime = timeUntilAch(this.achId);
      this.isEnabled = isNaN(remainingTime) || remainingTime <= 0;
      if (this.isEnabled) {
        return;
      }
      this.enablesAt = new Date().getTime() / 1000 + remainingTime;
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
      <hint-text class="l-hint-text--achievement">{{hintText}}</hint-text>
      <br>
     </div>`
});
