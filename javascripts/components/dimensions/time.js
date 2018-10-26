Vue.component('dimensions-time', {
  props: {
    model: Object,
    view: Object
  },
  computed: {
    player: function() {
      return this.model.player;
    },
    dimensions: function() {
      return this.view.tabs.dimensions.time;
    },
    totalUpgrades: function() {
      return formatWithCommas(this.player.totalTickGained);
    },
    timeShards: function() {
      return this.dimensions.timeShards;
    },
    upgradeThreshold: function() {
      // updates infrequently, no need to inline
      return shortenMoney(this.player.tickThreshold);
    },
    isEC7Running: function() {
      return this.player.currentEternityChall === "eterc7";
    },
    incomeType: function() {
      return this.isEC7Running ? "Eighth Infinity Dimensions" : "Timeshards";
    },
    shardsPerSecond: function() {
      return this.dimensions.shardsPerSecond;
    },
    e6000Tooltip: function() {
      return "TD costs start increasing faster after " + shortenDimensions(new Decimal("1e6000"));
    },
    costScaleTooltip: function() {
      return this.player.eternityPoints.exponent > 6000 ? this.e6000Tooltip : undefined;
    },
    areAutobuyersUnlocked: function() {
      return this.player.reality.upg.includes(13);
    }
  },
  methods: {
    maxAll: function() {
      buyMaxTimeDimensions();
    },
    toggleAllAutobuyers: function() {
      toggleAllTimeDims();
    }
  },
  template:
    `<div>
      <div>
        <p>You've gained {{totalUpgrades}} tickspeed upgrades.</p>
        <p>You have <span id="timeShardAmount" class="time-shards">{{timeShards}}</span> time shards. Next tickspeed upgrade at <span id="tickThreshold" class="time-shards">{{upgradeThreshold}}</span></p>
      </div>      
      <div>You are getting {{shardsPerSecond}} {{incomeType}} per second.</div>
      <store-button fontSize="12px" v-tooltip="costScaleTooltip" @click="maxAll">Max all</store-button>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <time-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :player="player"
          :dimension="dimensions.dims[tier]"
          :areAutobuyersUnlocked="areAutobuyersUnlocked">
        </time-dimension-row>
      </div>
      <store-button
        fontSize="12px"
        style="width:140px; height: 30px"
        v-if="areAutobuyersUnlocked"
        @click="toggleAllAutobuyers">
        Toggle all ON/OFF
      </store-button>
    </div>`
});

Vue.component('time-dimension-row', {
  props: {
    player: Object,
    dimension: Object,
    tier: Number,
    areAutobuyersUnlocked: Boolean
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    multiplier: function() {
      return this.dimension.multiplier;
    },
    amount: function() {
      return this.dimension.amount;
    },
    rateOfChange: function() {
      return this.tier < 8 ? ` (+${this.dimension.rateOfChange}%/s)` : String.empty;
    },
    isAvailable: function() {
      return this.dimension.isAvailable;
    },
    autobuyerState: function() {
      return this.player.reality.tdbuyers[this.tier - 1];
    },
    cost: function() {
      return this.dimension.cost;
    },
    isAffordable: function() {
      return this.dimension.isAffordable;
    }
  },
  methods: {
    buyTimeDimension: function() {
      buyTimeDimension(this.tier);
    }
  },
  template:
    `<div class="time-dimension-row" v-show="isAvailable">
      <div style="width: 43%; text-align: left">
        {{name}} Time Dimension x{{multiplier}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{amount}} {{rateOfChange}}
      </div>
      <store-button-named-on-off
        fontSize="10px"
        style="width:70px; margin-right: 16px" 
        text="Auto:"
        v-model="player.reality.tdbuyers[tier - 1]"
        v-if="areAutobuyersUnlocked">
      </store-button-named-on-off>
      <store-button
        style="color:black; width:195px; height:30px"
        :enabled="isAffordable"
        @click="buyTimeDimension">
        Cost: {{cost}} EP
      </store-button>
    </div>`,
});