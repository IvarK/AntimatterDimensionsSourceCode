"use strict";

Vue.component("game-header-tickspeed-row", {
  data() {
    return {
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: 1,
      galaxyCount: 0,
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
      if (InfinityChallenge(3).isRunning) return `Multiply all Normal Dimensions by
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      const tickmult = this.mult;
      if (tickmult.lte(1e-9)) return `Divide the tick interval by ${this.shorten(tickmult.reciprocal(), 2, 0)}.`;

      const asNumber = tickmult.toNumber();
      let places = asNumber >= 0.2 ? 0 : Math.floor(Math.log10(Math.round(1 / asNumber)));
      if (this.galaxyCount === 1) places = Math.max(places, 1);
      return `Reduce the tick interval by ${formatPercents(1 - asNumber, places)}.`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${shorten(Decimal.divide(1000, this.tickspeed), 2, 3)} / sec`;
    },
    isGameSpeedNormal() {
      return this.gameSpeedMult === 1;
    },
    isGameSpeedSlow() {
      return this.gameSpeedMult < 1;
    },
    formattedFastSpeed() {
      const gameSpeedMult = this.gameSpeedMult;
      return gameSpeedMult < 10000 ? gameSpeedMult.toFixed(3) : format(gameSpeedMult, 2, 0);
    },
    tooltip() {
      if (this.isGameSpeedNormal) return undefined;
      const displayValue = this.isGameSpeedSlow ? shorten(1 / this.gameSpeedMult, 2, 3) : this.formattedFastSpeed;
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
      this.galaxyCount = player.galaxies;
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
        ><span v-if="showCostTitle">Cost: </span>{{format(cost, 0, 0)}}</primary-button>
        <primary-button
          :enabled="isAffordable"
          class="o-primary-btn--buy-max"
          onclick="buyMaxTickSpeed()"
        >Buy Max</primary-button>
      </div>
      <div v-tooltip="tooltip">{{tickspeedDisplay}} <game-header-gamma-display v-if="!isGameSpeedNormal"/></div>
    </div>`
});
