"use strict";

Vue.component("replicanti-gain-text", {
  data() {
    return {
      text: ""
    };
  },
  methods: {
    update() {
      const updateRateMs = player.options.updateRate;
      const ticksPerSecond = 1000 / updateRateMs;
      const logGainFactorPerTick = getGameSpeedupFactor() / ticksPerSecond *
        (Math.log(player.replicanti.chance + 1) * 1000 / getReplicantiInterval());
      const log10GainFactorPerTick = logGainFactorPerTick / Math.LN10;
      if (TimeStudy(192).isBought && player.replicanti.amount.log10() > 308) {
        const postScale = Math.log10(ReplicantiGrowth.SCALE_FACTOR) / ReplicantiGrowth.SCALE_LOG10;
        const factorGainPerSecond = Decimal.pow(
          logGainFactorPerTick * postScale + 1,
          ticksPerSecond / postScale
        );
        this.text = `You are gaining x${shorten(factorGainPerSecond, 2, 1)} Replicanti per second`;
        return;
      }
      if (log10GainFactorPerTick > 308) {
        const galaxiesPerSecond = ticksPerSecond * log10GainFactorPerTick / 308;
        const baseGalaxiesPerSecond = galaxiesPerSecond / RealityUpgrade(6).effectValue;
        const effectiveMaxRG = RealityUpgrade(6).isBought
          ? 50 * Math.log((Replicanti.galaxies.max + 49.5) / 49.5)
          : Replicanti.galaxies.max;
        this.text = `You are gaining ${shorten(galaxiesPerSecond, 2, 1)} galaxies per second` +
          ` (all galaxies within ${TimeSpan.fromSeconds(effectiveMaxRG / baseGalaxiesPerSecond)})`;
        return;
      }
      const totalTime = Math.log10(Number.MAX_VALUE) / (ticksPerSecond * log10GainFactorPerTick);
      let remainingTime = (Math.log10(Number.MAX_VALUE) - player.replicanti.amount.log10()) /
        (ticksPerSecond * log10GainFactorPerTick);
      if (remainingTime < 0) {
        // If the cap is raised via Effarig Infinity but the player doesn't have TS192, this will be a negative number
        remainingTime = 0;
      }
      this.text = `${TimeSpan.fromSeconds(remainingTime)} until Infinite Replicanti` +
        ` (${TimeSpan.fromSeconds(totalTime)} total)`;
    }
  },
  template: `<p>{{text}}</p>`
});