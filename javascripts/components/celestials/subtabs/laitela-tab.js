"use strict";

Vue.component("laitela-tab", {
  data() {
    return {
      matter: new Decimal(0),
      nextUnlock: "",
      matterExtraPurchaseFactor: 0,
      maxDimTier: 0,
      activeDimensions: [],
      anomalies: new Decimal(0),
      anomalyGain: new Decimal(0),
      showReset: false,
      darkEnergyMult: 0,
      darkMatterMultFromDE: 0,
      darkEnergy: 0,
      annihilated: false,
      isRunning: 0,
    };
  },
  methods: {
    update() {
      this.matter.copyFrom(player.celestials.laitela.matter);
      this.nextUnlock = Laitela.nextMatterDimensionThreshold;
      this.matterExtraPurchaseFactor = Laitela.matterExtraPurchaseFactor;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.anomalies.copyFrom(player.celestials.laitela.anomalies);
      this.anomalyGain.copyFrom(Laitela.anomalyGain);
      this.annihilated = player.celestials.laitela.annihilated;
      this.showReset = this.annihilated || this.anomalyGain.gt(0);
      this.darkEnergyMult = Laitela.darkEnergyMult;
      this.darkMatterMultFromDE = Laitela.darkMatterMultFromDE;
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.isRunning = Laitela.isRunning;
    },
    startRun() {
      if (this.isRunning) startRealityOver();
      else Laitela.startRun();
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
  },
  computed: {
    dimensions: () => MatterDimensionState.list,
    runUnlockThresholds: () => laitelaRunUnlockThresholds,
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <div class="o-laitela-matter-amount">You have {{ format(matter.floor(), 2, 0) }} Dark Matter,
      giving {{ formatX(matterExtraPurchaseFactor, 2, 2)}} more purchases from continuum.</div>
      <div>
        You have {{ format(darkEnergy, 2, 3)}} Dark Energy,
        giving a {{ formatX(darkMatterMultFromDE, 2, 2) }} multiplier to production of dark matter and
        dark matter dimensions (based on 8th Dimensions).
      </div>
      <div v-if="annihilated">
        You have {{ format(anomalies, 2, 0) }} {{"Anomaly" | pluralize(anomalies, "Anomalies")}},
        giving a {{ formatX(darkEnergyMult, 2, 2) }} multiplier to dark energy production.
      </div>
      <primary-button
        class="o-primary-btn--buy-max l-time-dim-tab__buy-max"
        @click="maxAll"
      >Max all (DM)</primary-button>
      <div class="l-laitela-mechanics-container">
        <div>
          <matter-dimension-row
            v-for="i in activeDimensions"
            :key="i"
            :dimension="dimensions[i]"
            />
          <div>{{ nextUnlock }}</div>
        </div>
      </div>
      <div class="l-laitela-mechanics-lower">
        <div class="l-laitela-buttons-container">
          <button class="o-laitela-run-button" @click="startRun">
            <b>Start Lai'tela's Reality</b>
            <div v-bind:class="runButtonClassObject()"></div>
            IP and EP gain are dilated. Game speed is reduced to 1 and gradually comes back over 10 minutes,
            black hole discharging and pulsing are disabled.
            <br>
            <br>
            Antimatter generates entropy inside of this reality. At 100% entropy, the reality becomes destabilized and
            you gain a reward based on how quickly you reached 100%. If you can destabilize in less than 30 seconds,
            the reality becomes more difficult but also gives a stronger reward.
            <div v-if="maxDimTier === 7">
              <br>
              Production is disabled for all 8th dimensions.
            </div>
            <div v-else-if="maxDimTier < 7">
              <br>
              Production is disabled for all dimensions {{ maxDimTier + 1 }} or higher.
            </div>
          </button>
          <button class="c-laitela-annihilation-button" @click="annihilate()" v-if="showReset">
            <h2>Annihilation</h2>
            <p>
              Resets your dark matter dimensions and Dark Matter, but gain <b>{{ format(anomalyGain, 2, 0) }}</b> 
              {{"Anomaly" | pluralize(anomalyGain, "Anomalies")}}.
            </p>
            <p>
              Anomalies give a multiplier to Dark Energy production.
            </p>
              (amount + {{ formatInt(1) }})
            </p>
          </button>
        </div>
      </div>
    </div>`
});
