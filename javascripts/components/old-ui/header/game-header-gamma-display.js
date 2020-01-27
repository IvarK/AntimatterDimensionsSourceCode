"use strict";

Vue.component("game-header-gamma-display", {
  data() {
    return {
      gammaText: ""
    };
  },
  computed: {
    gammaDisplay() {
      return this.gammaText;
    },
  },
  methods: {
    update() {
      this.gammaText = this.getGameSpeedupText();
    },
    getGameSpeedupText() {
      if (Enslaved.isStoringRealTime) {
        return "Stopped (storing real time)";
      }
      const speedMod = getGameSpeedupForDisplay();
      let storedTimeText = "";
      if (Enslaved.isStoringGameTime) {
        if (Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME)) {
          const storedTimeWeight = player.celestials.enslaved.storedFraction;
          if (storedTimeWeight !== 0) {
            storedTimeText = ` (charging ${formatPercents(storedTimeWeight)})`;
          }
        } else {
          storedTimeText = ` (charging black hole)`;
        }
      }
      if (Enslaved.isAutoReleasing) {
        storedTimeText = ` (pulsing black hole)`;
      }
      if (EternityChallenge(12).isRunning || TimeCompression.isActive) {
        storedTimeText = ` (fixed)`;
      }
      if (speedMod >= 0.001 && speedMod < 10000 && speedMod !== 1) {
        return `${speedMod.toFixed(3)}${storedTimeText}`;
      }
      if (speedMod < 0.001) {
        return `${formatInt(1)} / ${format(1 / speedMod, 2)}${storedTimeText}`;
      }
      return `${format(speedMod, 2)}${storedTimeText}`;
    }
  },
  template:
    `<span>| Game speed: {{ gammaDisplay }}</span>`
});
