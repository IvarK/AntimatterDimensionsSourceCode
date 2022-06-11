// These "progress stages" are roughly defined in a way to separate different parts of the game where different
// resources are the main indicator of progress. They aren't necessarily equally spaced in time.
const PROGRESS_STAGE = {
  PRE_INFINITY: 0,

  EARLY_INFINITY: 1,
  BREAK_INFINITY: 2,
  REPLICANTI: 3,

  EARLY_ETERNITY: 4,
  ETERNITY_CHALLENGES: 5,
  EARLY_DILATION: 6,
  LATE_ETERNITY: 7,

  EARLY_REALITY: 8,

  TERESA: 9,
  EFFARIG: 10,
  ENSLAVED: 11,
  V: 12,
  RA: 13,
  IMAGINARY_MACHINES: 14,
  LAITELA: 15,
  PELLE: 16,
};

export const ProgressChecker = {
  // Returns an enum in an ordered list defined by certain progress breakpoints in the game
  // Note that cloud saves will have Decimal props stored as Strings which need to be converted
  getProgressStage(save) {
    // Celestials
    const cel = save.celestials;
    if (cel.pelle.doomed) return PROGRESS_STAGE.PELLE;
    if (cel.laitela.quotes.length > 0) return PROGRESS_STAGE.LAITELA;
    if (save.reality.iMCap > 0) return PROGRESS_STAGE.IMAGINARY_MACHINES;
    if (cel.ra.quotes.length > 0) return PROGRESS_STAGE.RA;
    if (cel.v.quotes.length > 0) return PROGRESS_STAGE.V;
    if (cel.enslaved.quotes.length > 0) return PROGRESS_STAGE.ENSLAVED;
    if (cel.effarig.quotes.length > 0) return PROGRESS_STAGE.EFFARIG;
    if (cel.teresa.quotes.length > 0) return PROGRESS_STAGE.TERESA;

    // Reality
    if (save.realities > 0) return PROGRESS_STAGE.EARLY_REALITY;

    // Eternity
    const dilatedTime = new Decimal(save.dilation.dilatedTime);
    if (dilatedTime.gt(1e15)) return PROGRESS_STAGE.LATE_ETERNITY;
    if (dilatedTime.gt(0)) return PROGRESS_STAGE.EARLY_DILATION;
    if (save.eternityChalls.eterc1 > 0) return PROGRESS_STAGE.ETERNITY_CHALLENGES;
    const eternities = new Decimal(save.eternities);
    if (eternities.gt(1000)) return PROGRESS_STAGE.ETERNITY;
    if (eternities.gt(0)) return PROGRESS_STAGE.EARLY_ETERNITY;

    // Infinity
    if (save.replicanti.unl) return PROGRESS_STAGE.REPLICANTI;
    if (save.auto.bigCrunch.interval > 100) return PROGRESS_STAGE.BREAK_INFINITY;
    const infinities = new Decimal(save.infinities);
    if (infinities.gt(0)) return PROGRESS_STAGE.EARLY_INFINITY;

    return PROGRESS_STAGE.PRE_INFINITY;
  },

  // Returns a Number scaled roughly 0-1000 which can be used to compare progress within the same stage. Higher values
  // don't necessarily indicate strictly farther progress when they're close to each other, but the general trend is
  // that 1000 will be approximately "equal to" 0 on the next stage
  // The new Decimal followed by toNumber is effectively using break_infinity to parse a Decimal String for us
  getProgressWithinStage(save) {
    const ip = new Decimal(save.infinityPoints);
    const ep = new Decimal(save.eternityPoints);
    const rm = new Decimal(save.reality.realityMachines);
    const cel = save.celestials;
    switch (this.getProgressStage(save)) {
      case PROGRESS_STAGE.PRE_INFINITY:
        return (330 * save.galaxies) + (20 * save.dimensionBoosts) + (new Decimal(save.antimatter).log10() / 30);

      case PROGRESS_STAGE.EARLY_INFINITY:
        return new Decimal(save.infinities).toNumber();
      case PROGRESS_STAGE.BREAK_INFINITY:
        return 1000 * Math.sqrt(ip.log10() / 145);
      case PROGRESS_STAGE.REPLICANTI:
        return 1000 * Math.sqrt((ip.log10() - 140) / 170);

      case PROGRESS_STAGE.EARLY_ETERNITY:
        return 1000 * Math.sqrt(ep.pLog10() / 18);
      case PROGRESS_STAGE.ETERNITY_CHALLENGES:
        return 8 * Object.values(save.eternityChalls).reduce((sum, c) => sum + c, 0) + 0.4 * ep.log10();
      case PROGRESS_STAGE.EARLY_DILATION:
        return new Decimal(save.dilation.dilatedTime).log10() / 0.015;
      case PROGRESS_STAGE.LATE_ETERNITY:
        return 1000 * Math.sqrt((ep.log10() - 1300) / 6700);

      case PROGRESS_STAGE.EARLY_REALITY:
        return 1000 * Math.sqrt(rm.pLog10() / 6);

      case PROGRESS_STAGE.TERESA:
        return 1000 * Math.log10(1 + cel.teresa.pouredAmount) / 21;
      case PROGRESS_STAGE.EFFARIG:
        return 1000 * Math.log10(1 + cel.effarig.relicShards) / 14;
      case PROGRESS_STAGE.ENSLAVED:
        return 1000 * Math.sqrt((ep.log10() - 30) / 30);
      case PROGRESS_STAGE.V:
        return 27.7 * Object.values(cel.v.runUnlocks).reduce((total, ach) => total + ach, 0);
      case PROGRESS_STAGE.RA:
        return 10 * Object.values(cel.ra.pets).reduce((sum, pet) => sum + pet.level, 0);
      case PROGRESS_STAGE.IMAGINARY_MACHINES:
        return 50 * Math.log10(save.reality.iMCap);
      case PROGRESS_STAGE.LAITELA:
        return new Decimal(cel.laitela.darkMatter).log10() / 308.25;
      case PROGRESS_STAGE.PELLE:
        return 1000 * Math.log10(1 + cel.pelle.remnants) / 9;
      default:
        throw Error("Unrecognized progress stage in getProgressWithinStage");
    }
  },

  // For catchup modal - returns an appropriate resource that would be useful to increase at that point of the game
  getSuggestedResource(save) {
    switch (this.getProgressStage(save)) {
      case PROGRESS_STAGE.PRE_INFINITY:
        return "Antimatter";

      case PROGRESS_STAGE.EARLY_INFINITY:
      case PROGRESS_STAGE.BREAK_INFINITY:
      case PROGRESS_STAGE.REPLICANTI:
        return "Infinity Points";

      case PROGRESS_STAGE.EARLY_ETERNITY:
        return "Eternity Points";
      case PROGRESS_STAGE.ETERNITY_CHALLENGES:
        return "Eternity Challenge Completions and Eternity Points";
      case PROGRESS_STAGE.EARLY_DILATION:
        return "Dilated Time";
      case PROGRESS_STAGE.LATE_ETERNITY:
        return "Eternity Points and Dilated Time";

      case PROGRESS_STAGE.EARLY_REALITY:
      case PROGRESS_STAGE.TERESA:
        return "Reality Machines";
      case PROGRESS_STAGE.EFFARIG:
        return "Reality Machines and Relic Shards";
      case PROGRESS_STAGE.ENSLAVED:
        return "Reality Machines and Glyph Level";
      case PROGRESS_STAGE.V:
        return "V-Achievements";
      case PROGRESS_STAGE.RA:
        return "Celestial Memories";
      case PROGRESS_STAGE.IMAGINARY_MACHINES:
        return "Imaginary Machines";
      case PROGRESS_STAGE.LAITELA:
        return "Dark Matter and Singularities";
      case PROGRESS_STAGE.PELLE:
        return "Remnants";
      default:
        throw Error("Unrecognized progress stage in getSuggestedResource");
    }
  },

  // Note: Don't use this function as an absolute indicator of progress as it's unreliable when numbers are close
  getCompositeProgress(save) {
    if (!save) return 0;
    return this.getProgressStage(save) + this.getProgressWithinStage(save) / 1000;
  },

  // Returns -1 or 1 when one save is very likely to be farther than the other, otherwise returns 0 if they're close
  compareSaveProgress(first, second) {
    const progressDifference = this.getCompositeProgress(first) - this.getCompositeProgress(second);
    if (progressDifference > 0.05) return -1;
    if (progressDifference < -0.05) return 1;
    return 0;
  },

  // Returns -1 or 1 based on which save is older. Return 0 if one is undefined, will be handled upstream
  compareSaveTimes(first, second) {
    if (!first || !second) return 0;
    const timeDifference = first.records.realTimePlayed - second.records.realTimePlayed;
    if (timeDifference >= 0) return -1;
    return 1;
  }
};
