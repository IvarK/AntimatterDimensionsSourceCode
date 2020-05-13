"use strict";

Vue.component("game-header-gamespeed-display", {
  data() {
    return {
      baseSpeed: 0,
      pulsedSpeed: 0,
      isPulsing: false,
    };
  },
  methods: {
    update() {
      this.baseSpeed = getGameSpeedupFactor();
      this.pulsedSpeed = getGameSpeedupForDisplay();
      this.isPulsing = this.baseSpeed !== this.pulsedSpeed;
    },
    formatNumber(num) {
      if (num >= 0.001 && num < 10000 && num !== 1) {
        return format(num, 3, 3);
      }
      if (num < 0.001) {
        return `${formatInt(1)} / ${format(1 / num, 2)}`;
      }
      return `${format(num, 2)}`;
    }
  },
  computed: {
    baseSpeedText() {
      if (Enslaved.isStoringRealTime) {
        return "Stopped (storing real time)";
      }
      const speed = this.formatNumber(this.baseSpeed);
      if (EternityChallenge(12).isRunning) {
        return `${speed} (fixed)`;
      }
      return `${speed}`;
    },
    pulseSpeedText() {
      return `${this.formatNumber(this.pulsedSpeed)}`;
    }
  },
  template:
    `<span>
      | Game speed: {{ baseSpeedText }} 
      <span v-if="isPulsing">(<i class="fas fa-expand-arrows-alt u-fa-padding"></i> {{ pulseSpeedText }})</span>
    </span>`
});
