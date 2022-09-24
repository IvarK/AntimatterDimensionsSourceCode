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
    };
  },
  computed: {
    tickspeedDisplay() {
      return `AD Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    perUpgrade() {
      if (InfinityChallenge(3).isRunning) return `Tickspeed upgrades give
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)} to all ADs`;
      return `${formatX(this.mult.reciprocal(), 2, 3)} faster per upgrade`;
    }
  },
  methods: {
    update() {
      this.mult.copyFrom(Tickspeed.multiplier);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount = player.galaxies;
    },
  },
};
</script>

<template>
  <div>
    <br>
    {{ tickspeedDisplay }}
    <br>
    {{ perUpgrade }}
    <br>
    <GameSpeedDisplay />
  </div>
</template>

<style scoped>

</style>
