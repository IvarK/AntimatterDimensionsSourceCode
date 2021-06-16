"use strict";

const Laitela = {
  get celestial() {
    return player.celestials.laitela;
  },
  handleMatterDimensionUnlocks() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount.eq(0) && Currency.darkMatter.gte(d.adjustedStartingCost)) {
        d.amount = new Decimal(1);
        d.timeSinceLastUpdate = 0;
      }
    }
  },
  get darkEnergyPerSecond() {
    return Array.range(1, 4)
      .map(n => MatterDimension(n))
      .filter(d => d.amount.gt(0))
      .map(d => d.powerDE * 1000 / d.interval)
      .sum();
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
    return new Decimal("1e2000");
  },
  get canUnlock() {
    return Ra.totalPetLevel >= this.raLevelRequirement &&
      player.reality.glyphs.active.concat(player.reality.glyphs.inventory).filter(
        x => x.type === "reality").map(x => x.level).max() >= this.realityGlyphLevelRequirement &&
      Currency.realityMachines.gte(this.realityMachineCost);
  },
  unlock() {
    if (!this.canUnlock) return false;
    Currency.realityMachines.purchase(this.realityMachineCost);
    MatterDimension(1).amount = new Decimal(1);
    return true;
  },
  get isUnlocked() {
    return MatterDimension(1).amount.gt(0);
  },
  canBuyUnlock(info) {
    if (Currency.darkMatters.lt(info.price)) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock(info)) return false;
    Currency.darkMatter.purchase(info.price);
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
  get difficultyTier() {
    return player.celestials.laitela.difficultyTier;
  },
  set difficultyTier(tier) {
    player.celestials.laitela.difficultyTier = tier;
  },
  get maxAllowedDimension() {
    return 8 - this.difficultyTier;
  },
  get continuumUnlocked() {
    return Laitela.isUnlocked;
  },
  get continuumActive() {
    return this.continuumUnlocked && !player.auto.disableContinuum;
  },
  get matterExtraPurchaseFactor() {
    return (1 + Math.pow(Decimal.pLog10(Currency.darkMatter.max) /
      Math.log10(Number.MAX_VALUE), 0.8) * (1 + SingularityMilestone.continuumMult.effectValue) / 2);
  },
  get realityReward() {
    return Math.clampMin(Math.pow(100, this.difficultyTier) *
      Math.pow(360 / player.celestials.laitela.fastestCompletion, 2), 1);
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    return Math.clamp(Math.pow(Currency.antimatter.value.log10() / 1e11, 2), 0, 100) / 100;
  },
  get darkMatterMultGain() {
    return Decimal.pow(Currency.darkMatter.value.dividedBy(this.annihilationDMRequirement)
      .plus(1).log10(), 1.5).toNumber();
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
    if (!force && Currency.darkMatter.lt(this.annihilationDMRequirement)) return false;
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
    Currency.darkMatter.reset();
    Currency.darkEnergy.reset();
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
          Currency.darkMatter.add(productionDM);
        } else {
          MatterDimension(i - 1).amount = MatterDimension(i - 1).amount.plus(productionDM);
        }
        if (MatterDimension(i).amount.gt(0)) {
          Currency.darkEnergy.value =
            Math.clampMax(Currency.darkEnergy.value + ticks * d.powerDE, Number.MAX_VALUE);
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
    const darkMatter = Currency.darkMatter.value;
    for (const upgrade of upgradeInfo) {
      const purchases = Math.clamp(Math.floor(darkMatter.times(0.02).div(upgrade[0]).log(upgrade[1])), 0, upgrade[2]);
      buy(upgrade, purchases);
    }
    while (upgradeInfo.some(upgrade => upgrade[0].lte(darkMatter) && upgrade[2] > 0)) {
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
      Currency.darkEnergy.value / Singularity.cap >= SingularityMilestone.autoCondense.effectValue) {
      Singularity.perform();
    }
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = 1;
    Currency.darkMatter.max = 0;
    this.celestial.fastestCompletion = 3600;
    this.celestial.difficultyTier = 0;
  }
};
