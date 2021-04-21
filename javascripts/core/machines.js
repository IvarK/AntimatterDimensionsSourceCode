"use strict";

const MachineHandler = {
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
    // This happens around ee10 and is necessary to reach e9e15 antimatter without having to deal with the various
    // potential problems associated with having ee9 RM, of which there are lots (both balance-wise and design-wise).
    // The softcap here squishes every additional OoM in the exponent into another factor of e1000 RM, putting e9e15
    // antimatter around e7000 RM instead of e1000000000 RM.
    const softcapRM = new Decimal("1e1000");
    if (rmGain.gt(softcapRM)) {
      const exponentOOMAboveCap = Math.log10(rmGain.log10() / softcapRM.log10());
      rmGain = softcapRM.pow(1 + exponentOOMAboveCap);
    }
    return Decimal.floor(rmGain);
  }
};