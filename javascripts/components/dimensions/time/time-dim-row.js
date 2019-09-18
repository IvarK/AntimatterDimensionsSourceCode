"use strict";

Vue.component("time-dim-row", {
  props: {
    tier: Number,
    areAutobuyersUnlocked: Boolean
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      isAutobuyerOn: false,
    };
  },
  computed: {
    name() {
      return DISPLAY_NAMES[this.tier];
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${this.shortenRateOfChange(this.rateOfChange)}%/s)`
        : "";
    },
    buttonContents() {
      return this.isCapped ? "Capped" : `Cost: ${this.shortenDimensions(this.cost)} EP`;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.reality.tdbuyers[this.tier - 1] = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      const isUnlocked = dimension.isUnlocked;
      this.isCapped = Enslaved.isRunning && dimension.bought > 0;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = dimension.isAffordable;
      this.isAutobuyerOn = player.reality.tdbuyers[this.tier - 1];
    },
    buyTimeDimension() {
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
        v-model="isAutobuyerOn"
        class="o-primary-btn--td-autobuyer c-time-dim-row__button"
        text="Auto:"
      />
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-td c-time-dim-row__button"
        @click="buyTimeDimension"
      >{{buttonContents}}</primary-button>
    </div>`,
});
