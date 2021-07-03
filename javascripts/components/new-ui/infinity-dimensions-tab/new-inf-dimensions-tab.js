"use strict";

Vue.component("new-inf-dimensions-tab", {
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isEnslavedRunning: false,
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
      return `Boosts 8th Antimatter Dimension by ${this.sacrificeBoostDisplay}`;
    },
  },
  methods: {
    update() {
      this.isEC9Running = EternityChallenge(9).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate = InfinityDimensions.powerConversionRate;
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(this.infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease = Enslaved.nextDimCapIncrease;
      this.tesseractCost.copyFrom(Enslaved.tesseractCost);
      this.totalDimCap = InfinityDimensions.totalDimCap;
      this.canBuyTesseract = Enslaved.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted;
    },
    maxAll() {
      tryUnlockInfinityDimensions(false);
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Enslaved.buyTesseract();
    }
  },
  template: `
    <div class="l-infinity-dim-tab">
      <div class="c-subtab-option-container">
        <primary-button
          v-if="!isEC8Running"
          class="o-primary-btn--subtab-option"
          @click="maxAll"
        >
          Max all
        </primary-button>
        <primary-button
          v-if="isAnyAutobuyerUnlocked && !isEC8Running"
          class="o-primary-btn--subtab-option"
          @click="toggleAllAutobuyers"
        >
          Toggle all autobuyers
        </primary-button>
      </div>
      <div>
        <p>
          You have
          <span class="c-infinity-dim-description__accent">{{ format(infinityPower, 2, 1) }}</span>
          Infinity Power,
          <br>
          <span v-if="!isEC9Running">
            increased by
            <span class="c-infinity-dim-description__accent">^{{ format(conversionRate, 2, 3) }}</span>
          </span>
          <span v-else>
            translated
          </span>
          to a
          <span class="c-infinity-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
          multiplier on all
          <span v-if="!isEC9Running">Antimatter Dimensions.</span>
          <span v-else>Time Dimensions due to Eternity Challenge 9.</span>
        </p>
      </div>
      <div class="l-infinity-dim-tab__enslaved-reward-container" v-if="enslavedCompleted">
        <button
          class="c-infinity-dim-tab__tesseract-button"
          :class="{ 'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract }"
          @click="buyTesseract"
        >
          <p>Buy a Tesseract</p>
          <p>Increase dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
          <p><b>Costs: {{ format(tesseractCost) }} IP</b></p>
        </button>
      </div>
      <div v-if="isEnslavedRunning">
        All Infinity Dimensions are limited to a single purchase.
      </div>
      <div v-else>
        All Infinity Dimensions except for the 8th are limited to a maximum of {{ format(totalDimCap, 2) }}
        purchases each.
      </div>
      <div>You are getting {{ format(powerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
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
      >
        You have {{ formatInt(EC8PurchasesLeft) }} {{ "purchase" | pluralize(EC8PurchasesLeft) }} left.
      </div>
    </div>`
});
