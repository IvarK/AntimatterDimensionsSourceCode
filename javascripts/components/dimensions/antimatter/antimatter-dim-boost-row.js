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
      lockText: null,
      unlockedByBoost: null
    };
  },
  computed: {
    dimName() {
      return AntimatterDimension(this.requirement.tier).displayName;
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
      this.unlockedByBoost = DimBoost.unlockedByBoost;
    },
    dimensionBoost(bulk) {
      if (!DimBoost.requirement.isSatisfied || !DimBoost.canBeBought) return;
      if (player.options.confirmations.dimensionBoost) {
        Modal.dimensionBoost.show({ bulk });
        return;
      }
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
        {{ unlockedByBoost }}
      </primary-button>
    </div>`
});
