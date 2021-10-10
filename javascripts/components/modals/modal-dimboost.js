"use strict";

Vue.component("modal-dimboost", {
  props: { modalConfig: Object },
  data() { 
    return { 
      bulk: this.modalConfig.bulk,
      newBoosts: 1,
    }; 
  },
  computed: {
    topLabel() {
      if (this.bulk) return `You are about to purchase ${formatInt(this.newBoosts, 2)} 
      ${pluralize("Dimension Boost", this.newBoosts)}`;
      return `You are about to purchase a Dimension Boost`;
    },
    message() {
      return `This will reset all of your Antimatter Dimensions, tickspeed, and Antimatter. In return you will 
      ${this.boostEffects}. `;
    },
    boostEffects() {
      // Code ripped from antimatter-dim-boost-row.js, computed -> buttonText()
      const boosts = DimBoost.purchasedBoosts;

      let newUnlock = "";
      if (!EternityMilestone.unlockAllND.isReached && boosts < DimBoost.maxDimensionsUnlockable - 4) {
        newUnlock = `unlock the ${boosts + 5}th Dimension`;
      } else if (boosts === 4 && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning) {
        newUnlock = "unlock Sacrifice";
      }

      const formattedMultText = `get a ${formatX(DimBoost.power, 2, 1)} multiplier `;
      let dimensionRange = `to the 1st Dimension`;
      if (boosts > 0) dimensionRange = `to Dimensions 1-${Math.min(boosts + 1, 8)}`;
      if (boosts >= DimBoost.maxDimensionsUnlockable - 1) dimensionRange = `to all Dimensions`;

      let boostEffects = "";
      if (NormalChallenge(8).isRunning) boostEffects = newUnlock;
      else if (newUnlock === "") boostEffects = `${formattedMultText} ${dimensionRange}`;
      else boostEffects = `${newUnlock} and ${formattedMultText} ${dimensionRange}`;

      return boostEffects;
    }
  },
  methods: {
    update() {
      this.newBoosts = this.bulk ? this.getCanBuy() : 1;
    },
    handleYesClick() {
      this.emitClose();
      requestDimensionBoost(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    },
    handleNoClick() {
      this.emitClose();
    },
    getCanBuy() {
      // Code ripped from dimboost.js, function maxBuyDimBoosts()
      const req1 = DimBoost.bulkRequirement(1);
      const req2 = DimBoost.bulkRequirement(2);
      const increase = req2.amount - req1.amount;
      const dim = AntimatterDimension(req1.tier);
      // Linearly extrapolate dimboost costs. req1 = a * 1 + b, req2 = a * 2 + b
      // so a = req2 - req1, b = req1 - a = 2 req1 - req2, num = (dims - b) / a
      let maxBoosts = Math.min(Number.MAX_VALUE,
        1 + Math.floor((dim.totalAmount.toNumber() - req1.amount) / increase));
      if (DimBoost.bulkRequirement(maxBoosts).isSatisfied) {
        return maxBoosts;
      }
      // But in case of EC5 it's not, so do binary search for appropriate boost amount
      let minBoosts = 2;
      while (maxBoosts !== minBoosts + 1) {
        const middle = Math.floor((maxBoosts + minBoosts) / 2);
        if (DimBoost.bulkRequirement(middle).isSatisfied) minBoosts = middle;
        else maxBoosts = middle;
      }
      return maxBoosts;
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ topLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Confirm
        </primary-button>
      </div>
    </div>`
});