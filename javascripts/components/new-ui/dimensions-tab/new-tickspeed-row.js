"use strict";

Vue.component("new-tickspeed-row", {
  data() {
    return {
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: 1
    };
  },
  computed: {
    classObject() {
      return {
        "c-game-header__tickspeed-row": true,
        "c-game-header__tickspeed-row--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      const tickmult = this.mult;
      if (tickmult.lte(1e-9)) {
        return `${this.shorten(tickmult.reciprocal(), 2, 0)}x faster / upgrade.`;
      }
      const asNumber = tickmult.toNumber();
      let places = asNumber >= 0.2 ? 0 : Math.floor(Math.log10(Math.round(1 / asNumber)));
      if (player.galaxies === 1) places = Math.max(places, 1);
      return `-${((1 - asNumber) * 100).toFixed(places)}% / upgrade`;
    },
    tickspeedDisplay() {
      const tickspeed = this.tickspeed;
      let displayValue;
      if (tickspeed.exponent > 1) {
        displayValue = tickspeed.toFixed(0);
      } else {
        const oom = Decimal.divide(100, Decimal.pow10(tickspeed.exponent));
        displayValue = `${tickspeed.times(oom).toFixed(0)} / ${shorten(oom, 2, 2)}`;
      }
      return `Tickspeed: ${displayValue}`;
    },
    isGameSpeedNormal() {
      return this.gameSpeedMult === 1;
    },
    isGameSpeedSlow() {
      return this.gameSpeedMult < 1;
    },
    formattedFastSpeed() {
      const gameSpeedMult = this.gameSpeedMult;
      return gameSpeedMult < 10000 ? gameSpeedMult.toFixed(3) : this.shortenDimensions(gameSpeedMult);
    },
    tooltip() {
      if (this.isGameSpeedNormal) return undefined;
      const displayValue = this.isGameSpeedSlow ? (1 / this.gameSpeedMult).toFixed(0) : this.formattedFastSpeed;
      return `The game is running ${displayValue}x ${this.isGameSpeedSlow ? "slower." : "faster."}`;
    },
    showCostTitle() {
      return this.cost.exponent < 1000000;
    }
  },
  methods: {
    update() {
      const isEC9Running = EternityChallenge(9).isRunning;
      this.isVisible = Tickspeed.isUnlocked || isEC9Running;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = !isEC9Running && canAfford(Tickspeed.cost);
      this.tickspeed.copyFrom(Tickspeed.current);
      this.gameSpeedMult = getGameSpeedupForDisplay();
    }
  },
  template:
  `<div class="tickspeed-container" v-show="isVisible">
      <div class="tickspeed-labels">
        <span v-tooltip="tooltip">{{ tickspeedDisplay }} <game-header-gamma-display v-if="!isGameSpeedNormal"/></span>
        <span>{{ multiplierDisplay }}</span>
      </div>
      <div class="tickspeed-buttons">
        <button
          class="storebtn tickspeed-btn"
          :class="{ 'storebtn-unavailable': !isAffordable }"
          :enabled="isAffordable"
          onclick="buyTickSpeed()"
          >Cost: {{shortenCosts(cost)}}</button>
        <button 
          class="storebtn tickspeed-max-btn"
          :class="{ 'storebtn-unavailable': !isAffordable }"
          :enabled="isAffordable"
          onclick="buyMaxTickSpeed()"
          >Buy Max</button>
      </div>
    </div>`
});