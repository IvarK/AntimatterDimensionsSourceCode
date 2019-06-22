"use strict";

Vue.component("game-header-tickspeed-row", {
  data: function() {
    return {
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: 1,
      gammaText: ""
    };
  },
  computed: {
    classObject: function() {
      return {
        "c-game-header__tickspeed-row": true,
        "c-game-header__tickspeed-row--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      const tickmult = this.mult;
      if (tickmult.lte(1e-9)) {
        return `Divide the tick interval by ${this.shortenDimensions(tickmult.reciprocal())}.`;
      } else {
        const asNumber = tickmult.toNumber();
        let places = asNumber >= 0.2 ? 0 : Math.floor(Math.log10(Math.round(1 / asNumber)));
        if (player.galaxies === 1) places = Math.max(places, 1);
        return `Reduce the tick interval by ${((1 - asNumber) * 100).toFixed(places)}%.`;
      }
    },
    tickspeedDisplay: function() {
      const tickspeed = this.tickspeed;
      let displayValue;
      if (tickspeed.exponent > 1) {
        displayValue = tickspeed.toFixed(0);
      }
      else {
        const oom = Decimal.divide(100, Decimal.pow10(tickspeed.exponent));
        displayValue = `${tickspeed.times(oom).toFixed(0)} / ${shortenRateOfChange(oom)}`;
      }
      return `Tickspeed: ${displayValue}`;
    },
    isGameSpeedNormal: function() {
      return this.gameSpeedMult === 1;
    },
    isGameSpeedSlow: function() {
      return this.gameSpeedMult < 1;
    },
    formattedFastSpeed: function() {
      const gameSpeedMult = this.gameSpeedMult;
      return gameSpeedMult < 10000 ? gameSpeedMult.toFixed(3) : this.shortenDimensions(gameSpeedMult);
    },
    gammaDisplay: function() {
      return this.gammaText;
    },
    tooltip: function() {
      if (this.isGameSpeedNormal) return undefined;
      const displayValue = this.isGameSpeedSlow ? (1 / this.gameSpeedMult).toFixed(0) : this.formattedFastSpeed;
      return `The game is running ${displayValue}x ${this.isGameSpeedSlow ? "slower." : "faster."}`;
    },
    showCostTitle: function() {
      return this.cost.exponent < 1000000;
    }
  },
  methods: {
    update() {
      const isEC9Running = EternityChallenge(9).isRunning;
      this.isVisible = Tickspeed.isUnlocked || isEC9Running;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(player.tickSpeedCost);
      this.isAffordable = !isEC9Running && canAfford(player.tickSpeedCost);
      this.tickspeed.copyFrom(Tickspeed.current);
      this.gameSpeedMult = getGameSpeedupFactor();
      this.gammaText = getGameSpeedupText();
    }
  },
  template:
    `<div :class="classObject">
      <div>{{multiplierDisplay}}</div>
      <div>
        <primary-button
          :enabled="isAffordable"
          class="o-primary-btn--tickspeed"
          onclick="buyTickSpeed()"
        ><span v-if="showCostTitle">Cost: </span>{{shortenCosts(cost)}}</primary-button>
        <primary-button
          :enabled="isAffordable"
          class="o-primary-btn--buy-max"
          onclick="buyMaxTickSpeed()"
        >Buy Max</primary-button>
      </div>
      <div v-tooltip="tooltip">{{tickspeedDisplay}} <span v-if="!isGameSpeedNormal">{{gammaDisplay}}</span></div>
    </div>`
});