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
      imaginaryBoosts: 0,
      lockText: null
    };
  },
  computed: {
    dimName() {
      return AntimatterDimension(this.requirement.tier).displayName;
    },
    buttonText() {
      const boosts = this.purchasedBoosts;

      let newUnlock = "";
      if (!EternityMilestone.unlockAllND.isReached && boosts < DimBoost.maxDimensionsUnlockable - 4) {
        newUnlock = `unlock the ${boosts + 5}th Dimension`;
      } else if (boosts === 4 && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning) {
        newUnlock = "unlock Sacrifice";
      }

      const formattedMultText = `give a ${formatX(DimBoost.power, 2, 1)} multiplier `;
      let dimensionRange = `to the 1st Dimension`;
      if (boosts > 0) dimensionRange = `to Dimensions 1-${Math.min(boosts + 1, 8)}`;
      if (boosts >= DimBoost.maxDimensionsUnlockable - 1) dimensionRange = `to all Dimensions`;

      let boostEffects = "";
      if (NormalChallenge(8).isRunning) boostEffects = newUnlock;
      else if (newUnlock === "") boostEffects = `${formattedMultText} ${dimensionRange}`;
      else boostEffects = `${newUnlock} and ${formattedMultText} ${dimensionRange}`;

      return this.lockText === null
        ? `Reset your Dimensions to ${boostEffects}`
        : this.lockText;
    },
    boostCountText() {
      const parts = [this.purchasedBoosts];
      if (this.imaginaryBoosts !== 0) {
        parts.push(this.imaginaryBoosts);
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
      this.imaginaryBoosts = DimBoost.imaginaryBoosts;
      this.lockText = DimBoost.lockText;
    },
    dimensionBoost(bulk) {
      requestDimensionBoost(bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    }
  },
  template: `
    <div class="c-antimatter-dim-row">
      <div class="c-dim-row__label c-dim-row__label--growable">
        Dimension Boost ({{ boostCountText }}):
        requires {{ formatInt(requirement.amount) }} {{ dimName }} Dimensions
      </div>
      <primary-button
        :enabled="isBuyable"
        class="o-primary-btn--dimboost l-dim-row__button l-dim-row__button--right-offset"
        :class=tutorialClass
        @click.exact="dimensionBoost(true)"
        @click.shift.exact="dimensionBoost(false)"
      >
        {{ buttonText }}
      </primary-button>
    </div>`
});
