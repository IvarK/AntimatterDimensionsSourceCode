"use strict";

Vue.component("antimatter-dim-boost-row", {
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
      return AntimatterDimension(this.requirement.tier).displayName;
    },
    buttonText() {
      let dimensionRange = "the 1st Dimension";
      if (this.purchasedBoosts > 0) dimensionRange = `Dimensions 1-${Math.min(this.purchasedBoosts + 1, 8)}`;
      if (this.purchasedBoosts >= 7) dimensionRange = `all Dimensions`;
      return this.lockText === null
        ? `Reset your Dimensions for a new Dimension and a boost to ${dimensionRange}`
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
    `<div class="c-antimatter-dim-row">
      <div
        class="c-dim-row__label c-dim-row__label--growable"
      >
        Dimension Boost ({{boostCountText}}):
        requires {{formatInt(requirement.amount)}} {{dimName}} Dimensions
      </div>
      <primary-button
        :enabled="isBuyable"
        class="o-primary-btn--dimboost l-dim-row__button l-dim-row__button--right-offset"
        :class=tutorialClass
        @click="softReset"
      >{{buttonText}}</primary-button>
    </div>`
});
