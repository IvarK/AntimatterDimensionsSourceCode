"use strict";

Vue.component("replicanti-gain-text", {
  data() {
    return {
      remainingTimeText: "",
      galaxyText: ""
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
        this.remainingTimeText = `You are gaining ${formatX(gainFactorPerSecond, 2, 1)} Replicanti per second` +
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

      const galaxiesPerSecond = log10GainFactorPerTick.times(ticksPerSecond / LOG10_MAX_VALUE);
      const timeFromZeroRG = galaxies => 50 * Math.log((galaxies + 49.5) / 49.5);
      let baseGalaxiesPerSecond, effectiveMaxRG, effectiveCurrentRG;
      if (RealityUpgrade(6).isBought) {
        baseGalaxiesPerSecond = galaxiesPerSecond.divide(RealityUpgrade(6).effectValue);
        effectiveMaxRG = timeFromZeroRG(Replicanti.galaxies.max + Replicanti.galaxies.extra) -
          timeFromZeroRG(Replicanti.galaxies.extra);
        effectiveCurrentRG = timeFromZeroRG(Replicanti.galaxies.bought + Replicanti.galaxies.extra) -
          timeFromZeroRG(Replicanti.galaxies.extra);
      } else {
        baseGalaxiesPerSecond = galaxiesPerSecond;
        effectiveMaxRG = Replicanti.galaxies.max;
        effectiveCurrentRG = Replicanti.galaxies.bought;
      }
      
      if (remainingTime === 0) {
        this.remainingTimeText = "At Infinite Replicanti";
      } else {
        this.remainingTimeText = `${TimeSpan.fromSeconds(remainingTime)} remaining until Infinite Replicanti`;
      }
      
      // If the player can get RG, this text is redundant with text below.
      if (Replicanti.galaxies.max === 0) {
        this.remainingTimeText += ` (${TimeSpan.fromSeconds(totalTime)} total)`;
      }

      if (Replicanti.galaxies.max > 0) {
        this.galaxyText = `You are gaining a Replicanti Galaxy every ${TimeSpan.fromSeconds(totalTime)}`;
        if (galaxiesPerSecond.gte(1)) {
          this.galaxyText = `You are gaining ${format(galaxiesPerSecond, 2, 1)} Replicanti
          ${pluralize("Galaxy", galaxiesPerSecond, "Galaxies")} per second`;
        }
        // Take the total time from zero replicanti to max RG + e308 replicanti and then subtract away the time which
        // has already elapsed. The time elapsed is calculated from your current RG total (including the current one)
        // and then subtracts away the time spent in the current RG so far.
        const allGalaxyTime = Decimal.divide(effectiveMaxRG - effectiveCurrentRG, baseGalaxiesPerSecond).toNumber();
        const thisGalaxyTime = baseGalaxiesPerSecond.reciprocal().toNumber() - remainingTime;
        this.galaxyText += ` (all Replicanti Galaxies within 
          ${TimeSpan.fromSeconds(Math.clampMin(allGalaxyTime - thisGalaxyTime, 0))})`;
      } else {
        this.galaxyText = ``;
      }
    }
  },
  template: `<p>{{ remainingTimeText }}<br>{{ galaxyText }}</p>`
});
