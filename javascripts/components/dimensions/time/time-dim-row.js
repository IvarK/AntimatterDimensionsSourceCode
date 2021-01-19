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
      realityUnlocked: false
    };
  },
  computed: {
    name() {
      return TimeDimension(this.tier).shortDisplayName;
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    buttonContents() {
      if (!this.isUnlocked) return "Purchase the study";
      return this.isCapped ? "Capped" : `Cost: ${format(this.cost, 2)} EP`;
    },
    showRow() {
      return this.isUnlocked || this.realityUnlocked;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.auto.timeDims.buyer[this.tier - 1] = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      this.isCapped = Enslaved.isRunning && dimension.bought > 0;
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = dimension.isAffordable;
      this.isAutobuyerOn = player.auto.timeDims.buyer[tier - 1];
      this.realityUnlocked = PlayerProgress.realityUnlocked();
    },
    buyTimeDimension() {
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      buyMaxTimeDimension(this.tier);
    },
  },
  template: `
    <div v-show="showRow" class="c-time-dim-row"
      :class="{ 'c-dim-row--not-reached': !isUnlocked }">
      <div class="c-dim-row__label c-dim-row__name">
        {{name}} Time Dimension {{formatX(multiplier, 2, 1)}}
      </div>
      <div class="c-dim-row__label c-dim-row__label--growable">
        {{format(amount, 2, 0)}}
        <span class="c-dim-row__label--small" v-if="rateOfChange.neq(0)">{{rateOfChangeDisplay}}</span>
      </div>
      <primary-button
        :enabled="isAffordable && !isCapped && isUnlocked"
        class="o-primary-btn--buy-td l-dim-row__button"
        @click="buyTimeDimension"
      >{{buttonContents}}</primary-button>
      <primary-button-on-off
        v-if="areAutobuyersUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--td-autobuyer l-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-else
        :enabled="isAffordable && !isCapped && isUnlocked"
        class="o-primary-btn--buy-td-max l-dim-row__button"
        @click="buyMaxTimeDimension"
      >Buy Max</primary-button>
    </div>`,
});
