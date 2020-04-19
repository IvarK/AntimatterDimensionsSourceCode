"use strict";

Vue.component("new-inf-dimensions-tab", {
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      isEnslavedRunning: false,
      EC8PurchasesLeft: 0,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
      nextDimCapIncrease: 0,
      tesseractCost: new Decimal(0),
      totalDimCap: 0,
      canBuyTesseract: false,
      enslavedCompleted: false
    };
  },
  computed: {
    sacrificeBoostDisplay() {
      return formatX(this.sacrificeBoost, 2, 2);
    },
    sacrificeTooltip() {
      return `Boosts 8th Dimension by ${this.sacrificeBoostDisplay}`;
    },
  },
  methods: {
    update() {
      const infinityPower = player.infinityPower;
      this.infinityPower.copyFrom(infinityPower);
      this.conversionRate = getInfinityConversionRate();
      if (EternityChallenge(9).isRunning) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = InfinityDimension(1).isAutobuyerUnlocked;
      this.nextDimCapIncrease = Enslaved.nextDimCapIncrease;
      this.tesseractCost.copyFrom(Enslaved.tesseractCost);
      this.totalDimCap = InfinityDimensions.totalDimCap;
      this.canBuyTesseract = Enslaved.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted;
    },
    maxAll() {
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Enslaved.buyTesseract();
    }
  },
  template:
  `<div class="l-infinity-dim-tab">
  <div>
    <p>
      You have
      <span class="c-infinity-dim-description__accent">{{format(infinityPower, 2, 1)}}</span> infinity power,
      translated to
      <span class="c-infinity-dim-description__accent">{{format(dimMultiplier, 2, 1)}}</span>x
      multiplier on all dimensions
    </p>
  </div>
  <div class="l-infinity-dim-tab__enslaved-reward-container" v-if="enslavedCompleted">
    <button
      class="c-infinity-dim-tab__tesseract-button"
      :class="{ 'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract }"
      @click="buyTesseract">
      <p>Buy a Tesseract</p>
      <p>Increase dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
      <p><b>Costs: {{ format(tesseractCost, 0, 0) }} IP</b></p>
    </button>
  </div>
  <div v-if="isEnslavedRunning">
    All Infinity Dimensions are limited to a single purchase.
  </div>
  <div v-else>
    All Infinity Dimensions except for the 8th are limited to a maximum of {{format(totalDimCap, 2)}}
    purchases each.
  </div>
  <div>You are getting {{format(powerPerSecond, 2, 0)}} {{incomeType}} per second.</div>
  <primary-button
    v-if="!isEC8Running"
    class="o-primary-btn--buy-max l-infinity-dim-tab__buy-max"
    @click="maxAll"
  >Max all</primary-button>
  <div class="l-dimensions-container">
    <new-inf-dimension-row
      v-for="tier in 8"
      :key="tier"
      :tier="tier"
    />
  </div>
  <div
    v-if="isEC8Running"
    class="l-infinity-dim-tab__ec8-purchases"
  >You have {{formatInt(EC8PurchasesLeft)}} {{"purchase" | pluralize(EC8PurchasesLeft)}} left.</div>
  <primary-button
    v-if="isAnyAutobuyerUnlocked && !isEC8Running"
    class="o-primary-btn--id-all-autobuyers l-infinity-dim-tab__all-autobuyers"
    @click="toggleAllAutobuyers"
  >Toggle all ON/OFF</primary-button>
</div>`
});
