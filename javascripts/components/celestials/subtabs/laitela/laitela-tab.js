"use strict";

Vue.component("laitela-tab", {
  data() {
    return {
      matter: new Decimal(0),
      maxMatter: new Decimal(0),
      nextUnlock: "",
      matterExtraPurchasePercentage: 0,
      maxDimTier: 0,
      activeDimensions: [],
      showReset: false,
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      darkEnergy: 0,
      annihilated: false,
      isRunning: 0,
      realityReward: 1,
      milestoneIds: [],
      singularities: 0,
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      singularityCap: 0,
      singularitiesGained: 0,
      autoCapInput: player.celestials.laitela.singularityAutoCapLimit,
      autoCapUnlocked: false,
      autoAnnihilationUnlocked: false,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.celestials.laitela.autoAnnihilationSetting
    };
  },
  methods: {
    update() {
      this.matter.copyFrom(player.celestials.laitela.matter);
      this.maxMatter.copyFrom(player.celestials.laitela.maxMatter);
      this.nextUnlock = Laitela.nextMatterDimensionThreshold;
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.darkMatterMult = Laitela.darkMatterMult;
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.annihilated = player.celestials.laitela.annihilated;
      this.showReset = this.annihilated || this.darkMatterMultGain >= 1;
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.isRunning = Laitela.isRunning;
      this.realityReward = Laitela.realityReward;
      this.milestoneIds = SingularityMilestones.nextFive.map(m => m.id);
      this.singularities = player.celestials.laitela.singularities;
      this.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.singularityCap = Singularity.cap;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoCapUnlocked = SingularityMilestone(10).isUnlocked;
      this.autoAnnihilationUnlocked = SingularityMilestone(9).isUnlocked;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
    },
    startRun() {
      resetReality();
      Laitela.initializeRun();
    },
    buyUnlock(info) {
      Laitela.buyUnlock(info);
    },
    hasUnlock(info) {
      return Laitela.has(info);
    },
    canBuyUnlock(info) {
      return Laitela.canBuyUnlock(info);
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
      };
    },
    unlockClassObject(upgrade) {
      return {
        "o-laitela-shop-button--bought": upgrade.isBought,
        "o-laitela-shop-button--available": upgrade.canBeBought
      };
    },
    annihilate() {
      Laitela.annihilate();
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
    // Greedily buys the cheapest available upgrade until none are affordable
    maxAll() {
      let cheapestPrice = new Decimal(0);
      const unlockedDimensions = MatterDimensionState.list.filter(d => d.amount.gt(0));
      while (player.celestials.laitela.matter.gte(cheapestPrice)) {
        const sortedUpgradeInfo = unlockedDimensions
          .map(d => [
            [d.intervalCost, d.canBuyInterval, "interval", d._tier],
            [d.powerDMCost, d.canBuyPowerDM, "powerDM", d._tier],
            [d.powerDECost, d.canBuyPowerDE, "powerDE", d._tier]])
          .flat(1)
          .filter(a => a[1])
          .sort((a, b) => a[0].div(b[0]).log10())
          .map(d => [d[0], d[2], d[3]]);
        const cheapestUpgrade = sortedUpgradeInfo[0];
        if (cheapestUpgrade === undefined) break;
        cheapestPrice = cheapestUpgrade[0];
        switch (cheapestUpgrade[1]) {
          case "interval":
            MatterDimensionState.list[cheapestUpgrade[2]].buyInterval();
            break;
          case "powerDM":
            MatterDimensionState.list[cheapestUpgrade[2]].buyPowerDM();
            break;
          case "powerDE":
            MatterDimensionState.list[cheapestUpgrade[2]].buyPowerDE();
            break;
        }
      }
    },
    showLaitelaHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Lai'tela")[0];
      Modal.h2p.show();
      ui.view.h2pActive = true;
    },
    handleAutoCapInputChange() {
      const float = parseFloat(this.autoCapInput);
      if (isNaN(float)) {
        this.autoCapInput = player.celestials.laitela.singularityAutoCapLimit;
      } else {
        player.celestials.laitela.singularityAutoCapLimit = float;
      }
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
    dimensions: () => MatterDimensionState.list,
    runUnlockThresholds: () => laitelaRunUnlockThresholds,
    nextMilestones() {
      return this.milestoneIds.map(id => SingularityMilestone(id));
    },
    singularityText() {
      if (this.singularitiesGained === 1) {
        return "Form a Singularity";
      }

      if (!this.canPerformSingularity) {
        return `Reach ${format(this.singularityCap)} Dark Energy to \
          Form ${format(this.singularitiesGained, 2, 0)} Singularities`;
      }

      return `Form ${format(this.singularitiesGained, 2, 0)} Singularities`;
    }
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <button @click="showLaitelaHowTo()" class="o-primary-btn">Click for Lai'tela info</button>
      <div class="o-laitela-matter-amount">You have {{ format(matter.floor(), 2, 0) }} Dark Matter.</div>
      <div class="o-laitela-matter-amount">Your maximum Dark Matter ever is {{ format(maxMatter.floor(), 2, 0) }},
      giving {{ formatPercents(matterExtraPurchasePercentage, 2) }} more purchases from continuum.</div>
      <div>
        <div class="o-laitela-matter-amount">You have {{ format(darkEnergy, 2, 4) }} Dark Energy.</div>
      </div>
      <div v-if="annihilated">
        You have a {{ format(darkMatterMult, 2, 2) }}x multiplier to Dark Matter production from prestige.
      </div>
      <primary-button
        class="o-primary-btn--buy-max l-time-dim-tab__buy-max"
        @click="maxAll"
      >Max all (DM)</primary-button>
      <div class="l-laitela-singularity-container">
        <div class="l-laitela-singularity-container--left">
          <h2>
            You have {{ format(singularities, 2, 0) }} 
            {{ "Singularity" | pluralize(singularities, "Singularities")}}
          </h2>
          <button class="c-laitela-singularity" @click="doSingularity">
            <h2>{{ singularityText }}</h2>
          </button>
        </div>
        <div class="l-laitela-singularity-container--right">
          <button class="c-laitela-singularity__cap-control" @click="increaseCap">
            Increase singularity cap.
          </button>
          <button class="c-laitela-singularity__cap-control" @click="decreaseCap">
            Decrease singularity cap.
          </button>
          <div v-if="autoCapUnlocked">
            <input type="text" v-model="autoCapInput" @change="handleAutoCapInputChange()"/><br>
            <label>Seconds to reach Singularity, after cap is raised automatically</label>
          </div>
        </div>
      </div>
      <div class="l-laitela-mechanics-container">
        <button class="o-laitela-run-button" @click="startRun">
          <b>Start Lai'tela's Reality</b>
          <div v-bind:class="runButtonClassObject()"></div>
          <div v-if="realityReward > 1">
            <b>All DM multipliers are {{ formatX(realityReward, 2, 2) }} higher</b>
            <br>
            <br>
          </div>
          IP and EP gain are dilated. Game speed is reduced to 1 and gradually comes back over 10 minutes,
          Black Hole discharging and pulsing are disabled.
          <br>
          <br>
          Antimatter generates entropy inside of this Reality. At 100% entropy, the Reality becomes destabilized and
          you gain a reward based on how quickly you reached 100%. If you can destabilize in less than 30 seconds,
          the Reality becomes more difficult but also gives a stronger reward.
          <div v-if="maxDimTier === 7">
            <br>
            <b>Additional limitation:</b>
            <br>
            Production is disabled for all 8th dimensions.
          </div>
          <div v-else-if="maxDimTier < 7">
            <br>
            <b>Additional limitation:</b>
            <br>
            Production is disabled for all dimensions {{ maxDimTier + 1 }} or higher.
          </div>
        </button>
        <div>
          <matter-dimension-row
            v-for="i in activeDimensions"
            :key="i"
            :dimension="dimensions[i]"
            />
          <div>{{ nextUnlock }}</div>
        </div>
        <div class="c-laitela-next-milestones">
          <singularity-milestone v-for="milestone in nextMilestones" :key="milestone.id" :milestone="milestone"/>
          <div class="o-laitela-singularity-modal-button" onclick="Modal.singularityMilestones.show()">
            Show all milestones
          </div>
        </div>
      </div>
      <button class="c-laitela-annihilation-button" @click="annihilate()" :style="{ visibility: showReset ? 'visible' : 'hidden' }">
        <h2>Annihilation</h2>
        <p v-if="annihilated">
          Resets your Dark Matter, Dark Matter Dimensions, and Dark Energy, 
          but multiply the Dark Matter multiplier from prestige by
          <b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> 
        </p>
        <p v-else-if="darkMatterMultGain >= 1">
          Resets your Dark Matter, Dark Matter Dimensions, and Dark Energy, but add
          <b>{{ format(darkMatterMultGain, 2, 2) }}</b> 
          to the Dark Matter multiplier from prestige.
        </p>
        <p v-else>
          Resets your Dark Matter, Dark Matter Dimensions, and Dark Energy
          (requires {{ format(1e20, 0, 0) }} Dark Matter).
        </p>
      </button>
      <div :style="{ visibility: autoAnnihilationUnlocked ? 'visible' : 'hidden' }">
        <input type="text" v-model="autoAnnihilationInput" @change="handleAutoAnnihilationInputChange()"/><br>
        <label>Multiplier on the Dark Matter multiplier, after Annihilating</label>
      </div>
    </div>`
});
