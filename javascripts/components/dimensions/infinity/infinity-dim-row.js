"use strict";

Vue.component("infinity-dim-row", {
  props: {
    tier: Number
  },
  data() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      hasRateOfChange: false,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      isAutobuyerOn: false,
      isEC8Running: false,
      hardcap: HARDCAP_ID_PURCHASES,
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.infDimBuyers[this.tier - 1] = newValue;
    }
  },
  computed: {
    name() {
      return DISPLAY_NAMES[this.tier];
    },
    rateOfChangeDisplay() {
      return this.hasRateOfChange
        ? ` (+${this.shortenRateOfChange(this.rateOfChange)}%/s)`
        : "";
    },
    costDisplay() {
      return this.isCapped ? "Capped!" : `Cost: ${this.shortenCosts(this.cost)} IP`;
    },
    hardcapPurchases() {
      return this.shorten(this.hardcap, 1, 1);
    },
    capTooltip() {
      return this.isCapped
        ? `Limited to ${this.hardcapPurchases} upgrades (${this.shortenCosts(this.capIP)} IP)`
        : undefined;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.isUnlocked = dimension.isUnlocked;
      if (!this.isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.hasRateOfChange = dimension.hasRateOfChange;
      if (this.hasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = dimension.isAutobuyerUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap = dimension.purchaseCap;
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
      this.isAutobuyerOn = player.infDimBuyers[this.tier - 1];
    },
    buyManyInfinityDimension() {
      buyManyInfinityDimension(this.tier);
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-infinity-dim-row">
      <div class="c-infinity-dim-row__label c-infinity-dim-row__name">
        {{name}} Infinity Dimension x{{shortenMoney(multiplier)}}
      </div>
      <div class="c-infinity-dim-row__label c-infinity-dim-row__label--growable">
        {{shortenDimensions(amount)}} {{rateOfChangeDisplay}}
      </div>
      <primary-button-on-off
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        class="o-primary-btn--id-autobuyer l-infinity-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-tooltip="capTooltip"
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-id l-infinity-dim-row__button"
        @click="buyManyInfinityDimension"
      >{{costDisplay}}</primary-button>
    </div>`,
});
