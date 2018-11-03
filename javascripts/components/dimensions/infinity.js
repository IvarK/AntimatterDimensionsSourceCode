Vue.component('dimensions-infinity', {
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
        class="c-primary-btn--buy-max l-infinity-dim-tab__buy-max"
        @click="maxAll"
      >Max all</primary-button>
      <div class="l-infinity-dim-tab__row-container">
        <infinity-dimension-row
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
        class="c-primary-btn--id-all-autobuyers l-infinity-dim-tab__all-autobuyers"
        @click="toggleAllAutobuyers"
      >Toggle all ON/OFF</primary-button>
    </div>`
});

Vue.component('infinity-dimension-row', {
  props: {
    tier: Number
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      hasRateOfChange: false,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAffordable: false,
      isCapped: false,
      capIP: new Decimal(0),
      autobuyers: player.infDimBuyers
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    rateOfChangeDisplay: function() {
      return this.hasRateOfChange ?
        ` (+${this.shorten(this.rateOfChange)}%/s)` :
        String.empty;
    },
    costDisplay: function() {
      return this.isCapped ? "Capped!" : `Cost: ${this.shortenCosts(this.cost)} IP`;
    },
    hardcapPurchases: function() {
      return this.shortenCosts(HARDCAP_ID_PURCHASES);
    },
    capTooltip: function() {
      return this.isCapped ?
        `Limited to ${this.hardcapPurchases} upgrades (${this.shortenCosts(this.capIP)} IP)`:
        undefined;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      const isUnlocked = dimension.isUnlocked;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      const hasRateOfChange = dimension.hasRateOfChange;
      this.hasRateOfChange = hasRateOfChange;
      if (hasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = dimension.isAutobuyerUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = dimension.isAffordable;
      const isCapped = dimension.isCapped;
      this.isCapped = isCapped;
      if (isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
      }
    },
    buyManyInfinityDimension: function() {
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
        v-if="isAutobuyerUnlocked"
        v-model="autobuyers[tier - 1]"
        class="c-primary-btn--id-autobuyer"
        text="Auto:"
      />
      <primary-button
        v-tooltip="capTooltip"
        :enabled="isAffordable"
        class="c-primary-btn--buy-id"
        @click="buyManyInfinityDimension"
      >{{costDisplay}}</primary-button>
    </div>`,
});