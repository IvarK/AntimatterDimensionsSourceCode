"use strict";

const MachineHandler = {
  get hardcapRM() {
    return new Decimal("1e1000");
  },

  get realityMachineMultiplier() {
    return Teresa.rmMultiplier * Effects.max(1, PerkShopUpgrade.rmMult) *
      getAdjustedGlyphEffect("effarigrm") * Achievement(167).effectOrDefault(1);
  },

  get gainedRealityMachines() {
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

  get gainedImaginaryMachines() {
    return this.uncappedRM.gte(this.hardcapRM)
      ? new Decimal(1)
      : new Decimal(0);
  },
};
