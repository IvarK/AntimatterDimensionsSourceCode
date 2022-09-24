<script>
import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "HeaderTickspeedInfo",
  components: {
    GameSpeedDisplay
  },
  data() {
    return {
      mult: new Decimal(0),
      tickspeed: new Decimal(0),
      galaxyCount: 0,
      purchasedTickspeed: 0,
      freeTickspeed: 0,
    };
  },
  computed: {
    tickspeedDisplay() {
      return `Total Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    perUpgrade() {
      if (InfinityChallenge(3).isRunning) return `Tickspeed upgrades give
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)} to all ADs`;
      return `ADs produce ${formatX(this.mult.reciprocal(), 2, 3)} faster per Tickspeed upgrade`;
    },
    upgradeCount() {
      const upgrades = [];
      if (this.purchasedTickspeed) upgrades.push(`${formatInt(this.purchasedTickspeed)} Purchased`);
      if (this.freeTickspeed) upgrades.push(`${formatInt(this.freeTickspeed)} Free`);

      switch (upgrades.length) {
        case 0:
          return "You have no Tickspeed Upgrades";
        case 1:
          return `You have ${upgrades[0]} Tickspeed Upgrades`;
        case 2:
          return `Upgrades: ${upgrades.join(" + ")}`;
        default:
          return "";
      }
    }
  },
  methods: {
    update() {
      this.mult.copyFrom(Tickspeed.multiplier);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount = player.galaxies;
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
    },
  },
};
</script>

<template>
  <div>
    <br>
    {{ perUpgrade }}
    <br>
    {{ upgradeCount }}
    <br>
    {{ tickspeedDisplay }}
    <br>
    <GameSpeedDisplay />
  </div>
</template>

<style scoped>

</style>
