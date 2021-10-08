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

      let newUnlock = "";
      if (boosts < DimBoost.maxDimensionsUnlockable - 4) newUnlock = `unlock the ${boosts + 5}th Dimension`;
      else if (boosts === 4 && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning) {
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
      this.isBuyable = requirement.isSatisfied && Reset.dimensionBoost.canBePerformed;
      this.purchasedBoosts = DimBoost.purchasedBoosts;
      this.freeBoosts = DimBoost.freeBoosts;
      this.lockText = DimBoost.lockText;
    },
    dimensionBoost(bulk) {
      Reset.dimensionBoost.request({ gain: { bulk } });
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    }
  },
  template: `
    <div class="reset-container dimboost">
      <h4>Dimension Boost ({{ boostCountText }})</h4>
      <span>Requires: {{ formatInt(requirement.amount) }} {{ dimName }} Antimatter D</span>
      <button
        class="o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset"
        :class="{ 'o-primary-btn--disabled': !isBuyable, ...tutorialClass }"
        :enabled="isBuyable"
        @click.exact="dimensionBoost(true)"
        @click.shift.exact="dimensionBoost(false)"
      >
        {{ buttonText }}
      </button>
    </div>`
});
