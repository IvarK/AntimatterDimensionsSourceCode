"use strict";

Vue.component("infinity-dim-row", {
  props: {
    tier: Number
  },
  data() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      baseAmount: 0,
      amount: new Decimal(0),
      purchases: 0,
      hasRateOfChange: false,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      isAutobuyerOn: false,
      isEC8Running: false,
      hardcap: InfinityDimensions.HARDCAP_PURCHASES,
      requirementReached: false,
      eternityReached: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.infDimBuyers[this.tier - 1] = newValue;
    }
  },
  computed: {
    name() {
      return InfinityDimension(this.tier).displayName;
    },
    rateOfChangeDisplay() {
      return this.hasRateOfChange
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    costDisplay() {
      const requirement = InfinityDimension(this.tier).requirement;
      if (this.isUnlocked) {
        return this.isCapped ? "Capped!" : `Cost: ${format(this.cost)} IP`;
      }
      
      if (this.requirementReached) {
        return "Unlock";
      }

      return `Reach ${format(requirement)} AM`;
    },
    hardcapPurchases() {
      return format(this.hardcap, 1, 1);
    },
    capTooltip() {
      return this.isCapped
        ? `Cap reached at ${format(this.capIP)} IP`
        : `Purchased ${formatInt(this.purchases)} ${pluralize("time", this.purchases)}`;
    },
    showRow() {
      return this.eternityReached || this.isUnlocked || this.requirementReached || this.amount.gt(0);
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.baseAmount = dimension.baseAmount;
      this.purchases = dimension.purchases;
      this.amount.copyFrom(dimension.amount);
      this.hasRateOfChange = dimension.hasRateOfChange;
      if (this.hasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = dimension.isAutobuyerUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      if (!this.isUnlocked) {
        this.isAvailableForPurchase = dimension.requirementReached;
      }
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap = dimension.purchaseCap;
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
      this.isAutobuyerOn = player.infDimBuyers[this.tier - 1];
      this.requirementReached = dimension.requirementReached;
      this.eternityReached = PlayerProgress.eternityUnlocked();
    },
    buyManyInfinityDimension() {
      if (!this.isUnlocked) {
        InfinityDimension(this.tier).tryUnlock();
        return;
      }
      buyManyInfinityDimension(this.tier);
    },
    buyMaxInfinityDimension() {
      if (!this.isUnlocked) return;
      buyMaxInfDims(this.tier);
    },
  },
  template:
    `<div v-show="showRow" class="c-infinity-dim-row"
      :class="{ 'c-infinity-dim-row--not-reached': !isUnlocked && !requirementReached }">
      <div class="c-dim-row__label c-dim-row__name">
        {{name}} Infinity Dimension {{formatX(multiplier, 2, 1)}}
      </div>
      <div class="c-dim-row__label c-dim-row__label--growable">
        {{format(amount, 2, 0)}}
        <span class="c-dim-row__label--small">{{rateOfChangeDisplay}}</span>
      </div>
      <primary-button
        v-tooltip="capTooltip"
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-id l-dim-row__button"
        @click="buyManyInfinityDimension"
      >{{costDisplay}}</primary-button>
      <primary-button-on-off
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        class="o-primary-btn--id-autobuyer l-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-else
        :enabled="isAvailableForPurchase && isUnlocked"
        class="o-primary-btn--buy-id-max l-dim-row__button"
        @click="buyMaxInfinityDimension"
      >Buy Max</primary-button>
    </div>`,
});
