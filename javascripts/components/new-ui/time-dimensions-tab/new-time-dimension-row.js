"use strict";

Vue.component("new-time-dimension-row", {
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
      bought: 0,
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      realityUnlocked: false,
      showTTCost: false,
      ttCost: 0
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeDimension(this.tier).isActive = newValue;
    }
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return TimeDimension(this.tier).shortDisplayName;
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    buttonContents() {
      if (this.showTTCost) {
        return this.formattedTTCost;
      }
      return this.formattedEPCost;
    },
    tooltipContents() {
      if (this.showTTCost) return this.formattedEPCost;
      if (this.isCapped) return `Enslaved prevents the purchase of more than ${format(1)} Time Dimension`;
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return this.realityUnlocked || this.isUnlocked || this.requirementReached;
    },
    formattedTTCost() {
      return `Unlock: ${format(this.ttCost)} TT`;
    },
    formattedEPCost() {
      return this.isCapped ? "Capped" : `Cost: ${format(this.cost, 2)} EP`;
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
      this.bought = dimension.bought;
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      if (!this.isUnlocked) {
        this.isAvailableForPurchase = dimension.requirementReached;
      }
      this.requirementReached = dimension.requirementReached;
      this.isAutobuyerOn = Autobuyer.timeDimension(this.tier).isActive;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
      this.showTTCost = !this.isUnlocked && !this.shiftDown;
      if (this.tier > 4) this.ttCost = TimeStudy.timeDimension(this.tier).cost;
    },
    buyTimeDimension() {
      if (!this.isUnlocked) {
        TimeDimension(this.tier).tryUnlock();
        return;
      }
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      buyMaxTimeDimension(this.tier);
    },
  },
  template: `
    <div
      v-show="showRow"
      class="c-time-dim-row"
      :class="{ 'c-dim-row--not-reached': !isUnlocked && !requirementReached }"
    >
      <div class="c-dim-row__label c-dim-row__name">
        {{ name }} Time D <span class="c-time-dim-row__multiplier">{{ formatX(multiplier, 2, 1) }}</span>
      </div>
      <div class="c-dim-row__label c-dim-row__label--growable">
        {{ format(amount, 2, 0) }}
        <span class="c-dim-row__label--small" v-if="rateOfChange.neq(0)">{{ rateOfChangeDisplay }}</span>
      </div>
      <primary-button
        v-tooltip="tooltipContents"
        :enabled="isAvailableForPurchase && !isCapped"
        class="o-primary-btn--buy-td l-dim-row__button o-primary-btn o-primary-btn--new"
        @click="buyTimeDimension"
      >
        {{ buttonContents }}
      </primary-button>
      <primary-button-on-off
        v-if="areAutobuyersUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--td-autobuyer l-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-else
        :enabled="isAvailableForPurchase && !isCapped"
        class="o-primary-btn--buy-td-max l-dim-row__button"
        @click="buyMaxTimeDimension"
      >
        Buy Max
      </primary-button>
    </div>`,
});
