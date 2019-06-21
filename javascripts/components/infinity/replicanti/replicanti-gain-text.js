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
      const logGainFactorPerTick = Decimal.divide(getGameSpeedupFactor() * updateRateMs *
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval()).toNumber();
      const log10GainFactorPerTick = logGainFactorPerTick / Math.LN10;
      if (TimeStudy(192).isBought && player.replicanti.amount.log10() > 308) {
        const postScale = Math.log10(ReplicantiGrowth.SCALE_FACTOR) / ReplicantiGrowth.SCALE_LOG10;
        const gainFactorPerSecond = Decimal.pow(
          logGainFactorPerTick * postScale + 1,
          ticksPerSecond / postScale
        );
        // The calculations to estimate time to next thousand OOM (eg. e18000, e19000, etc.) assumes that uncapped
        // replicanti growth scales as time^1/postScale, which turns out to be a reasonable approximation.
        const nextThousandOOM = Decimal.pow10(1000 * Math.floor(player.replicanti.amount.log10() / 1000 + 1));
        const coeff = Decimal.divide(updateRateMs / 1000, Decimal.exp(logGainFactorPerTick).pow(postScale).minus(1));
        const timeToThousand = coeff.times(nextThousandOOM.divide(player.replicanti.amount).pow(postScale).minus(1));
        this.text = `You are gaining x${shorten(gainFactorPerSecond, 2, 1)} Replicanti per second` +
          ` (${TimeSpan.fromSeconds(timeToThousand.toNumber())} until ${shorten(nextThousandOOM)})`;
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