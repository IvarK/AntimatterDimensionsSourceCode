import "./singularity-pane.js";
import "./milestone-pane.js";
import "./laitela-center-pane.js";
import "./laitela-autobuyer-pane.js";
import "./singularity-milestone.js";
import "../../celestial-quote-history.js";

Vue.component("laitela-tab", {
  data() {
    return {
      darkMatter: new Decimal(0),
      isDMCapped: false,
      maxDarkMatter: new Decimal(0),
      darkEnergy: 0,
      matterExtraPurchasePercentage: 0,
      autobuyersUnlocked: false,
      singularityPanelVisible: false,
      singularitiesUnlocked: false,
      singularityCap: 0,
      singularityWaitTime: 0,
    };
  },
  computed: {
    styleObject() {
      return {
        color: this.isDMCapped ? "var(--color-bad)" : "",
      };
    },
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.isDMCapped = this.darkMatter.eq(Number.MAX_VALUE);
      this.maxDarkMatter.copyFrom(Currency.darkMatter.max);
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.autobuyersUnlocked = SingularityMilestone.darkDimensionAutobuyers.isUnlocked ||
        SingularityMilestone.darkDimensionAutobuyers.isUnlocked ||
        SingularityMilestone.autoCondense.isUnlocked ||
        Laitela.darkMatterMult > 1;
      this.singularityPanelVisible = Currency.singularities.gt(0);
      this.singularitiesUnlocked = Singularity.capIsReached || this.singularityPanelVisible;
      this.singularityCap = Singularity.cap;
      this.singularityWaitTime = TimeSpan.fromSeconds((this.singularityCap - this.darkEnergy) /
        Laitela.darkEnergyPerSecond).toStringShort();
    },
    maxAll() {
      Laitela.maxAllDMDimensions(4);
    },
    showLaitelaHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Lai'tela")[0];
      Modal.h2p.show();
    },
  },
  template: `
    <div class="l-laitela-celestial-tab">
      <div class="c-subtab-option-container">
        <primary-button
          class="o-primary-btn--subtab-option"
          @click="showLaitelaHowTo()"
        >
          Click for Lai'tela info
        </primary-button>
        <primary-button
          class="o-primary-btn--subtab-option"
          @click="maxAll"
        >
          Max all Dark Matter Dimensions
        </primary-button>
      </div>
      <celestial-quote-history celestial="laitela" />
      <div class="o-laitela-matter-amount">
        You have
        <span :style="styleObject">{{ format(darkMatter, 2) }}</span>
        Dark Matter<span v-if="isDMCapped"> (capped)</span>.
      </div>
      <div class="o-laitela-matter-amount">
        Your maximum Dark Matter ever is
        <span :style="styleObject">{{ format(maxDarkMatter, 2) }}</span>,
        giving {{ formatPercents(matterExtraPurchasePercentage, 2) }} more purchases from Continuum.
      </div>
      <h2 class="c-laitela-singularity-container" v-if="!singularitiesUnlocked">
        Unlock singularities in {{ singularityWaitTime }}.
        ({{ format(darkEnergy, 2, 2) }}/{{ format(singularityCap, 2) }} Dark Energy)
      </h2>
      <singularity-container v-if="singularitiesUnlocked" />
      <div class="l-laitela-mechanics-container">
        <laitela-run-button />
        <div>
          <dark-matter-dimension-group />
          <annihilation-button />
        </div>
        <singularity-milestone-pane v-if="singularityPanelVisible" />
      </div>
      <laitela-autobuyer-settings v-if="autobuyersUnlocked" />
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
  computed: {
    completionTime() {
      return TimeSpan.fromSeconds(this.realityTime).toStringShort();
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description().split("\n");
    }
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
      Modal.celestials.show({ name: "Lai'tela's", number: 5 });
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
  template: `
    <button :class="classObject()">
      <b>Start Lai'tela's Reality</b>
      <div :class="runButtonClassObject()" @click="startRun"></div>
      <div v-if="realityReward > 1">
        <b>
          All Dark Matter multipliers are {{ formatX(realityReward, 2, 2) }} higher.
        </b>
        <span v-if="maxDimTier > 0">
          <br><br>
          Fastest Completion: {{ completionTime }}
          <br><br>
          <span v-if="maxDimTier <= 7">
            Highest active dimension: {{ formatInt(maxDimTier) }}
          </span>
        </span>
        <span v-else>
          <br>
          <b>
            You also gain an additional {{ formatX(8) }} Dark Energy.
          </b>
          <br><br>
          Lai'tela's Reality has been fully destabilized and cannot have its reward further improved.
        </span>
        <br><br>
      </div>
      <div v-for="line in runDescription">
        {{ line }} <br>
      </div>
    </button>`
});
