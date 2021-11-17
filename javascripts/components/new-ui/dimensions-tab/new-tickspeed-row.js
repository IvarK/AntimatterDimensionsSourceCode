import "../../old-ui/header/game-header-gamespeed-display.js";

Vue.component("new-tickspeed-row", {
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
        "l-tickspeed-container": true,
        "l-tickspeed-container--hidden": !this.isVisible
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
      <div class="tickspeed-labels">
        <span>{{ tickspeedDisplay }} <game-header-gamespeed-display v-if="!isGameSpeedNormal" /></span>
        <span>{{ multiplierDisplay }}</span>
      </div>
      <div class="tickspeed-buttons">
        <button
          class="o-primary-btn tickspeed-btn"
          :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
          :enabled="isAffordable"
          onclick="buyTickSpeed()"
        >
          <span v-if="isContinuumActive">
            {{ continuumString }} (cont.)
          </span>
          <span v-else>
            Cost: {{ format(cost) }}
          </span>
        </button>
        <button
          v-if="!isContinuumActive"
          class="o-primary-btn tickspeed-max-btn"
          :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
          :enabled="isAffordable"
          onclick="buyMaxTickSpeed()"
        >
          Buy Max
        </button>
      </div>
    </div>`
});
