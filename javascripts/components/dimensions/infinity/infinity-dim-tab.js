Vue.component('infinity-dim-tab', {
  data: function() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: String.empty,
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isAnyAutobuyerUnlocked: false
    };
  },
  methods: {
    update() {
      const infinityPower = player.infinityPower;
      this.infinityPower.copyFrom(infinityPower);
      if (player.currentEternityChall === "eterc9") {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(infinityPower.log2(), 1), 4).max(1));
      }
      else {
        const conversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
        this.dimMultiplier.copyFrom(infinityPower.pow(conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.incomeType = player.currentEternityChall === "eterc7" ? "Seventh Dimensions" : "Infinity Power";
      const isEC8Running = player.currentEternityChall === "eterc8";
      this.isEC8Running = isEC8Running;
      if (isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isAnyAutobuyerUnlocked = InfinityDimension(1).isAutobuyerUnlocked;
    },
    maxAll: function() {
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers: function() {
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
          <span class="c-infinity-dim-description__accent">{{shortenMoney(dimMultiplier)}}</span>x multiplier on all dimensions
        </p>
      </div>
      <div>You are getting {{shortenDimensions(powerPerSecond)}} {{incomeType}} per second.</div>
      <primary-button
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
      >You have {{EC8PurchasesLeft}} purchases left.</div>
      <primary-button
        v-if="isAnyAutobuyerUnlocked"
        class="o-primary-btn--id-all-autobuyers l-infinity-dim-tab__all-autobuyers"
        @click="toggleAllAutobuyers"
      >Toggle all ON/OFF</primary-button>
    </div>`
});