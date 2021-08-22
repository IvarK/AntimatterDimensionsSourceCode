"use strict";

// These "progress stages" are roughly defined in a way to separate different parts of the game where different
// resources are the main indicator of progress. They aren't necessarily equally spaced in time.
const PROGRESS_STAGE = {
  PRE_INFINITY: 0,
  EARLY_INFINITY: 1,
  INFINITY: 2,
  EARLY_ETERNITY: 3,
  ETERNITY: 4,
  EARLY_DILATION: 5,
  LATE_ETERNITY: 6,
  EARLY_REALITY: 7,
  REALITY: 8,
  IMAGINARY_MACHINES: 9,
};

const ProgressChecker = {
  // Returns an enum in an ordered list defined by certain progress breakpoints in the game
  getProgressStage(save) {
    if (save.reality.iMCap > 0) return PROGRESS_STAGE.IMAGINARY_MACHINES;
    if (save.realities > 50) return PROGRESS_STAGE.REALITY;
    if (save.realities > 0) return PROGRESS_STAGE.EARLY_REALITY;
    if (save.dilation.dilatedTime.gt(1e15)) return PROGRESS_STAGE.LATE_ETERNITY;
    if (save.dilation.dilatedTime.gt(0)) return PROGRESS_STAGE.EARLY_DILATION;
    if (save.eternities.gt(1000)) return PROGRESS_STAGE.ETERNITY;
    if (save.eternities.gt(0)) return PROGRESS_STAGE.EARLY_ETERNITY;
    if (save.infinities.gt(1000)) return PROGRESS_STAGE.INFINITY;
    if (save.infinities.gt(0)) return PROGRESS_STAGE.EARLY_INFINITY;
    return PROGRESS_STAGE.PRE_INFINITY;
  },

  // Returns a Number scaled roughly 0-1000 which can be used to compare progress within the same stage. Higher values
  // don't necessarily indicate strictly farther progress when they're close to each other, but the general trend is
  // that 1000 will be approximately "equal to" 0 on the next stage
  getProgressWithinStage(save) {
    switch (this.getProgressStage(save)) {
      case PROGRESS_STAGE.PRE_INFINITY:
        return (330 * save.galaxies) + (20 * save.dimensionBoosts) + (save.antimatter.log10() / 30);
      case PROGRESS_STAGE.EARLY_INFINITY:
        return save.infinities.toNumber();
      case PROGRESS_STAGE.INFINITY:
        return 1000 * Math.sqrt(save.infinityPoints.log10() / 310);
      case PROGRESS_STAGE.EARLY_ETERNITY:
        return save.eternities.toNumber();
      case PROGRESS_STAGE.ETERNITY:
        return 1000 * Math.sqrt(save.eternityPoints.log10() / 1300);
      case PROGRESS_STAGE.EARLY_DILATION:
        return save.dilation.dilatedTime.log10() / 0.015;
      case PROGRESS_STAGE.LATE_ETERNITY:
        return 1000 * Math.sqrt((save.eternityPoints.log10() - 1300) / 6700);
      case PROGRESS_STAGE.EARLY_REALITY:
        return 20 * save.realities;
      case PROGRESS_STAGE.REALITY:
        return 1000 * Math.sqrt(save.reality.realityMachines.log10() / 1000);
      case PROGRESS_STAGE.IMAGINARY_MACHINES:
        return 50 * Math.log10(save.reality.iMCap);
      default:
        throw Error("Unrecognized progress stage in getProgressWithinStage");
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
