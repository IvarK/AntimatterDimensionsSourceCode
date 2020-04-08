"use strict";

const Laitela = {
  get celestial() {
    return player.celestials.laitela;
  },
  handleMatterDimensionUnlocks() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount.eq(0) && this.matter.gte(d.adjustedStartingCost)) {
        d.amount = new Decimal(1);
        d.timeSinceLastUpdate = 0;
      }
    }
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.laitela.unlockBits & (1 << info.id));
  },
  canBuyUnlock(info) {
    if (this.matter.lt(info.price)) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock) return false;
    this.matter = this.matter.minus(info.price);
    // eslint-disable-next-line no-bitwise
    player.celestials.laitela.unlockBits |= (1 << info.id);
    return true;
  },
  startRun() {
    player.options.retryCelestial = false;
    this.celestial.run = startRealityOver() || this.celestial.run;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get continuumActive() {
    // Make it unlock at Lai'tela unlock for now.
    return Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK);
  },
  get nextMatterDimensionThreshold() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount.eq(0)) return `Next dimension at ${format(d.adjustedStartingCost)} matter`;
    }
    return "";
  },
  get matterExtraPurchaseFactor() {
    return (1 + Math.sqrt(Decimal.pLog10(this.celestial.maxMatter) / Math.log10(Number.MAX_VALUE))) * 
      SingularityMilestone(1).effect;
  },
  get realityReward() {
    return Math.clampMin(Math.pow(20, player.celestials.laitela.difficultyTier) *
      (360 / player.celestials.laitela.fastestCompletion), 1);
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    return Math.clamp(Math.pow(player.antimatter.log10() / 1e11, 2), 0, 100) / 100;
  },
  get maxAllowedDimension() {
    return 8 - player.celestials.laitela.difficultyTier;
  },
  get matter() {
    return this.celestial.matter;
  },
  set matter(x) {
    this.celestial.matter = x;
  },
  get darkMatterMultGain() {
    return Decimal.pow(this.matter.dividedBy(1e30), 0.1).toNumber();
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultFromDE() {
    const power = Math.log10(1 + NormalDimension(8).totalAmount.toNumber() / 1e6) / 4;
    return Decimal.pow(1 + this.celestial.darkEnergy, power);
  },
  annihilate(force) {
    if (!force && this.darkMatterMultGain === 0) return false;
    this.celestial.darkMatterMult += this.darkMatterMultGain;
    this.celestial.dimensions = this.celestial.dimensions.map(
      () => (
        {
          amount: new Decimal(0),
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0
        }
      )
    );
    this.celestial.dimensions[0].amount = new Decimal(1);
    this.celestial.matter = new Decimal(0);
    this.celestial.darkEnergy = 0;
    this.celestial.annihilated = true;
    return true;
  },
  tickDarkMatter(realDiff) {
    for (let i = 1; i <= 4; i++) {
      const d = MatterDimension(i);
      d.timeSinceLastUpdate += realDiff;
      if (d.interval < d.timeSinceLastUpdate) {
        const ticks = Math.floor(d.timeSinceLastUpdate / d.interval);
        const productionDM = d.amount.times(ticks).times(d.powerDM);
        if (i === 1) {
          player.celestials.laitela.matter = player.celestials.laitela.matter.plus(productionDM);
          player.celestials.laitela.maxMatter = player.celestials.laitela.maxMatter.max(
            player.celestials.laitela.matter);
        } else {
          MatterDimension(i - 1).amount = MatterDimension(i - 1).amount.plus(productionDM);
        }
        if (MatterDimension(i).amount.gt(0)) {
          player.celestials.laitela.darkEnergy += ticks * d.powerDE;
        }
        d.timeSinceLastUpdate -= d.interval * ticks;
      }
    }
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = 1;
    this.celestial.annihilated = false;
    this.celestial.maxMatter = new Decimal(0);
    this.celestial.fastestCompletion = 3600;
    this.celestial.difficultyTier = 0;
  }
};
