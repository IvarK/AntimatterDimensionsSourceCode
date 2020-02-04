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
      return NormalDimension(this.requirement.tier).shortDisplayName;
    },
    buttonText() {
      return `Reset your Dimensions for a ${this.isShift ? "new Dimension" : "boost"}`;
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
      return Tutorial.glowingClass(TUTORIAL_STATE.DIMSHIFT, this.$viewModel.tutorialState, this.isBuyable);
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isBuyable = requirement.isSatisfied;
      this.isShift = DimBoost.isShift;
      this.purchasedBoosts = DimBoost.purchasedBoosts;
      this.freeBoosts = DimBoost.freeBoosts;
    },
    softReset() {
      softResetBtnClick();
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMSHIFT);
    }
  },
  template:
  `<div class="reset-container dimboost">
    <h4>Dimensional {{name}} ({{boostCountText}})</h4>
    <span>Requires: {{formatInt(requirement.amount)}} {{dimName}} D</span>
    <button
      class="o-primary-btn o-primary-btn--new" style="height: 56px; font-size: 1rem;"
      :class="{ 'o-primary-btn--disabled': !isBuyable, ...tutorialClass }"
      :enabled="isBuyable"
      @click="softReset"
      >{{buttonText}}</button>
  </div>`
});
