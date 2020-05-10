"use strict";

Vue.component("laitela-tab", {
  data() {
    return {
      matter: new Decimal(0),
      maxMatter: new Decimal(0),
      nextUnlock: "",
      matterExtraPurchasePercentage: 0,
      realityTime: 0,
      maxDimTier: 0,
      activeDimensions: [],
      showReset: false,
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      darkEnergy: 0,
      darkEnergyGainPerSecond: 0,
      isRunning: 0,
      realityReward: 1,
      milestoneIds: [],
      singularities: 0,
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      singularityCap: 0,
      singularitiesGained: 0,
      hasAnnihilated: false,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.celestials.laitela.autoAnnihilationSetting,
      timeToAutoSingularity: 0
    };
  },
  methods: {
    update() {
      this.matter.copyFrom(player.celestials.laitela.matter);
      this.maxMatter.copyFrom(player.celestials.laitela.maxMatter);
      this.nextUnlock = Laitela.nextMatterDimensionThreshold;
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.darkMatterMult = Laitela.darkMatterMult;
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.hasAnnihilated = Laitela.darkMatterMult > 1;
      this.showReset = this.hasAnnihilated || !MatterDimensionState.list.some(d => d.amount.eq(0));
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.darkEnergyGainPerSecond = Array.range(1, 4)
        .map(n => MatterDimension(n))
        .filter(d => d.amount.gt(0))
        .map(d => d.powerDE * 1000 / d.interval)
        .sum();
      this.isRunning = Laitela.isRunning;
      this.realityReward = Laitela.realityReward;
      this.milestoneIds = SingularityMilestones.nextMilestoneGroup.map(m => m.id);
      this.singularities = player.celestials.laitela.singularities;
      this.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.singularityCap = Singularity.cap;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
      this.timeToAutoSingularity = SingularityMilestone(6).effectValue -
        player.celestials.laitela.secondsSinceReachedSingularity;
    },
    startRun() {
      if (!resetReality()) return;
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
      const formText = this.singularitiesGained === 1 ? "form a Singularity"
        : `form ${format(this.singularitiesGained, 2, 0)} Singularities`;
      const singularityTime = TimeSpan
        .fromSeconds((this.singularityCap - this.darkEnergy) / this.darkEnergyGainPerSecond)
        .toStringShort(false);
      if (this.canPerformSingularity) {
        const capitalized = `${formText.charAt(0).toUpperCase()}${formText.slice(1)}`;
        const autoTime = Number.isFinite(this.timeToAutoSingularity)
          ? `(Auto-singularity in ${TimeSpan.fromSeconds(this.timeToAutoSingularity).toStringShort(false)})`
          : "";
        return `${capitalized} ${autoTime}`;
      }
      return `Reach ${format(this.singularityCap)} Dark Energy to \
          ${formText} (in ${singularityTime})`;
    },
    completionTime() {
      return TimeSpan.fromSeconds(this.realityTime).toStringShort();
    },
    fullSingularityTime() {
      return TimeSpan.fromSeconds(this.singularityCap / this.darkEnergyGainPerSecond).toStringShort(false);
    }
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
      <div class="o-laitela-matter-amount">You have {{ format(matter.floor(), 2, 0) }} Dark Matter.</div>
      <div class="o-laitela-matter-amount">Your maximum Dark Matter ever is {{ format(maxMatter.floor(), 2, 0) }},
      giving {{ formatPercents(matterExtraPurchasePercentage, 2) }} more purchases from continuum.</div>
      <div class="o-laitela-matter-amount">
        You have {{ format(darkEnergy, 2, 4) }} Dark Energy. (+{{ format(darkEnergyGainPerSecond, 2, 4) }}/s)
      </div>
      <div class="l-laitela-singularity-container">
        <div class="l-laitela-singularity-container--left">
          <h2>
            You have {{ format(singularities, 2, 0) }} 
            {{ "Singularity" | pluralize(singularities, "Singularities")}}
          </h2>
          <button
            class="c-laitela-singularity"
            :class="{ 'c-laitela-singularity--active' : canPerformSingularity }"
            @click="doSingularity">
            <h2>{{ singularityText }}</h2>
          </button>
        </div>
        <div class="l-laitela-singularity-container--right">
          <button class="c-laitela-singularity__cap-control" @click="decreaseCap">
            Decrease Singularity cap.
          </button>
          <button class="c-laitela-singularity__cap-control" @click="increaseCap">
            Increase Singularity cap.
          </button>
          <br>
          Total time to current Singulrity cap: {{ fullSingularityTime }}
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
            Fastest Completion: {{ completionTime }}
            <br>
            <br>
            <span v-if="maxDimTier <= 7">
              Highest active dimension: {{ formatInt(maxDimTier) }}
            </span>
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
        </button>
        <div>
          <matter-dimension-row
            v-for="i in activeDimensions"
            :key="i"
            :dimension="dimensions[i]"
            />
          <div>
            {{ nextUnlock }}
          </div>
          <button class="c-laitela-annihilation-button" 
            @click="annihilate()" 
            :style="{ visibility: showReset ? 'visible' : 'hidden' }">
            <h2>Annihilation</h2>
            <span v-if="hasAnnihilated">
              Current multiplier to all DM multipliers: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
              <br><br>
            </span>
            Resets your Dark Matter, Dark Matter Dimensions, and Dark Energy, 
            <span v-if="hasAnnihilated && matter.gte(1e20)">
              but adds <b>{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
              (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
            </span>
            <span v-else-if="hasAnnihilated">
              adding to your current Annihilation multiplier (requires {{ format(1e20, 0, 0) }} Dark Matter).
            </span>
            <span v-else-if="matter.gte(1e20)">
              multiplying DM multipliers by <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b>.
            </span>
            <span v-else>
              giving a multiplier to all DM multipliers (requires {{ format(1e20, 0, 0) }} Dark Matter).
            </span>
            <div :style="{ visibility: hasAnnihilated ? 'visible' : 'hidden' }">
              <br>
              Auto-Annihilate when adding 
              <input type="text"
                v-model="autoAnnihilationInput"
                @change="handleAutoAnnihilationInputChange()"
                style="width: 6rem;"/>
              to the multiplier.
            </div>
          </button>
        </div>
        <div class="c-laitela-next-milestones">
          <div class="o-laitela-singularity-modal-button" onclick="Modal.singularityMilestones.show()">
            Show all milestones
          </div>
          <singularity-milestone v-for="milestone in nextMilestones" :key="milestone.id" :milestone="milestone"/>
        </div>
      </div>
    </div>`
});
