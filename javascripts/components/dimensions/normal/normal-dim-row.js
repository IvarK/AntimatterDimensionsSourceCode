Vue.component('normal-dim-row', {
  props: {
    floatingText: Array,
    tier: Number
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    amountDisplay: function() {
      return this.tier < 8 ? this.shortenDimensions(this.amount) : Math.round(this.amount).toString();
    },
    rateOfChangeDisplay: function() {
      return this.tier < 8 ?
        ` (+${this.shortenRateOfChange(this.rateOfChange)}%/s)` :
        String.empty;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const isUnlocked = canBuyDimension(tier);
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      const dimension = NormalDimension(tier);
      this.multiplier.copyFrom(getDimensionFinalMultiplier(tier));
      this.amount.copyFrom(dimension.amount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
    },
    buySingle: function() {
      buyOneDimensionBtnClick(this.tier);
    },
    buyUntil10: function() {
      buyManyDimensionsBtnClick(this.tier);
    },
  },
  template:
    `<div v-show="isUnlocked" class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__name c-normal-dim-row__label"
      >{{name}} Dimension x{{shortenMultiplier(multiplier)}}</div>
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{amountDisplay}} ({{boughtBefore10}}){{rateOfChangeDisplay}}</div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-nd o-primary-btn--buy-single-nd c-normal-dim-row__buy-button"
        @click="buySingle"
      >Cost: {{shortenCosts(singleCost)}}</primary-button>
      <primary-button
        :enabled="isAffordableUntil10"
        class="o-primary-btn--buy-nd o-primary-btn--buy-10-nd c-normal-dim-row__buy-button"
        @click="buyUntil10"
      >Until 10, Cost: {{shortenCosts(until10Cost)}}</primary-button>
      <div
        v-for="text in floatingText"
        :key="text.key"
        class='c-normal-dim-row__floating-text'
      >{{text.text}}</div>
    </div>`,
});