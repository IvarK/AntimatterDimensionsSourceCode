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
    maxAll: function() {
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers: function() {
      toggleAllInfDims();
    },
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
      this.isAnyAutobuyerUnlocked = player.eternities > 10;
    }
  },
  template:
    `<div>
      <div>
        <p>You have <span id="infPowAmount" class="infinity-power">{{shortenMoney(infinityPower)}}</span> infinity power. translated to <span id="infDimMultAmount" class="infinity-power">{{shortenMoney(dimMultiplier)}}</span>x multiplier on all dimensions</p>
      </div>
      <div>You are getting {{shortenDimensions(powerPerSecond)}} {{incomeType}} per second.</div>
      <store-button fontSize="12px" @click="maxAll">Max all</store-button>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <infinity-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier">
        </infinity-dimension-row>
      </div>
      <div v-if="isEC8Running" style="margin-top: 10px">You have {{EC8PurchasesLeft}} purchases left.</div>
      <store-button
        fontSize="12px"
        style="width:140px; height: 30px; margin-top: 10px"
        v-if="isAnyAutobuyerUnlocked"
        @click="toggleAllAutobuyers">
        Toggle all ON/OFF
      </store-button>
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
      tier8HasRateOfChange: false,
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
      return this.tier < 8 || this.tier8HasRateOfChange ?
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
    buyManyInfinityDimension: function() {
      buyManyInfinityDimension(this.tier);
    },
    update() {
      const tier = this.tier;
      const isUnlocked = player.infDimensionsUnlocked[tier - 1];
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      const dimension = InfinityDimension(tier);
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      let tier8HasRateOfChange = tier === 8 && ECTimesCompleted("eterc7") > 0;
      if (tier === 8) {
        this.tier8HasRateOfChange = tier8HasRateOfChange;
      }
      if (tier < 8 || tier8HasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = player.eternities >= 10 + tier;
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = player.infinityPoints.gte(dimension.cost);
      const isCapped = tier < 8 && dimension.baseAmount >= HARDCAP_ID_BASE_AMOUNT;
      this.isCapped = isCapped;
      if (isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
      }
    }
  },
  template:
    `<div class="infinity-dimension-row" v-show="isUnlocked">
      <div style="width: 41%; text-align: left">
        {{name}} Infinity Dimension x{{shortenMoney(multiplier)}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{shortenDimensions(amount)}} ({{bought}}){{rateOfChangeDisplay}}
      </div>
      <store-button-named-on-off
        fontSize="10px"
        style="width:70px; margin-right: 16px"
        text="Auto:"
        v-model="autobuyers[tier - 1]"
        v-if="isAutobuyerUnlocked">
      </store-button-named-on-off>
      <store-button
        style="color:black; width:195px; height:30px"
        :enabled="isAffordable"
        v-tooltip="capTooltip"
        @click="buyManyInfinityDimension">
        {{costDisplay}}
      </store-button>
    </div>`,
});