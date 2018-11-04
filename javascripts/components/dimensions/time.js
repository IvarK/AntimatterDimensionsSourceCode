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
    update() {
      this.totalUpgrades = player.totalTickGained;
      this.timeShards.copyFrom(player.timeShards);
      this.upgradeThreshold.copyFrom(player.tickThreshold);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerSecond);
      const isEC7Running = player.currentEternityChall === "eterc7";
      this.incomeType = isEC7Running ? "Eighth Infinity Dimensions" : "Timeshards";
      this.showCostScaleTooltip = player.eternityPoints.exponent > 6000;
      this.areAutobuyersUnlocked = player.reality.upg.includes(13);
    },
    maxAll: function() {
      buyMaxTimeDimensions();
    },
    toggleAllAutobuyers: function() {
      toggleAllTimeDims();
    }
  },
  template:
    `<div class="l-time-dim-tab l-centered-vertical-tab">
      <div>
        <p>You've gained {{totalUpgradesDisplay}} tickspeed upgrades.</p>
        <p>
          You have
          <span class="c-time-dim-description__accent">{{shortenMoney(timeShards)}}</span> time shards.
          Next tickspeed upgrade at <span class="c-time-dim-description__accent">{{shortenMoney(upgradeThreshold)}}</span>
        </p>
      </div>      
      <div>You are getting {{shortenDimensions(shardsPerSecond)}} {{incomeType}} per second.</div>
      <primary-button
        v-tooltip="costScaleTooltip"
        class="o-primary-btn--buy-max l-time-dim-tab__buy-max"
        @click="maxAll"
      >Max all</primary-button>
      <div class="l-time-dim-tab__row-container">
        <time-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :areAutobuyersUnlocked="areAutobuyersUnlocked"
        />
      </div>
      <primary-button
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--td-all-autobuyers l-time-dim-tab__all-autobuyers"
        @click="toggleAllAutobuyers"
      >Toggle all ON/OFF</primary-button>
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
    },
    buyTimeDimension: function() {
      buyTimeDimension(this.tier);
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-time-dim-row">
      <div
        class="c-time-dim-row__label c-time-dim-row__name"
      >{{name}} Time Dimension x{{shortenMoney(multiplier)}}</div>
      <div
        class="c-time-dim-row__label c-time-dim-row__label--growable"
      >{{shortenDimensions(amount)}}{{rateOfChangeDisplay}}</div>
      <primary-button-on-off
        v-if="areAutobuyersUnlocked"
        v-model="autobuyers[tier - 1]"
        class="o-primary-btn--td-autobuyer c-time-dim-row__button"
        text="Auto:"
      />
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-td c-time-dim-row__button"
        @click="buyTimeDimension"
      >Cost: {{shortenDimensions(cost)}} EP</primary-button>
    </div>`,
});