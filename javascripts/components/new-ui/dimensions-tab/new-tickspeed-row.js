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
        return `${formatX(tickmult.reciprocal(), 2, 0)} faster / upgrade.`;
      }
      const asNumber = tickmult.toNumber();
      let places = asNumber >= 0.2 ? 0 : Math.floor(Math.log10(Math.round(1 / asNumber)));
      if (player.galaxies === 1) places = Math.max(places, 1);
      return `-${((1 - asNumber) * 100).toFixed(places)}% / upgrade`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(Decimal.divide(1000, this.tickspeed), 2, 3)} / sec`;
    },
    isGameSpeedNormal() {
      return this.gameSpeedMult === 1;
    },
    isGameSpeedSlow() {
      return this.gameSpeedMult < 1;
    },
    formattedFastSpeed() {
      const gameSpeedMult = this.gameSpeedMult;
      return gameSpeedMult < 10000 ? format(gameSpeedMult, 3, 3) : format(gameSpeedMult, 2, 0);
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
          class="o-primary-btn tickspeed-btn"
          :class="{ 'o-primary-btn--disabled': !isAffordable }"
          :enabled="isAffordable"
          onclick="buyTickSpeed()"
          >Cost: {{format(cost, 0, 0)}}</button>
        <button
          class="o-primary-btn tickspeed-max-btn"
          :class="{ 'o-primary-btn--disabled': !isAffordable }"
          :enabled="isAffordable"
          onclick="buyMaxTickSpeed()"
          >Buy Max</button>
      </div>
    </div>`
});
