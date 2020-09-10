"use strict";

Vue.component("time-dim-tab", {
  data() {
    return {
      totalUpgrades: 0,
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.totalUpgrades = player.totalTickGained;
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(player.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(player.timeShards).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Eighth Infinity Dimensions" : "Time Shards";
      this.areAutobuyersUnlocked = RealityUpgrade(13).isBought;
    },
    maxAll() {
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  },
  template: `
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <primary-button
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >Max all</primary-button>
      <primary-button
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >Toggle all autobuyers</primary-button>
    </div>
    <div>
      <p>You've gained {{formatInt(totalUpgrades)}} Tickspeed upgrades.</p>
      <p>
        You have
        <span class="c-time-dim-description__accent">{{format(timeShards, 2, 1)}}</span> Time Shards.
        Next Tickspeed upgrade at
        <span class="c-time-dim-description__accent">{{format(upgradeThreshold, 2, 1)}}.</span>
      </p>
    </div>
    <div>
      Each additional upgrade requires {{formatX(multPerTickspeed, 2, 2)}} more Time Shards. This will start
      increasing above {{formatInt(tickspeedSoftcap)}} upgrades.
    </div>
    <div>You are getting {{format(shardsPerSecond, 2, 0)}} {{incomeType}} per second.</div>
    <div class="l-dimensions-container">
      <time-dim-row
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :areAutobuyersUnlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Time Dimension costs jump at {{format(costIncreases[0], 2, 2)}} and
      {{format(costIncreases[1])}} Eternity Points,
      <br>
      and costs increase much faster after {{format(costIncreases[2])}} Eternity Points.
    </div>
  </div>`
});
