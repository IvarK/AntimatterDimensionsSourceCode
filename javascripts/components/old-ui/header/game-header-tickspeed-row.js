import "./game-header-gamespeed-display.js";

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
      isContinuumActive: false,
      continuumValue: 0
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
      if (InfinityChallenge(3).isRunning) return `Multiply all Antimatter Dimensions by
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      const tickmult = this.mult;
      return `${formatX(tickmult.reciprocal(), 2, 3)} faster / upgrade.`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
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
    showCostTitle() {
      return this.cost.exponent < 1000000;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
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
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.gameSpeedMult = getGameSpeedupForDisplay();
      this.galaxyCount = player.galaxies;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = Tickspeed.continuumValue;
    }
  },
  template: `
    <div :class="classObject">
      <div>{{ multiplierDisplay }}</div>
      <div>
        <primary-button
          :enabled="isAffordable"
          class="o-primary-btn--tickspeed"
          :style="{ width: isContinuumActive ? '25rem' : ''}"
          onclick="buyTickSpeed()"
        >
          <span v-if="isContinuumActive">Continuum: {{ continuumString }}</span>
          <span v-else-if="showCostTitle">Cost: {{ format(cost) }}</span>
          <span v-else>{{ format(cost) }}<br></span>
        </primary-button>
        <primary-button
          v-if="!isContinuumActive"
          :enabled="isAffordable"
          class="o-primary-btn--buy-max"
          onclick="buyMaxTickSpeed()"
        >
          Buy Max
        </primary-button>
      </div>
      <div>
        {{ tickspeedDisplay }}
        <game-header-gamespeed-display v-if="!isGameSpeedNormal" />
      </div>
    </div>`
});
