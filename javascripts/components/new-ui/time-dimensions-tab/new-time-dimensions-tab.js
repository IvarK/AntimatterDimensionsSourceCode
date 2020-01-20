"use strict";

Vue.component("new-time-dimensions-tab", {
  data() {
    return {
      totalUpgrades: 0,
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      showCostScaleTooltip: false,
      areAutobuyersUnlocked: false
    };
  },
  computed: {
    totalUpgradesDisplay() {
      return formatWithCommas(this.totalUpgrades);
    },
    e6000Tooltip() {
      return "TD costs start increasing faster after " + format("1e6000", 2, 0);
    },
    costScaleTooltip() {
      return this.showCostScaleTooltip ? this.e6000Tooltip : undefined;
    }
  },
  methods: {
    update() {
      this.totalUpgrades = player.totalTickGained;
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(player.timeShards);
      this.upgradeThreshold.copyFrom(player.tickThreshold);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Eighth Infinity Dimensions" : "time shards";
      this.showCostScaleTooltip = player.eternityPoints.exponent > 6000;
      this.areAutobuyersUnlocked = RealityUpgrade(13).isBought;
    },
    maxAll() {
      buyMaxTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  },
  template:
    `<div class="l-time-dim-tab l-centered-vertical-tab">
      <div>
        <p>You've gained {{totalUpgradesDisplay}} tickspeed upgrades.</p>
        <p>
          You have
          <span class="c-time-dim-description__accent">{{format(timeShards, 2, 1)}}</span> time shards.
          Next tickspeed upgrade at
          <span class="c-time-dim-description__accent">{{format(upgradeThreshold, 2, 1)}}.</span>
        </p>
      </div>
      <div>
        Each additional upgrade requires {{formatX(multPerTickspeed, 2, 2)}} more time shards. This will start
        increasing above {{formatInt(tickspeedSoftcap)}} upgrades.
      </div>
      <div>You are getting {{format(shardsPerSecond, 2, 0)}} {{incomeType}} per second.</div>
      <primary-button
        v-tooltip="costScaleTooltip"
        class="o-primary-btn--buy-max l-time-dim-tab__buy-max"
        @click="maxAll"
      >Max all</primary-button>
      <div class="l-time-dim-tab__row-container">
        <new-time-dimension-row
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
