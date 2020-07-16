"use strict";

Vue.component("new-dim-boost-row", {
  data() {
    return {
      requirement: {
        tier: 1,
        amount: 0
      },
      isBuyable: false,
      purchasedBoosts: 0,
      freeBoosts: 0,
      lockText: null
    };
  },
  computed: {
    dimName() {
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
    },
    buttonText() {
      const boosts = this.purchasedBoosts;
      const newDimension = boosts < 4 ? `unlock the ${boosts + 5}th Dimension, and` : "";
      let dimensionRange = "the 1st Dimension";
      if (boosts > 0) dimensionRange = `Dimensions 1-${Math.min(boosts + 1, 8)}`;
      if (boosts >= 7) dimensionRange = `all Dimensions`;
      return this.lockText === null
        ? `Reset your Dimensions to ${newDimension} give a multiplier to ${dimensionRange}`
        : this.lockText;
    },
    boostCountText() {
      const parts = [this.purchasedBoosts];
      if (this.freeBoosts !== 0) {
        parts.push(this.freeBoosts);
      }
      const sum = parts.map(formatInt).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatInt(parts.sum())}`;
      }
      return sum;
    },
    tutorialClass() {
      return Tutorial.glowingClass(TUTORIAL_STATE.DIMBOOST, this.isBuyable);
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isBuyable = requirement.isSatisfied && DimBoost.canBeBought;
      this.purchasedBoosts = DimBoost.purchasedBoosts;
      this.freeBoosts = DimBoost.freeBoosts;
      this.lockText = DimBoost.lockText;
    },
    softReset() {
      softResetBtnClick();
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    }
  },
  template:
  `<div class="reset-container dimboost">
    <div style="height: 4rem;"><h4>Dimension Boost ({{boostCountText}})</h4></div>
    <span>Requires: {{formatInt(requirement.amount)}} {{dimName}} Antimatter D</span>
    <div style="height: 2rem;"/> <!-- Padding to match with Galaxy text/button -->
    <button
      class="o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset"
      :class="{ 'o-primary-btn--disabled': !isBuyable, ...tutorialClass }"
      :enabled="isBuyable"
      @click="softReset"
      >{{buttonText}}</button>
  </div>`
});
