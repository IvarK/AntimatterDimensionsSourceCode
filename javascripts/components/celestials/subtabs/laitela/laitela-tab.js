"use strict";

Vue.component("laitela-tab", {
  data() {
    return {
      darkMatter: new Decimal(0),
      maxDarkMatter: new Decimal(0),
      matterExtraPurchasePercentage: 0,
      autobuyersUnlocked: false,
      singularityPanelVisible: false,
      singularitiesUnlocked: false,
      singularityWaitTime: 0,
    };
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.maxDarkMatter.copyFrom(Currency.darkMatter.max);
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.autobuyersUnlocked = SingularityMilestone.darkDimensionAutobuyers.isUnlocked ||
        SingularityMilestone.darkDimensionAutobuyers.isUnlocked ||
        SingularityMilestone.autoCondense.isUnlocked ||
        Laitela.darkMatterMult > 1;
      this.singularityPanelVisible = Currency.singularities.gte(10);
      this.singularitiesUnlocked = Singularity.capIsReached || this.singularityPanelVisible;
      this.singularityWaitTime = TimeSpan.fromSeconds((Singularity.cap - player.celestials.laitela.darkEnergy) /
      Laitela.darkEnergyPerSecond).toStringShort();
    },
    maxAll() {
      Laitela.maxAllDMDimensions(4);
    },
    showLaitelaHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Lai'tela")[0];
      Modal.h2p.show();
      ui.view.h2pActive = true;
    },
  },
  template: `
    <div class="l-laitela-celestial-tab">
      <div class="c-subtab-option-container">
        <primary-button
          class="o-primary-btn--subtab-option"
          @click="showLaitelaHowTo()"
        >Click for Lai'tela info</primary-button>
        <primary-button
          class="o-primary-btn--subtab-option"
          @click="maxAll"
        >Max all Dark Matter Dimensions</primary-button>
      </div>
      <div class="o-laitela-matter-amount">You have {{ format(darkMatter.floor(), 2, 0) }} Dark Matter.</div>
      <div class="o-laitela-matter-amount">Your maximum Dark Matter ever is {{ format(maxDarkMatter.floor(), 2, 0) }},
      giving {{ formatPercents(matterExtraPurchasePercentage, 2) }} more purchases from Continuum.</div>
      <h2 class="c-laitela-singularity-container" v-if="!singularitiesUnlocked">
        Unlock singularities in {{ singularityWaitTime }}.
      </h2>
      <singularity-container v-if="singularitiesUnlocked" />
      <div class="l-laitela-mechanics-container">
        <laitela-run-button />
        <div>
          <dark-matter-dimension-group />
          <annihilation-button />
        </div>
        <singularity-milestone-pane v-if="singularityPanelVisible"/>
      </div>
      <laitela-autobuyer-settings v-if="autobuyersUnlocked" />
    </div>`
});

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
      singularitiesGained: 0,
      autoSingularityFactor: 0,
      perStepFactor: 0,
      isAutoEnabled: false,
      hasAutoSingularity: false,
    };
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
      this.baseTimeToSingularity = Currency.singularities.timeUntil;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectValue;
      this.perStepFactor = Singularity.gainPerCapIncrease;
      this.isAutoEnabled = laitela.automation.singularity && SingularityMilestone.autoCondense.isUnlocked;
      this.hasAutoSingularity = Number.isFinite(this.autoSingularityFactor);
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
  computed: {
    singularityFormText() {
      const formText = this.singularitiesGained === 1 ? "condense all Dark Energy into a Singularity"
        : `condense all Dark Energy into ${format(this.singularitiesGained, 2, 0)} Singularities`;
      if (this.canPerformSingularity) {
        // Capitalize the string
        return `${formText.capitalize()}`;
      }
      return `Reach ${format(this.singularityCap)} Dark Energy to ${formText}`;
    },
    singularityWaitText() {
      let singularityTime = (this.singularityCap - this.darkEnergy) / this.darkEnergyGainPerSecond;
      if (this.canPerformSingularity) {
        singularityTime += this.singularityCap * (this.autoSingularityFactor - 1) / this.darkEnergyGainPerSecond;
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
      return TimeSpan.fromSeconds(this.baseTimeToSingularity * (this.autoSingularityFactor - 1))
        .toStringShort();
    },
    manualSingularityRate() {
      const totalTime = this.singularityCap / this.darkEnergyGainPerSecond;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    autoSingularityRate() {
      const totalTime = this.singularityCap / this.darkEnergyGainPerSecond * this.autoSingularityFactor;
      return this.formatRate(this.singularitiesGained / totalTime);
    }
  },
  template: `
    <div class="c-laitela-singularity-container">
      <div>
        <h2>
          You have {{ format(singularities, 2, 0) }} {{ "Singularity" | pluralize(singularities, "Singularities")}}
        </h2>
        <button
          class="c-laitela-singularity"
          :class="{ 'c-laitela-singularity--active' : canPerformSingularity }"
          @click="doSingularity">
          <h2>{{ singularityFormText }}</h2>
          <br v-if="singularityWaitText !== ''">
          <h2>{{ singularityWaitText }}</h2>
        </button>
      </div>
      <div v-if="singularities !== 0">
        <div class="o-laitela-matter-amount">
          You have {{ format(darkEnergy, 2, 4) }} Dark Energy. (+{{ format(darkEnergyGainPerSecond, 2, 4) }}/s)
        </div>
        <div v-if="unlockedBulkSingularity">
          <button class="c-laitela-singularity__cap-control" @click="decreaseCap">
            Decrease Singularity cap.
          </button>
          <button class="c-laitela-singularity__cap-control" @click="increaseCap">
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

Vue.component("laitela-run-button", {
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
    };
  },
  methods: {
    update() {
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
    },
    startRun() {
      if (!resetReality()) return;
      Laitela.initializeRun();
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
      };
    },
  },
  computed: {
    completionTime() {
      return TimeSpan.fromSeconds(this.realityTime).toStringShort();
    }
  },
  template: `
    <button :class="classObject()">
      <b>Start Lai'tela's Reality</b>
      <div :class="runButtonClassObject()" @click="startRun"></div>
      <div v-if="realityReward > 1">
        <b>All DM multipliers are {{ formatX(realityReward, 2, 2) }} higher</b>
        <br>
        <br>
        Fastest Completion: {{ completionTime }}
        <br>
        <br>
        <span v-if="maxDimTier <= 7">
          Highest active dimension: {{ formatInt(maxDimTier) }}
        </span>
        <br>
        <br>
      </div>
      Infinity Point and Eternity Point gain are Dilated. Game speed is reduced to {{ formatInt(1) }}
      and gradually comes back over {{ formatInt(10) }} minutes, and Black Hole discharging and pulsing
      is disabled.
      <br>
      <br>
      Antimatter generates entropy inside of this Reality. At {{ formatPercents(1) }} entropy, the Reality
      becomes destabilized and you gain a reward based on how quickly you reached {{ formatPercents(1) }}.
      If you can destabilize in less than {{ formatInt(30) }} seconds, the Reality becomes more difficult
      but also gives a stronger reward.
    </button>`
});

Vue.component("dark-matter-dimension-group", {
  data() {
    return {
      activeDimensions: [],
      nextDimensionThreshold: 0,
    };
  },
  methods: {
    update() {
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.nextDimensionThreshold = Array.range(0, 4)
        .filter(i => MatterDimension(i + 1).amount.eq(0))
        .map(i => MatterDimension(i + 1).adjustedStartingCost)
        .min();
    },
  },
  computed: {
    dimensions: () => MatterDimensionState.list,
  },
  template: `
    <span>
      <matter-dimension-row
        v-for="i in activeDimensions"
        :key="i"
        :dimension="dimensions[i]"
        />
      <div v-if="nextDimensionThreshold !== 0">
        <b>Next Dark Matter Dimension unlocks at {{ format(nextDimensionThreshold) }} Dark Matter.</b>
        <br><br>
      </div>
    </span>`
});

Vue.component("annihilation-button", {
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      hasAnnihilated: false,
      showAnnihilation: false,
      matterRequirement: 0,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.celestials.laitela.autoAnnihilationSetting,
      isEnabled: true,
      isMouseoverDisabled: false
    };
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.darkMatterMult = Laitela.darkMatterMult;
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.hasAnnihilated = Laitela.darkMatterMult > 1;
      this.showAnnihilation = this.hasAnnihilated || !MatterDimensionState.list.some(d => d.amount.eq(0));
      this.matterRequirement = Laitela.annihilationDMRequirement;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
      this.isEnabled = player.celestials.laitela.automation.annihilation;
    },
    annihilate() {
      if (this.isMouseoverDisabled) return;
      Laitela.annihilate();
    },
    handleAutoAnnihilationInputChange() {
      const float = parseFloat(this.autoAnnihilationInput);
      if (isNaN(float)) {
        this.autoAnnihilationInput = player.celestials.laitela.autoAnnihilationSetting;
      } else {
        player.celestials.laitela.autoAnnihilationSetting = float;
      }
    }
  },
  computed: {
    annihilationInputStyle() {
      return {
        width: "6rem",
        "background-color": this.isEnabled ? "" : "var(--color-disabled)",
      };
    }
  },
  template: `
    <button class="c-laitela-annihilation-button"
      @click="annihilate()"
      v-if="showAnnihilation">
        <h2>Annihilation</h2>
        <span v-if="hasAnnihilated">
          Current multiplier to all DM multipliers: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
          <br><br>
        </span>
        <span>Resets your Dark Matter, Dark Matter Dimensions, and Dark Energy,</span>
        <span v-if="!hasAnnihilated">
          unlocking Auto-Annihilation, and
        </span>
        <span v-if="hasAnnihilated && darkMatter.gte(matterRequirement)">
          but adds <b>{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
          (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
        </span>
        <span v-else-if="hasAnnihilated">
          adding to your current Annihilation multiplier (requires {{ format(matterRequirement) }} Dark Matter).
        </span>
        <span v-else-if="darkMatter.gte(matterRequirement)">
          multiplying DM multipliers by <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b>.
        </span>
        <span v-else>
          giving a multiplier to all DM multipliers (requires {{ format(matterRequirement) }} Dark Matter).
        </span>
        <div v-if="hasAnnihilated">
          <br>
          Auto-Annihilate when adding
          <input type="text"
            v-model="autoAnnihilationInput"
            @change="handleAutoAnnihilationInputChange()"
            @mouseover="isMouseoverDisabled = true"
            @mouseleave="isMouseoverDisabled = false"
            :style="annihilationInputStyle"/>
          to the multiplier.
        </div>
    </button>`
});

Vue.component("singularity-milestone-pane", {
  data() {
    return {
      milestones: [],
      hasNew: false,
    };
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.nextMilestoneGroup;
      this.hasNew = SingularityMilestones.unseenMilestones.length !== 0;
    },
  },
  computed: {
    glowStyle() {
      if (this.hasNew) return { "box-shadow": "inset 0 0 1rem 0.5rem var(--color-celestials)" };
      return {};
    }
  },
  template: `
    <div class="c-laitela-next-milestones">
      <div class="o-laitela-singularity-modal-button"
        onclick="Modal.singularityMilestones.show()"
        :style="glowStyle">
          Show all milestones
      </div>
      <singularity-milestone
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :suppressGlow="true"/>
    </div>`
});

Vue.component("laitela-autobuyer-settings", {
  data() {
    return {
      hasDimension: false,
      hasAscension: false,
      hasSingularity: false,
      hasAnnihilated: false,
      dimension: false,
      ascension: false,
      singularity: false,
      annihilation: false,
    };
  },
  methods: {
    update() {
      this.hasDimension = SingularityMilestone.darkDimensionAutobuyers.isUnlocked;
      this.hasAscension = SingularityMilestone.darkDimensionAutobuyers.isUnlocked;
      this.hasSingularity = SingularityMilestone.autoCondense.isUnlocked;
      this.hasAnnihilated = Laitela.darkMatterMult > 1;
      const auto = player.celestials.laitela.automation;
      this.dimension = auto.dimensions;
      this.ascension = auto.ascension;
      this.singularity = auto.singularity;
      this.annihilation = auto.annihilation;
    },
  },
  watch: {
    dimension(newValue) {
      player.celestials.laitela.automation.dimensions = newValue;
    },
    ascension(newValue) {
      player.celestials.laitela.automation.ascension = newValue;
    },
    singularity(newValue) {
      player.celestials.laitela.automation.singularity = newValue;
    },
    annihilation(newValue) {
      player.celestials.laitela.automation.annihilation = newValue;
    },
  },
  template: `
    <div class="c-laitela-singularity-container">
      <primary-button-on-off
        v-if="hasDimension"
        v-model="dimension"
        class="c-laitela-automation-toggle"
        text="Auto-buy DM Dimensions:" />
      <primary-button-on-off
        v-if="hasAscension"
        v-model="ascension"
        class="c-laitela-automation-toggle"
        text="Auto-Ascend:" />
      <primary-button-on-off
        v-if="hasSingularity"
        v-model="singularity"
        class="c-laitela-automation-toggle"
        text="Auto-Singularity:" />
      <primary-button-on-off
        v-if="hasAnnihilated"
        v-model="annihilation"
        class="c-laitela-automation-toggle"
        text="Auto-Annihilation:" />
    </div>`
});
