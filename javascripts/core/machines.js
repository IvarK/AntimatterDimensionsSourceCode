"use strict";

const MachineHandler = {
  get hardcapRM() {
    return new Decimal("1e1000").times(ImaginaryUpgrade(6).effectValue);
  },

  get realityMachineMultiplier() {
    return Teresa.rmMultiplier * Effects.max(1, PerkShopUpgrade.rmMult) *
      getAdjustedGlyphEffect("effarigrm") * Achievement(167).effectOrDefault(1);
  },

  get uncappedRM() {
    let log10FinalEP = player.records.thisReality.maxEP.plus(gainedEternityPoints()).log10();
    if (!PlayerProgress.realityUnlocked()) {
      if (log10FinalEP > 8000) log10FinalEP = 8000;
      if (log10FinalEP > 6000) log10FinalEP -= (log10FinalEP - 6000) * 0.75;
    }
    let rmGain = Decimal.pow(1000, log10FinalEP / 4000 - 1);
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = new Decimal(27 / 4000 * log10FinalEP - 26);
    rmGain = rmGain.times(this.realityMachineMultiplier);
    return rmGain;
  },

  get gainedRealityMachines() {
    return this.uncappedRM.clampMax(this.hardcapRM);
  },

  get isIMUnlocked() {
    return true;
  },

  get baseIMCap() {
    return Math.clampMin(this.uncappedRM.log10() - 1000, 0) ** 2;
  },

  // This is where any multipliers need to go, and any display references should use this instead of baseIMCap
  get finalIMCap() {
    return player.reality.iMCap * ImaginaryUpgrade(13).effectOrDefault(1);
  },

  // Use iMCap to store the base cap; applying multipliers separately avoids some design issues the 3xTP upgrade has
  updateIMCap() {
    if (this.uncappedRM.gte(new Decimal("1e1000"))) {
      player.reality.iMCap = Math.max(player.reality.iMCap, this.baseIMCap);
    }
  },

  // Time in seconds to reduce the missing amount by a factor of two
  get scaleTimeForIM() {
    return 60 / ImaginaryUpgrade(22).effectOrDefault(1);
  },

  gainedImaginaryMachines(diff) {
    return (this.finalIMCap - Currency.imaginaryMachines.value) * (1 - 2 ** (-diff / 1000 / this.scaleTimeForIM));
  },
};
