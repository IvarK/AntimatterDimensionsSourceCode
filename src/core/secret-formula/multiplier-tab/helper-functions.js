import { DC } from "../../constants";

export const MultiplierTabHelper = {
  // Helper method for counting enabled dimensions
  activeDimCount(type) {
    switch (type) {
      case "AD":
        // Technically not 100% correct, but within EC7 any AD8 production is going to be irrelevant compared to AD7
        // and making the UI behave as if it's inactive produces a better look overall
        return Math.clamp(AntimatterDimensions.all.filter(ad => ad.isProducing).length,
          1, EternityChallenge(7).isRunning ? 7 : 8);
      case "ID":
        return InfinityDimensions.all.filter(id => id.isProducing).length;
      case "TD":
        return TimeDimensions.all.filter(td => td.isProducing).length;
      default:
        throw new Error("Unrecognized Dimension type in Multiplier tab GameDB entry");
    }
  },

  // Helper method for galaxy strength multipliers affecting all galaxy types (this is used a large number of times)
  globalGalaxyMult() {
    return Effects.product(
      InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.galaxyBoost.chargedEffect,
      BreakInfinityUpgrade.galaxyBoost,
      TimeStudy(212),
      TimeStudy(232),
      Achievement(86),
      Achievement(178),
      InfinityChallenge(5).reward,
      PelleUpgrade.galaxyPower,
      PelleRifts.decay.milestones[1]
    ) * Pelle.specialGlyphEffect.power;
  },

  // Helper method for galaxies and tickspeed, broken up as contributions of tickspeed*log(perGalaxy) and galaxyCount to
  // their product, which is proportional to log(tickspeed)
  decomposeTickspeed() {
    let effectiveCount = effectiveBaseGalaxies();
    const effects = this.globalGalaxyMult();

    let galFrac, tickFrac;
    if (effectiveCount < 3) {
      let baseMult = 1.1245;
      if (player.galaxies === 1) baseMult = 1.11888888;
      if (player.galaxies === 2) baseMult = 1.11267177;
      if (NormalChallenge(5).isRunning) {
        baseMult = 1.08;
        if (player.galaxies === 1) baseMult = 1.07632;
        if (player.galaxies === 2) baseMult = 1.072;
      }
      // This is needed for numerical consistency with the other conditional case
      baseMult /= 0.965 ** 2;
      const logBase = Math.log10(baseMult);

      const perGalaxy = 0.02 * effects;
      effectiveCount *= Pelle.specialGlyphEffect.power;

      tickFrac = Tickspeed.totalUpgrades * logBase;
      galFrac = -Math.log10(Math.max(0.01, 1 / baseMult - (effectiveCount * perGalaxy))) / logBase;
    } else {
      effectiveCount -= 2;
      effectiveCount *= effects;
      effectiveCount *= getAdjustedGlyphEffect("realitygalaxies") * (1 + ImaginaryUpgrade(9).effectOrDefault(0));
      effectiveCount *= Pelle.specialGlyphEffect.power;

      // These all need to be framed as INCREASING x/sec tick rate (ie. all multipliers > 1, all logs > 0)
      const baseMult = 0.965 ** 2 / (NormalChallenge(5).isRunning ? 0.83 : 0.8);
      const logBase = Math.log10(baseMult);
      const logPerGalaxy = -DC.D0_965.log10();

      tickFrac = Tickspeed.totalUpgrades * logBase;
      galFrac = (1 + effectiveCount / logBase * logPerGalaxy);
    }

    // Artificially inflate the galaxy portion in order to make the breakdown closer to 50/50 in common situations
    galFrac *= 3;

    // Calculate what proportion base tickspeed takes out of the entire tickspeed multiplier
    const base = DC.D1.dividedByEffectsOf(
      Achievement(36),
      Achievement(45),
      Achievement(66),
      Achievement(83)
    );
    let baseFrac = base.log10() / Tickspeed.perSecond.log10();

    // We want to make sure to zero out components in some edge cases
    if (base.eq(1)) baseFrac = 0;
    if (effectiveCount === 0) galFrac = 0;

    // Normalize the sum by splitting tickspeed and galaxies across what's leftover besides the base value. These three
    // values must be scaled so that they sum to 1 and none are negative
    let factor = (1 - baseFrac) / (tickFrac + galFrac);
    // The actual base tickspeed calculation multiplies things in a different order, which can lead to precision issues
    // when no tickspeed upgrades have been bought if we don't explicitly set this to zero
    if (Tickspeed.totalUpgrades === 0) factor = 0;
    return {
      base: baseFrac,
      tickspeed: tickFrac * factor,
      galaxies: galFrac * factor,
    };
  },

  // Helper method to check for whether an achievement affects a particular dimension or not. Format of dimStr is
  // expected to be a three-character string "XXN", eg. "AD3" or "TD2"
  achievementDimCheck(ach, dimStr) {
    switch (ach) {
      case 23:
        return dimStr === "AD8";
      case 28:
      case 31:
      case 68:
      case 71:
        return dimStr === "AD1";
      case 94:
        return dimStr === "ID1";
      case 34:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 64:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) <= 4;
      default:
        return true;
    }
  },

  // Helper method to check for whether a time study affects a particular dimension or not, see achievementDimCheck()
  timeStudyDimCheck(ts, dimStr) {
    switch (ts) {
      case 11:
        return dimStr === "TD1";
      case 71:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 72:
        return dimStr === "ID4";
      case 73:
        return dimStr === "TD3";
      case 214:
        return dimStr === "AD8";
      case 227:
        return dimStr === "TD4";
      case 234:
        return dimStr === "AD1";
      default:
        return true;
    }
  },

  // Helper method to check for whether an IC reward affects a particular dimension or not, see achievementDimCheck()
  ICDimCheck(ic, dimStr) {
    switch (ic) {
      case 1:
      case 6:
        return dimStr.substr(0, 2) === "ID";
      case 3:
      case 4:
        return dimStr.substr(0, 2) === "AD";
      case 8:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) > 1 && Number(dimStr.charAt(2)) < 8;
      default:
        return false;
    }
  },

  // Helper method to check for whether an EC reward affects a particular dimension or not, see achievementDimCheck()
  ECDimCheck(ec, dimStr) {
    switch (ec) {
      case 1:
      case 10:
        return dimStr.substr(0, 2) === "TD";
      case 2:
        return dimStr === "ID1";
      case 4:
      case 9:
        return dimStr.substr(0, 2) === "ID";
      case 7:
        return dimStr === "ID8";
      default:
        return false;
    }
  },

  blackHoleSpeeds() {
    const currBH = BlackHoles.list
      .filter(bh => bh.isUnlocked)
      .map(bh => (bh.isActive ? bh.power : 1))
      .reduce((x, y) => x * y, 1);

    // Calculate an average black hole speedup factor
    const bh1 = BlackHole(1);
    const bh2 = BlackHole(2);
    const avgBH = 1 + (bh1.isUnlocked ? bh1.dutyCycle * (bh1.power - 1) : 0) +
        (bh2.isUnlocked ? bh1.dutyCycle * bh2.dutyCycle * bh1.power * (bh2.power - 1) : 0);

    return {
      current: currBH,
      average: avgBH
    };
  },

  pluralizeDimensions(dims) {
    return dims === 1 ? "Dimension\xa0" : "Dimensions";
  },

  // All of the following NC12-related functions are to make the parsing within the GameDB entry easier in terms of
  // which set of Dimensions are actually producing within NC12 - in nearly every case, one of the odd/even sets will
  // produce significantly more than the other, so we simply assume the larger one is active and the other isn't
  evenDimNC12Production() {
    const nc12Pow = tier => ([2, 4, 6].includes(tier) ? 0.1 * (8 - tier) : 0);
    const maxTier = Math.clampMin(2 * Math.floor(MultiplierTabHelper.activeDimCount("AD") / 2), 2);
    return AntimatterDimensions.all
      .filter(ad => ad.isProducing && ad.tier % 2 === 0)
      .map(ad => ad.multiplier.times(ad.amount.pow(nc12Pow(ad.tier))))
      .reduce((x, y) => x.times(y), DC.D1)
      .times(AntimatterDimension(maxTier).totalAmount);
  },

  oddDimNC12Production() {
    const maxTier = Math.clampMin(2 * Math.floor(MultiplierTabHelper.activeDimCount("AD") / 2 - 0.5) + 1, 1);
    return AntimatterDimensions.all
      .filter(ad => ad.isProducing && ad.tier % 2 === 1)
      .map(ad => ad.multiplier)
      .reduce((x, y) => x.times(y), DC.D1)
      .times(AntimatterDimension(maxTier).totalAmount);
  },

  actualNC12Production() {
    return Decimal.max(this.evenDimNC12Production(), this.oddDimNC12Production());
  },

  multInNC12(dim) {
    const nc12Pow = tier => ([2, 4, 6].includes(tier) ? 0.1 * (8 - tier) : 0);
    const ad = AntimatterDimension(dim);
    return ad.isProducing ? ad.multiplier.times(ad.totalAmount.pow(nc12Pow(dim))) : DC.D1;
  },

  isNC12ProducingEven() {
    return this.evenDimNC12Production().gt(this.oddDimNC12Production());
  }
};
