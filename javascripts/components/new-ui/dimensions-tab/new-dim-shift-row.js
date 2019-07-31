"use strict";

Vue.component("new-dim-shift-row", {
  data() {
    return {
      requirement: {
        tier: 1,
        amount: 0
      },
      isShift: false,
      isBuyable: false,
      purchasedBoosts: 0,
      freeBoosts: 0
    };
  },
  computed: {
    name() {
      return this.isShift ? "Shift" : "Boost";
    },
    dimName() {
      return SHORT_DISPLAY_NAMES[this.requirement.tier];
    },
    buttonText() {
      return `Reset the game for a ${this.isShift ? "new Dimension" : "boost"}`;
    },
    boostCountText() {
      const parts = [this.purchasedBoosts];
      if (this.freeBoosts !== 0) {
        parts.push(this.freeBoosts);
      }
      const sum = parts.map(shortenSmallInteger).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${shortenSmallInteger(parts.sum())}`;
      }
      return sum;
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isBuyable = requirement.isSatisfied;
      this.isShift = DimBoost.isShift;
      this.purchasedBoosts = DimBoost.purchasedBoosts();
      this.freeBoosts = DimBoost.freeBoosts();
    },
    softReset() {
      softResetBtnClick();
    }
  },
  template:
  `<div class="reset-container dimboost">
    <h4>Dimensional {{name}} ({{boostCountText}})</h4>
    <span>Requires: {{shortenSmallInteger(requirement.amount)}} {{dimName}} D</span>
    <button 
      class="storebtn" style="height: 56px;"
      :class="{ 'storebtn-unavailable': !isBuyable }"
      :enabled="isBuyable"
      @click="softReset"
      >{{buttonText}}</button>
  </div>`
});