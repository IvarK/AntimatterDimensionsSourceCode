"use strict";

Vue.component("replicanti-gain-text", {
  data() {
    return {
      galaxyText: "",
      replicantiText: ""
    };
  },
  methods: {
    update() {
      const updateRateMs = player.options.updateRate;
      const ticksPerSecond = 1000 / updateRateMs;
      const logGainFactorPerTick = Decimal.divide(getGameSpeedupForDisplay() * updateRateMs *
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval());
      const log10GainFactorPerTick = logGainFactorPerTick.dividedBy(Math.LN10);
      const replicantiAmount = player.replicanti.amount;

      if (TimeStudy(192).isBought && replicantiAmount.log10() > 308) {
        const postScale = Math.log10(ReplicantiGrowth.scaleFactor) / ReplicantiGrowth.scaleLog10;
        const gainFactorPerSecond = logGainFactorPerTick
          .times(postScale)
          .plus(1)
          .pow(ticksPerSecond / postScale);
        // The calculations to estimate time to next thousand OOM (eg. e18000, e19000, etc.) assumes that uncapped
        // replicanti growth scales as time^1/postScale, which turns out to be a reasonable approximation.
        const nextThousandOOM = Decimal.pow10(1000 * Math.floor(replicantiAmount.log10() / 1000 + 1));
        const coeff = Decimal.divide(updateRateMs / 1000, logGainFactorPerTick.exp().pow(postScale).minus(1));
        const timeToThousand = coeff.times(nextThousandOOM.divide(replicantiAmount).pow(postScale).minus(1));
        // The calculation seems to choke and return zero if the time is too large, probably because of rounding issues
        const timeEstimateText = timeToThousand.eq(0)
          ? "an extremely long time"
          : `${TimeSpan.fromSeconds(timeToThousand.toNumber())}`;
        this.replicantiText = `You are gaining ${formatX(gainFactorPerSecond, 2, 1)} Replicanti per second` +
          ` (${timeEstimateText} until ${format(nextThousandOOM)})`;
        return;
      }

      const totalTime = LOG10_MAX_VALUE / (ticksPerSecond * log10GainFactorPerTick.toNumber());
      let remainingTime = (LOG10_MAX_VALUE - replicantiAmount.log10()) /
        (ticksPerSecond * log10GainFactorPerTick.toNumber());
      if (remainingTime < 0) {
        // If the cap is raised via Effarig Infinity but the player doesn't have TS192, this will be a negative number
        remainingTime = 0;
      }

      const galaxiesPerSecond = log10GainFactorPerTick.times(ticksPerSecond / 308);
        let baseGalaxiesPerSecond, effectiveMaxRG;
        if (RealityUpgrade(6).isBought) {
          baseGalaxiesPerSecond = galaxiesPerSecond.divide(RealityUpgrade(6).effectValue);
          effectiveMaxRG = 50 * Math.log((Replicanti.galaxies.max + 49.5) / 49.5);
        } else {
          baseGalaxiesPerSecond = galaxiesPerSecond;
          effectiveMaxRG = Replicanti.galaxies.max;
      }
      const allGalaxyTime = Decimal.divide(effectiveMaxRG, baseGalaxiesPerSecond).toNumber();

      this.replicantiText = `${TimeSpan.fromSeconds(remainingTime)} until Infinite Replicanti`;
      if (effectiveMaxRG >= 1 && ReplicantiUpgrade.galaxies.isAutobuyerOn) {
        this.galaxyText = `You gain a galaxy every ${TimeSpan.fromSeconds(totalTime)}`;
        if (galaxiesPerSecond.gte(1)) {
          this.galaxyText = `You are gaining ${format(galaxiesPerSecond, 2, 1)} galaxies per second`;
        }
        this.galaxyText += ` (all galaxies within ${TimeSpan.fromSeconds(allGalaxyTime)})`;
      } else {
        this.replicantiText += ` (${TimeSpan.fromSeconds(totalTime)} total time until Infinite Replicanti)`;
      }
    }
  },
  template: `<p>{{replicantiText}}<br>{{galaxyText}}</p>`
});
