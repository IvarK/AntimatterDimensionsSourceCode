Vue.component('dimensions-infinity', {
  props: {
    model: Object,
    view: Object
  },
  computed: {
    player: function() {
      return this.model.player;
    },
    dimensions: function() {
      return this.view.tabs.dimensions.infinity;
    },
    infinityPower: function() {
      return shortenMoney(this.player.infinityPower);
    },
    dimMultiplier: function() {
      return shortenMoney(this.dimensions.multiplier);
    },
    powerPerSecond: function() {
      return shortenDimensions(this.dimensions.powerPerSecond);
    },
    isEC7Running: function() {
      return this.player.currentEternityChall === "eterc7";
    },
    incomeType: function() {
      return this.isEC7Running ? "Seventh Dimensions" : "Infinity Power";
    },
    isEC8Running: function() {
      return this.player.currentEternityChall === "eterc8";
    },
    isAnyAutobuyerUnlocked: function() {
      return this.player.eternities > 10;
    }
  },
  methods: {
    maxAll: function() {
      buyMaxInfinityDimensions();
    },
    toggleAllAutobuyers: function() {
      toggleAllInfDims();
    }
  },
  template:
    `<div>
      <div>
        <p>You have <span id="infPowAmount" class="infinity-power">{{infinityPower}}</span> infinity power. translated to <span id="infDimMultAmount" class="infinity-power">{{dimMultiplier}}</span>x multiplier on all dimensions</p>
      </div>      
      <div>You are getting {{powerPerSecond}} {{incomeType}} per second.</div>
      <store-button fontSize="12px" @click="maxAll">Max all</store-button>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <infinity-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :player="player"
          :dimension="dimensions.dims[tier]">
        </infinity-dimension-row>
      </div>
      <div v-if="isEC8Running">You have {{player.eterc8ids}} purchases left.</div>
      <store-button
        fontSize="12px"
        style="width:140px; height: 30px"
        v-if="isAnyAutobuyerUnlocked"
        @click="toggleAllAutobuyers">
        Toggle all ON/OFF
      </store-button>
    </div>`
});

Vue.component('infinity-dimension-row', {
  props: {
    player: Object,
    dimension: Object,
    tier: Number
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    statsId: function() {
      return `infinityDimension${this.tier}`;
    },
    stats: function() {
      return this.player[this.statsId];
    },
    multiplier: function() {
      return shortenMoney(this.dimension.multiplier);
    },
    amount: function() {
      return shortenDimensions(this.stats.amount);
    },
    bought: function() {
      return this.stats.bought;
    },
    rateOfChange: function() {
      return this.tier < 8 || ECTimesCompleted("eterc7") > 0 ?
        `(+${shorten(this.dimension.rateOfChange)}%/s)` :
        String.empty;
    },
    cost: function() {
      return this.dimension.isCapped ? "Capped!" : `Cost: ${shortenCosts(this.stats.cost)} IP`;
    },
    hardcapAmount: function() {
      return shortenCosts(hardcapIDPurchases);
    },
    capTooltip: function() {
      return this.dimension.isCapped ?
        `Limited to ${this.hardcapAmount} upgrades (${shortenCosts(this.dimension.capIP)} IP)`:
        undefined;
    },
    isAffordable: function() {
      return this.player.infinityPoints.gte(this.stats.cost);
    },
    isAvailable: function() {
      return this.dimension.isAvailable;
    },
    isAutobuyerUnlocked: function() {
      return this.player.eternities >= 10 + this.tier;
    }
  },
  methods: {
    buyManyInfinityDimension: function() {
      buyManyInfinityDimension(this.tier);
    }
  },
  template:
    `<div class="infinity-dimension-row" v-show="isAvailable">
      <div style="width: 41%; text-align: left">
        {{name}} Infinity Dimension x{{multiplier}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{amount}} ({{bought}}) {{rateOfChange}}
      </div>
      <store-button-named-on-off
        fontSize="10px"
        style="width:70px; margin-right: 16px" 
        text="Auto:"
        v-model="player.infDimBuyers[tier - 1]"
        v-if="isAutobuyerUnlocked">
      </store-button-named-on-off>
      <store-button
        style="color:black; width:195px; height:30px"
        :enabled="isAffordable"
        v-tooltip="capTooltip"
        @click="buyManyInfinityDimension">
        {{cost}}
      </store-button>
    </div>`,
});