Vue.component("singularity-container", {
  data() {
    return {
      darkEnergy: 0,
      darkEnergyGainPerSecond: 0,
      singularities: 0,
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      unlockedBulkSingularity: false,
      singularityCap: 0,
      baseTimeToSingularity: 0,
      currentTimeToSingularity: 0,
      extraTimeAfterSingularity: 0,
      singularitiesGained: 0,
      autoSingularityFactor: 0,
      perStepFactor: 0,
      isAutoEnabled: false,
      hasAutoSingularity: false,
      nextLowerStep: 0,
      willCondenseOnDecrease: false,
    };
  },
  computed: {
    singularityFormText() {
      const formText = this.singularitiesGained === 1 ? "condense all Dark Energy into a Singularity"
        : `condense all Dark Energy into ${quantify("Singularity", this.singularitiesGained, 2)}`;
      if (this.canPerformSingularity) {
        // Capitalize the string
        return `${formText.capitalize()}`;
      }
      return `Reach ${format(this.singularityCap)} Dark Energy to ${formText}`;
    },
    singularityWaitText() {
      let singularityTime = this.currentTimeToSingularity;
      if (this.canPerformSingularity) {
        singularityTime += this.extraTimeAfterSingularity;
        return this.isAutoEnabled
          ? `(auto-condensing in ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`
          : "";
      }
      return `(enough Dark Energy in ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`;
    },
    baseSingularityTime() {
      return TimeSpan.fromSeconds(this.baseTimeToSingularity).toStringShort();
    },
    additionalSingularityTime() {
      return TimeSpan.fromSeconds(this.extraTimeAfterSingularity).toStringShort();
    },
    manualSingularityRate() {
      const totalTime = this.baseTimeToSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    autoSingularityRate() {
      const totalTime = this.baseTimeToSingularity + this.extraTimeAfterSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    decreaseTooltip() {
      if (this.singularityCapIncreases === 0) return "You cannot decrease the cap any further!";
      const singularities = this.singularitiesGained / this.perStepFactor;
      return this.willCondenseOnDecrease
        ? `Decreasing the cap will immediately auto-condense for
          ${quantify("Singularity", singularities, 2)}!`
        : null;
    },
    increaseTooltip() {
      return this.singularityCapIncreases >= 50
        ? "You cannot increase the cap any further!"
        : null;
    }
  },
  methods: {
    update() {
      const laitela = player.celestials.laitela;
      this.darkEnergy = Currency.darkEnergy.value;
      this.darkEnergyGainPerSecond = Currency.darkEnergy.productionPerSecond;
      this.singularities = Currency.singularities.value;
      this.singularityCapIncreases = laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.unlockedBulkSingularity = Currency.singularities.gte(10);
      this.singularityCap = Singularity.cap;
      this.baseTimeToSingularity = Singularity.timePerCondense;
      this.currentTimeToSingularity = Singularity.timeUntilCap;
      this.extraTimeAfterSingularity = Singularity.timeDelayFromAuto;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectValue;
      this.perStepFactor = Singularity.gainPerCapIncrease;
      this.isAutoEnabled = laitela.automation.singularity && SingularityMilestone.autoCondense.isUnlocked;
      this.hasAutoSingularity = Number.isFinite(this.autoSingularityFactor);
      this.nextLowerStep = this.singularityCap * this.autoSingularityFactor / 10;
      this.willCondenseOnDecrease = this.isAutoEnabled && this.darkEnergy > this.nextLowerStep;
    },
    doSingularity() {
      Singularity.perform();
    },
    increaseCap() {
      Singularity.increaseCap();
    },
    decreaseCap() {
      Singularity.decreaseCap();
    },
    formatRate(rate) {
      if (rate < 1 / 60) return `${format(3600 * rate, 2, 3)} per hour`;
      if (rate < 1) return `${format(60 * rate, 2, 3)} per minute`;
      return `${format(rate, 2, 3)} per second`;
    }
  },
  template: `
    <div class="c-laitela-singularity-container">
      <div>
        <h2>
          You have {{ quantify("Singularity", singularities, 2, 0) }}
        </h2>
        <button
          class="c-laitela-singularity"
          :class="{ 'c-laitela-singularity--active' : canPerformSingularity }"
          @click="doSingularity"
        >
          <h2>
            {{ singularityFormText }}
          </h2>
          <br v-if="singularityWaitText !== ''">
          <h2>
            {{ singularityWaitText }}
          </h2>
        </button>
      </div>
      <div v-if="singularities !== 0">
        <div class="o-laitela-matter-amount">
          You have {{ format(darkEnergy, 2, 4) }} Dark Energy. (+{{ format(darkEnergyGainPerSecond, 2, 4) }}/s)
        </div>
        <div v-if="unlockedBulkSingularity">
          <button
            class="c-laitela-singularity__cap-control"
            @click="decreaseCap"
            :ach-tooltip="decreaseTooltip"
          >
            Decrease Singularity cap.
          </button>
          <button
            class="c-laitela-singularity__cap-control"
            @click="increaseCap"
            :ach-tooltip="increaseTooltip"
          >
            Increase Singularity cap.
          </button>
          <br>
          Each step increases the required Dark Energy by {{ formatX(10) }},
          <br>
          but also increases gained Singularities by {{ formatX(perStepFactor) }}.
        </div>
        <div v-else>
          <br>
          Reach {{ format(10) }} Singularities
          <br>
          to unlock Bulk Singularities.
          <br>
        </div>
        <br>
        Total time to <span v-if="hasAutoSingularity">(auto-)</span>condense:
        {{ baseSingularityTime }}
        <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
          (+{{ additionalSingularityTime }})
        </span>
        <br>
        <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">Manual </span>
        Singularity gain rate: {{ manualSingularityRate }}
        <br>
        <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
          Automatic Singularity gain rate: {{ autoSingularityRate }}
        </span>
      </div>
    </div>`
});
