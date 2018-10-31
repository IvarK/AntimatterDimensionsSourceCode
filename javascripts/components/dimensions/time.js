Vue.component('dimensions-time', {
  data: function() {
    return {
      totalUpgrades: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: String.empty,
      showCostScaleTooltip: false,
      areAutobuyersUnlocked: false
    };
  },
  computed: {
    totalUpgradesDisplay: function() {
      return formatWithCommas(this.totalUpgrades);
    },
    e6000Tooltip: function() {
      return "TD costs start increasing faster after " + shortenDimensions(new Decimal("1e6000"));
    },
    costScaleTooltip: function() {
      return this.showCostScaleTooltip ? this.e6000Tooltip : undefined;
    }
  },
  methods: {
    maxAll: function() {
      buyMaxTimeDimensions();
    },
    toggleAllAutobuyers: function() {
      toggleAllTimeDims();
    },
    update() {
      this.totalUpgrades = player.totalTickGained;
      this.timeShards.copyFrom(player.timeShards);
      this.upgradeThreshold.copyFrom(player.tickThreshold);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerSecond);
      const isEC7Running = player.currentEternityChall === "eterc7";
      this.incomeType = isEC7Running ? "Eighth Infinity Dimensions" : "Timeshards";
      this.showCostScaleTooltip = player.eternityPoints.exponent > 6000;
      this.areAutobuyersUnlocked = player.reality.upg.includes(13);
    }
  },
  template:
    `<div>
      <div>
        <p>You've gained {{totalUpgradesDisplay}} tickspeed upgrades.</p>
        <p>You have <span id="timeShardAmount" class="time-shards">{{shortenMoney(timeShards)}}</span> time shards. Next tickspeed upgrade at <span id="tickThreshold" class="time-shards">{{shortenMoney(upgradeThreshold)}}</span></p>
      </div>      
      <div>You are getting {{shortenDimensions(shardsPerSecond)}} {{incomeType}} per second.</div>
      <store-button fontSize="12px" v-tooltip="costScaleTooltip" @click="maxAll">Max all</store-button>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <time-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :areAutobuyersUnlocked="areAutobuyersUnlocked">
        </time-dimension-row>
      </div>
      <store-button
        fontSize="12px"
        style="width:140px; height: 30px; margin-top: 10px"
        v-if="areAutobuyersUnlocked"
        @click="toggleAllAutobuyers">
        Toggle all ON/OFF
      </store-button>
    </div>`
});

Vue.component('time-dimension-row', {
  props: {
    tier: Number,
    areAutobuyersUnlocked: Boolean
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      autobuyers: player.reality.tdbuyers
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    rateOfChangeDisplay: function() {
      return this.tier < 8 ?
        ` (+${this.shorten(this.rateOfChange)}%/s)` :
        String.empty;
    }
  },
  methods: {
    buyTimeDimension: function() {
      buyTimeDimension(this.tier);
    },
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      const isUnlocked = dimension.isUnlocked;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAffordable = dimension.isAffordable;
    }
  },
  template:
    `<div class="time-dimension-row" v-show="isUnlocked">
      <div style="width: 43%; text-align: left">
        {{name}} Time Dimension x{{shortenMoney(multiplier)}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{shortenDimensions(amount)}}{{rateOfChangeDisplay}}
      </div>
      <store-button-named-on-off
        fontSize="10px"
        style="width:70px; margin-right: 16px" 
        text="Auto:"
        v-model="autobuyers[tier - 1]"
        v-if="areAutobuyersUnlocked">
      </store-button-named-on-off>
      <store-button
        style="color:black; width:195px; height:30px"
        :enabled="isAffordable"
        @click="buyTimeDimension">
        Cost: {{shortenDimensions(cost)}} EP
      </store-button>
    </div>`,
});