Vue.component("dark-matter-dimension-row", {
  props: {
    tier: Number
  },
  data() {
    return {
      isUnlocked: false,
      ascension: 0,
      hasAscended: false,
      powerDMPerAscension: 0,
      interval: 0,
      powerDM: new Decimal(0),
      powerDE: 0,
      intervalCost: 0,
      powerDMCost: 0,
      powerDECost: 0,
      amount: new Decimal(0),
      canBuyInterval: false,
      canBuyPowerDM: false,
      canBuyPowerDE: false,
      isIntervalCapped: false,
      timer: 0,
      timerPecent: 0,
      intervalAscensionBump: 10000,
      darkEnergyPerSecond: 0,
      portionDE: 0,
    };
  },
  computed: {
    name() {
      return `${DarkMatterDimension(this.tier).displayName} Dark Matter Dimension`;
    },
    ascensionText() {
      return `(⯅${formatInt(this.ascension)})`;
    },
    intervalClassObject() {
      return {
        "o-dark-matter-dimension-button--available": this.canBuyInterval,
        "o-dark-matter-dimension-button--ascend": this.isIntervalCapped
      };
    },
    intervalText() {
      if (this.interval > 1000) return `${format(this.interval / 1000, 2, 2)}s`;
      return `${format(this.interval, 2, 2)}ms`;
    },
    ascensionTooltip() {
      return `Multiply interval by ${formatInt(this.intervalAscensionBump)}, DM by
        ${formatInt(this.powerDMPerAscension)}, and DE by ${formatInt(POWER_DE_PER_ASCENSION)}.
        After ascension you can upgrade interval even further.`;
    }
  },
  methods: {
    update() {
      const dim = DarkMatterDimension(this.tier);
      this.isUnlocked = dim.isUnlocked;
      this.ascension = dim.ascensions;
      this.hasAscended = this.ascension > 0;
      this.powerDMPerAscension = dim.powerDMPerAscension;
      this.interval = dim.interval;
      this.powerDM.copyFrom(dim.powerDM);
      this.powerDE = dim.powerDE;
      this.intervalCost = dim.intervalCost;
      this.powerDMCost = dim.powerDMCost;
      this.powerDECost = dim.powerDECost;
      this.amount.copyFrom(dim.amount);
      this.canBuyInterval = dim.canBuyInterval;
      this.canBuyPowerDM = dim.canBuyPowerDM;
      this.canBuyPowerDE = dim.canBuyPowerDE;
      this.isIntervalCapped = dim.interval <= dim.intervalPurchaseCap;
      this.timer = dim.timeSinceLastUpdate;
      this.timerPercent = this.timer / this.interval;
      this.intervalAscensionBump = SingularityMilestone.ascensionIntervalScaling.effectValue;
      this.darkEnergyPerSecond = dim.productionPerSecond;
      this.portionDE = this.darkEnergyPerSecond / Currency.darkEnergy.productionPerSecond;
    },
    handleIntervalClick() {
      if (this.isIntervalCapped) DarkMatterDimension(this.tier).ascend();
      else DarkMatterDimension(this.tier).buyInterval();
    },
    buyPowerDM() {
      DarkMatterDimension(this.tier).buyPowerDM();
    },
    buyPowerDE() {
      DarkMatterDimension(this.tier).buyPowerDE();
    },
    // All the values are internally Decimals and technically allowed to go above Infinity. This is a special case
    // however; it looks better in-game if we just format it as Infinity instead, as the resource used for these costs
    // is itself hardcapped at e308 and we specifically want to format here (and nowhere else) as Infinity.
    formatDMCost(cost) {
      return cost.gt(Number.MAX_VALUE) ? Notations.current.infinite : format(cost, 2);
    }
  },
  template: `
    <div class="c-dark-matter-dimension-container" v-if="isUnlocked">
      <div class="o-dark-matter-dimension-amount">
        {{ name }}<span v-if="hasAscended"> {{ ascensionText }}</span>: {{ format(amount, 2) }}
      </div>
      <div class="c-dark-matter-dimension-buttons">
        <button
          @click="handleIntervalClick"
          class="o-dark-matter-dimension-button"
          :class="intervalClassObject"
        >
          {{ intervalText }}
          <span v-if="isIntervalCapped">
            <br>
            Ascend!
            <span :ach-tooltip="ascensionTooltip">
              <i class="fas fa-question-circle"></i>
            </span>
          </span>
          <span v-else>
            <br>Cost: {{ formatDMCost(intervalCost) }}
          </span>
        </button>
        <button
          @click="buyPowerDM"
          class="o-dark-matter-dimension-button"
          :class="{ 'o-dark-matter-dimension-button--available': canBuyPowerDM }"
        >
          DM {{ formatX(powerDM, 2, 2) }}<br>Cost: {{ formatDMCost(powerDMCost) }}
        </button>
        <button
          @click="buyPowerDE"
          class="o-dark-matter-dimension-button"
          :class="{ 'o-dark-matter-dimension-button--available': canBuyPowerDE }"
        >
          DE +{{ format(powerDE, 2, 4) }}
          <br>
          Cost: {{ formatDMCost(powerDECost) }}
        </button>
      </div>
      <div v-if="interval > 200">
        Tick: {{ formatInt(timer) }} ms ({{ formatPercents(timerPercent, 1) }})
      </div>
      <div v-else>
        {{ format(1000 / interval, 2, 2) }} ticks / sec
      </div>
      <div>
        Dark Energy: {{ format(darkEnergyPerSecond, 2, 4) }}/s ({{ formatPercents(portionDE, 1) }} of total)
      </div>
    </div>`
});
