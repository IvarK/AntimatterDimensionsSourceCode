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
      if (player.celestials.enslaved.isStoringReal) {
        return "(γ = 0 | storing real time)";
      }
      let speedMod = getGameSpeedupFactor();
      let storedTimeText = "";
      if (player.celestials.enslaved.isStoring) {
        if (Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME)) {
          const storedTimeWeight = player.celestials.enslaved.storedFraction;
          speedMod = Math.pow(speedMod, 1 - storedTimeWeight);
          if (storedTimeWeight !== 0) {
            storedTimeText = ` | storing ${formatPercents(storedTimeWeight)} game time`;
          }
        } else {
          speedMod = 1;
          storedTimeText = ` | storing game time`;
        }
      }
      if (speedMod < 10000 && speedMod !== 1) {
        return `(γ = ${speedMod.toFixed(3)}${storedTimeText})`;
      }
      return `(γ = ${shorten(speedMod, 2)}${storedTimeText})`;
    }
  },
  template:
    `<span>{{gammaDisplay}}</span>`
});