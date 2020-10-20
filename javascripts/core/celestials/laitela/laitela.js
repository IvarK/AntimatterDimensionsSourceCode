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
  get raLevelRequirement() {
    return 100;
  },
  get realityGlyphLevelRequirement() {
    return 25000;
  },
  get realityMachineCost() {
    return new Decimal('1e2000');
  },
  get canUnlock() {
    return Ra.totalPetLevel >= this.raLevelRequirement &&
      player.reality.glyphs.active.concat(player.reality.glyphs.inventory).filter(
        x => x.type === "reality").map(x => x.level).max() >= this.realityGlyphLevelRequirement &&
      player.reality.realityMachines.gte(this.realityMachineCost);
  },
  unlock() {
    if (!this.canUnlock) return false;
    player.reality.realityMachines = player.reality.realityMachines.minus(this.realityMachineCost);
    MatterDimension(1).amount = new Decimal(1);
    return true;
  },
  get isUnlocked() {
    return MatterDimension(1).amount.gt(0);
  },
  canBuyUnlock(info) {
    if (this.matter.lt(info.price)) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock(info)) return false;
    this.matter = this.matter.minus(info.price);
    // eslint-disable-next-line no-bitwise
    player.celestials.laitela.unlockBits |= (1 << info.id);
    return true;
  },
  initializeRun() {
    clearCelestialRuns();
    this.celestial.run = true;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get continuumActive() {
    return Laitela.isUnlocked && 
    !player.options.disableContinuum &&
    !Pelle.isDisabled("continuum");
  },
  get matterExtraPurchaseFactor() {
    return (1 + Math.pow(Decimal.pLog10(this.celestial.maxMatter) /
      Math.log10(Number.MAX_VALUE), 0.8) * (1 + SingularityMilestone.continuumMult.effectValue) / 2);
  },
  get realityReward() {
    return Math.clampMin(Math.pow(100, player.celestials.laitela.difficultyTier) *
      Math.pow(360 / player.celestials.laitela.fastestCompletion, 2), 1);
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    return Math.clamp(Math.pow(Currency.antimatter.value.log10() / 1e11, 2), 0, 100) / 100;
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
  get maxMatter() {
    return this.celestial.maxMatter;
  },
  get darkMatterMultGain() {
    return Decimal.pow(this.matter.dividedBy(this.annihilationDMRequirement).plus(1).log10(), 1.5).toNumber();
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult + this.darkMatterMultGain) / this.celestial.darkMatterMult;
  },
  get annihilationDMRequirement() {
    return 1e20;
  },
  annihilate(force) {
    if (!force && this.matter.lt(this.annihilationDMRequirement)) return false;
    this.celestial.darkMatterMult += this.darkMatterMultGain;
    this.celestial.dimensions = this.celestial.dimensions.map(
      () => (
        {
          amount: new Decimal(0),
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        }
      )
    );
    this.celestial.dimensions[0].amount = new Decimal(1);
    this.celestial.matter = new Decimal(0);
    this.celestial.darkEnergy = 0;
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
          player.celestials.laitela.matter = player.celestials.laitela.matter
            .plus(productionDM)
            .clampMax(Number.MAX_VALUE);
          player.celestials.laitela.maxMatter = player.celestials.laitela.maxMatter.max(
            player.celestials.laitela.matter);
        } else {
          MatterDimension(i - 1).amount = MatterDimension(i - 1).amount.plus(productionDM);
        }
        if (MatterDimension(i).amount.gt(0)) {
          player.celestials.laitela.darkEnergy =
            Math.clampMax(player.celestials.laitela.darkEnergy + ticks * d.powerDE, Number.MAX_VALUE);
        }
        d.timeSinceLastUpdate -= d.interval * ticks;
      }
    }
    if (SingularityMilestone.dim4Generation.isUnlocked) {
      MatterDimension(4).amount = MatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue * realDiff / 1000);
    }
  },
  // Greedily buys the cheapest available upgrade until none are affordable
  maxAllDMDimensions(maxTier) {
    // Note that _tier is 0-indexed, so calling with maxTier = 3 will buy up to and including DM3 for example
    const unlockedDimensions = MatterDimensionState.list.filter(d => d.amount.gt(0) && d._tier < maxTier);
    const upgradeInfo = unlockedDimensions
    .map(d => [
      [d.rawIntervalCost, d.intervalCostIncrease, d.maxIntervalPurchases, x => d.buyManyInterval(x)],
      [d.rawPowerDMCost, d.powerDMCostIncrease, Infinity, x => d.buyManyPowerDM(x)],
      [d.rawPowerDECost, d.powerDECostIncrease, Infinity, x => d.buyManyPowerDE(x)]])
    .flat(1);
    const buy = function(upgrade, purchases) {
      upgrade[3](purchases);
      upgrade[0] = upgrade[0].times(Decimal.pow(upgrade[1], purchases));
      upgrade[2] -= purchases;
    };
    // Buy everything costing less than 0.02 of initial matter.
    const matter = this.matter;
    for (const upgrade of upgradeInfo) {
      const purchases = Math.clamp(Math.floor(matter.times(0.02).div(upgrade[0]).log(upgrade[1])), 0, upgrade[2]);
      buy(upgrade, purchases);
    }
    while (upgradeInfo.some(upgrade => upgrade[0].lte(this.matter) && upgrade[2] > 0)) {
      const cheapestUpgrade = upgradeInfo.filter(upgrade => upgrade[2] > 0).sort((a, b) => a[0].minus(b[0]).sign())[0];
      buy(cheapestUpgrade, 1);
    }
  },
  autobuyerLoop(realDiff) {
    const laitela = player.celestials.laitela;

    const interval = SingularityMilestone.darkAutobuyerSpeed.effectValue;
    laitela.darkAutobuyerTimer += realDiff / 1000;
    if (laitela.darkAutobuyerTimer >= interval) {
      if (laitela.automation.dimensions) {
        this.maxAllDMDimensions(SingularityMilestone.darkDimensionAutobuyers.effectValue);
      }
      if (laitela.automation.ascension) {
        for (let i = 1; i <= SingularityMilestone.darkDimensionAutobuyers.effectValue; i++) {
          MatterDimension(i).ascend();
        }
      }
    }
    if (interval !== 0) laitela.darkAutobuyerTimer %= interval;

    if (this.darkMatterMultGain >= laitela.autoAnnihilationSetting && this.darkMatterMult > 1 &&
      laitela.automation.annihilation) {
        this.annihilate();
    }

    if (Singularity.capIsReached && laitela.automation.singularity && 
      laitela.darkEnergy / Singularity.cap >= SingularityMilestone.autoCondense.effectValue) {
        Singularity.perform();
    }
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = 1;
    this.celestial.maxMatter = new Decimal(0);
    this.celestial.fastestCompletion = 3600;
    this.celestial.difficultyTier = 0;
  }
};
