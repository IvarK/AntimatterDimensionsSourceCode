Vue.component('time-dim-row', {
  props: {
    tier: Number,
    areAutobuyersUnlocked: Boolean
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      autobuyers: player.reality.tdbuyers
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
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
      const dimension = TimeDimension(tier);
      const isUnlocked = dimension.isUnlocked;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = dimension.isAffordable;
    },
    buyTimeDimension: function() {
      buyTimeDimension(this.tier);
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-time-dim-row">
      <div
        class="c-time-dim-row__label c-time-dim-row__name"
      >{{name}} Time Dimension x{{shortenMoney(multiplier)}}</div>
      <div
        class="c-time-dim-row__label c-time-dim-row__label--growable"
      >{{shortenDimensions(amount)}}{{rateOfChangeDisplay}}</div>
      <primary-button-on-off
        v-if="areAutobuyersUnlocked"
        v-model="autobuyers[tier - 1]"
        class="o-primary-btn--td-autobuyer c-time-dim-row__button"
        text="Auto:"
      />
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-td c-time-dim-row__button"
        @click="buyTimeDimension"
      >Cost: {{shortenDimensions(cost)}} EP</primary-button>
    </div>`,
});