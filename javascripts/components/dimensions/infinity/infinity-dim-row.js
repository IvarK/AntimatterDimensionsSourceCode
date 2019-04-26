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
      bought: 0,
      hasRateOfChange: false,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPuchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      autobuyers: player.infDimBuyers,
      isEC8Running: false,
      hardcap: HARDCAP_ID_PURCHASES,
    };
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
      return this.shortenCosts(this.hardcap);
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
      this.bought = dimension.bought;
      this.hasRateOfChange = dimension.hasRateOfChange;
      if (this.hasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = dimension.isAutobuyerUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPuchase = dimension.isAvailableForPuchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap = Enslaved.isRunning ? 1 : HARDCAP_ID_PURCHASES;
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
    },
    buyManyInfinityDimension() {
      buyManyInfinityDimension(this.tier);
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-infinity-dim-row">
      <div
        class="c-infinity-dim-row__label c-infinity-dim-row__name"
      >{{name}} Infinity Dimension x{{shortenMoney(multiplier)}}</div>
      <div
        class="c-infinity-dim-row__label c-infinity-dim-row__label--growable"
      >{{shortenDimensions(amount)}} ({{bought}}){{rateOfChangeDisplay}}</div>
      <primary-button-on-off
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="autobuyers[tier - 1]"
        class="o-primary-btn--id-autobuyer c-infinity-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-tooltip="capTooltip"
        :enabled="isAvailableForPuchase"
        class="o-primary-btn--buy-id c-infinity-dim-row__button"
        @click="buyManyInfinityDimension"
      >{{costDisplay}}</primary-button>
    </div>`,
});