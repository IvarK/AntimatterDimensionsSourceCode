"use strict";

Vue.component("modal-dimension-boost", {
  props: { modalConfig: Object },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      const newBoosts = this.bulk ? this.getCanBuy() : 1;
      if (this.bulk) return `You are about to purchase ${formatInt(newBoosts, 2)} 
      ${pluralize("Dimension Boost", newBoosts)}`;
      return `You are about to purchase a Dimension Boost`;
    },
    message() {
      return `${DimBoost.unlockedByBoost}?`;
    },
  },
  methods: {
    handleYesClick() {
      this.emitClose();
      requestDimensionBoost(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    },
    handleNoClick() {
      this.emitClose();
    },
    getCanBuy() {
      // Code based off of dimboost.js, function maxBuyDimBoosts()
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