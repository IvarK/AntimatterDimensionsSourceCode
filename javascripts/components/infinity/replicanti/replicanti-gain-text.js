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
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval());
      const log10GainFactorPerTick = logGainFactorPerTick.dividedBy(Math.LN10).toNumber();
      const replicantiAmount = player.replicanti.amount;
      if (TimeStudy(192).isBought && replicantiAmount.log10() > 308) {
        const postScale = Math.log10(ReplicantiGrowth.SCALE_FACTOR) / ReplicantiGrowth.SCALE_LOG10;
        const gainFactorPerSecond = logGainFactorPerTick
          .times(postScale)
          .plus(1)
          .pow(ticksPerSecond / postScale)
        );
        // The calculations to estimate time to next thousand OOM (eg. e18000, e19000, etc.) assumes that uncapped
        // replicanti growth scales as time^1/postScale, which turns out to be a reasonable approximation.
        const nextThousandOOM = Decimal.pow10(1000 * Math.floor(replicantiAmount.log10() / 1000 + 1));
        const coeff = Decimal.divide(updateRateMs / 1000, logGainFactorPerTick.exp().pow(postScale).minus(1));
        const timeToThousand = coeff.times(nextThousandOOM.divide(replicantiAmount).pow(postScale).minus(1));
        this.text = `You are gaining ${formatX(gainFactorPerSecond, 2, 1)} Replicanti per second` +
          ` (${TimeSpan.fromSeconds(timeToThousand.toNumber())} until ${shorten(nextThousandOOM)})`;
        return;
      }
      if (log10GainFactorPerTick > 308) {
        const galaxiesPerSecond = ticksPerSecond * log10GainFactorPerTick / 308;
        let baseGalaxiesPerSecond, effectiveMaxRG;
        if (RealityUpgrade(6).isBought) {
          baseGalaxiesPerSecond = galaxiesPerSecond / RealityUpgrade(6).effectValue;
          effectiveMaxRG = 50 * Math.log((Replicanti.galaxies.max + 49.5) / 49.5);
        } else {
          baseGalaxiesPerSecond = galaxiesPerSecond;
          effectiveMaxRG = Replicanti.galaxies.max;
        }
        this.text = `You are gaining ${shorten(galaxiesPerSecond, 2, 1)} galaxies per second` +
          ` (all galaxies within ${TimeSpan.fromSeconds(effectiveMaxRG / baseGalaxiesPerSecond)})`;
        return;
      }
      const totalTime = LOG10_MAX_VALUE / (ticksPerSecond * log10GainFactorPerTick);
      let remainingTime = (LOG10_MAX_VALUE - replicantiAmount.log10()) /
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