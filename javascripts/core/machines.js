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

  get currentIMCap() {
    return Math.clampMin(this.uncappedRM.log10() - 1000, 0) ** 2;
  },

  updateIMCap() {
    if (this.uncappedRM.gte(new Decimal("1e1000"))) {
      player.reality.iMCap = Math.max(player.reality.iMCap, this.currentIMCap);
    }
  },

  gainedImaginaryMachines(diff) {
    const missing = player.reality.iMCap - Currency.imaginaryMachines.value;
    // Time in seconds to reduce the missing amount by a factor of two
    const scale = 60;
    return missing * (1 - 2 ** (-diff / 1000 / scale));
  },
};
