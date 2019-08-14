Vue.component('normal-achievement', {
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
      const tooltip = this.achievement.config.tooltip;
      return typeof tooltip === "function" ? tooltip() : tooltip;
    },
    lockedTooltip() {
      const remainingTime = this.remainingTime;
      if (remainingTime < 60) {
        const floored = Math.floor(remainingTime);
        return `(Locked: ${floored} ${floored === 1 ? "second" : "seconds"})`;
      }
      else if (remainingTime < 3600) {
        return "(Locked: " + (remainingTime / 60).toFixed(1) + " minutes)";
      }
      else if (remainingTime < 86400) {
        return "(Locked: " + (remainingTime / 3600).toFixed(1) + " hours)";
      }
      else {
        return "(Locked: " + (remainingTime / 86400).toFixed(1) + " days)";
      }
    },
    tooltip: function() {
      if (this.isUnlocked && !this.isEnabled && this.isMouseOver) {
        return `${this.detailsTooltip}\n${this.lockedTooltip}`;
      }
      return this.detailsTooltip;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.on$(GameEvent.REALITY, this.updateState);
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
    onMouseEnter: function() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave: function() {
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
      <br>
     </div>`
});