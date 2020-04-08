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
      return TimeDimension(this.tier).displayName;
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    buttonContents() {
      return this.isCapped ? "Capped" : `Cost: ${format(this.cost, 2)} EP`;
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
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      buyMaxTimeDimension(this.tier);
    },
  },
  template:
    `<div v-show="isUnlocked" class="c-time-dim-row">
      <div class="c-time-dim-row__label c-time-dim-row__name">
        {{name}} Time Dimension {{formatX(multiplier, 2, 1)}}
      </div>
      <div class="c-time-dim-row__label c-time-dim-row__label--growable">
        {{format(amount, 2, 0)}}{{rateOfChangeDisplay}}
      </div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-td l-time-dim-row__button"
        @click="buyTimeDimension"
      >{{buttonContents}}</primary-button>
      <primary-button-on-off
        v-if="areAutobuyersUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--td-autobuyer l-time-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-else
        :enabled="isAffordable"
        class="o-primary-btn--buy-td-max l-time-dim-row__button"
        @click="buyMaxTimeDimension"
      >Buy Max</primary-button>
    </div>`,
});
