"use strict";

Vue.component("infinity-dim-tab", {
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
    };
  },
  methods: {
    update() {
      const infinityPower = player.infinityPower;
      this.infinityPower.copyFrom(infinityPower);
      this.conversionRate = getInfinityConversionRate();
      if (EternityChallenge(9).isRunning) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isAnyAutobuyerUnlocked = InfinityDimension(1).isAutobuyerUnlocked;
    },
    maxAll() {
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    }
  },
  template:
    `<div class="l-infinity-dim-tab">
      <div>
        <p>
          You have
          <span class="c-infinity-dim-description__accent">{{shortenMoney(infinityPower)}}</span> infinity power,
          translated to
          <span class="c-infinity-dim-description__accent">{{shortenMoney(dimMultiplier)}}</span>x
          multiplier on all dimensions (^{{ shorten(conversionRate, 2, 3) }}).
        </p>
      </div>
      <div>You are getting {{shortenDimensions(powerPerSecond)}} {{incomeType}} per second.</div>
      <primary-button
        v-if="!isEC8Running"
        class="o-primary-btn--buy-max l-infinity-dim-tab__buy-max"
        @click="maxAll"
      >Max all</primary-button>
      <div class="l-infinity-dim-tab__row-container">
        <infinity-dim-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
        />
      </div>
      <div
        v-if="isEC8Running"
        class="l-infinity-dim-tab__ec8-purchases"
      >You have {{EC8PurchasesLeft}} {{"purchase" | pluralize(EC8PurchasesLeft)}} left.</div>
      <primary-button
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--id-all-autobuyers l-infinity-dim-tab__all-autobuyers"
        @click="toggleAllAutobuyers"
      >Toggle all ON/OFF</primary-button>
    </div>`
});