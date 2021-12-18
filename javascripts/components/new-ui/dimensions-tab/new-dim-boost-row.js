Vue.component("new-dim-boost-row", {
  data() {
    return {
      requirement: {
        tier: 1,
        amount: 0
      },
      isBuyable: false,
      purchasedBoosts: 0,
      imaginaryBoosts: 0,
      lockText: null,
      unlockedByBoost: null,
    };
  },
  computed: {
    dimName() {
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
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
      this.isBuyable = requirement.isSatisfied && Reset.dimensionBoost.canBePerformed;
      this.purchasedBoosts = DimBoost.purchasedBoosts;
      this.imaginaryBoosts = DimBoost.imaginaryBoosts;
      this.lockText = DimBoost.lockText;
      this.unlockedByBoost = DimBoost.unlockedByBoost;
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
        {{ unlockedByBoost }}
      </button>
    </div>`
});
