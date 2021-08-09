"use strict";

const Laitela = {
  get celestial() {
    return player.celestials.laitela;
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
  get isUnlocked() {
    return ImaginaryUpgrade(15).isBought;
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
  get isFullyDestabilized() {
    return Laitela.maxAllowedDimension === 0;
  },
  get continuumUnlocked() {
    return ImaginaryUpgrade(15).isBought;
  },
  get continuumActive() {
    return this.continuumUnlocked && !player.auto.disableContinuum && !Pelle.isDisabled("continuum");
  },
  get matterExtraPurchaseFactor() {
    return (1 + 0.5 * Math.pow(Decimal.pLog10(Currency.darkMatter.max) / 50, 0.4) *
      (1 + SingularityMilestone.continuumMult.effectValue));
  },
  get realityReward() {
    return Math.clampMin(Math.pow(100, this.difficultyTier) *
      Math.pow(360 / player.celestials.laitela.fastestCompletion, 2), 1);
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    return Math.clamp(Math.pow(Currency.antimatter.value.log10() / 1e11, 2), 0, 100) / 200;
  },
  get darkMatterMultGain() {
    return Decimal.pow(Currency.darkMatter.value.dividedBy(this.annihilationDMRequirement)
      .plus(1).log10(), 1.5).toNumber() * ImaginaryUpgrade(21).effectOrDefault(1);
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult + this.darkMatterMultGain) / this.celestial.darkMatterMult;
  },
  get canAnnihilate() {
    return ImaginaryUpgrade(19).isBought && Currency.darkMatter.gte(this.annihilationDMRequirement);
  },
  get annihilationDMRequirement() {
    return 1e60;
  },
  annihilate(force) {
    if (!force && !this.canAnnihilate) return false;
    this.celestial.darkMatterMult += this.darkMatterMultGain;
    this.celestial.dimensions = this.celestial.dimensions.map(
      () => (
        {
          amount: new Decimal(1),
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        }
      )
    );
    Currency.darkMatter.reset();
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
    if (SingularityMilestone.dim4Generation.isUnlocked && Laitela.canAnnihilate) {
      MatterDimension(4).amount = MatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue * realDiff / 1000);
    }
  },
  // Greedily buys the cheapest available upgrade until none are affordable
  maxAllDMDimensions(maxTier) {
    // Note that _tier is 0-indexed, so calling with maxTier = 3 will buy up to and including DM3 for example
    const unlockedDimensions = MatterDimensionState.list
      .filter(d => d.isUnlocked && d.amount.gt(0) && d._tier < maxTier);
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
