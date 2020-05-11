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
  initializeRun() {
    clearCelestialRuns();
    this.celestial.run = true;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get continuumActive() {
    // Make it unlock at Lai'tela unlock for now.
    return Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK);
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
  get darkMatterMultGain() {
    return Decimal.pow(this.matter.dividedBy(1e20).plus(1).log10(), 1.5).toNumber();
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult + this.darkMatterMultGain) / this.celestial.darkMatterMult;
  },
  annihilate(force) {
    if (!force && this.matter.lt(1e20)) return false;
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
    if (SingularityMilestone.dim4Generation.isUnlocked) {
      MatterDimension(4).amount = MatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue * realDiff / 1000);
    }
  },
  // Greedily buys the cheapest available upgrade until none are affordable
  maxAllDMDimensions(maxTier) {
    let cheapestPrice = new Decimal(0);
    // Note that _tier is 0-indexed, so calling with maxTier = 3 will buy up to and including DM3 for example
    const unlockedDimensions = MatterDimensionState.list.filter(d => d.amount.gt(0) && d._tier < maxTier);
    while (player.celestials.laitela.matter.gte(cheapestPrice)) {
      const sortedUpgradeInfo = unlockedDimensions
        .map(d => [
          [d.intervalCost, d.canBuyInterval, "interval", d._tier],
          [d.powerDMCost, d.canBuyPowerDM, "powerDM", d._tier],
          [d.powerDECost, d.canBuyPowerDE, "powerDE", d._tier]])
        .flat(1)
        .filter(a => a[1])
        .sort((a, b) => a[0].div(b[0]).log10())
        .map(d => [d[0], d[2], d[3]]);
      const cheapestUpgrade = sortedUpgradeInfo[0];
      if (cheapestUpgrade === undefined) break;
      cheapestPrice = cheapestUpgrade[0];
      switch (cheapestUpgrade[1]) {
        case "interval":
          MatterDimensionState.list[cheapestUpgrade[2]].buyInterval();
          break;
        case "powerDM":
          MatterDimensionState.list[cheapestUpgrade[2]].buyPowerDM();
          break;
        case "powerDE":
          MatterDimensionState.list[cheapestUpgrade[2]].buyPowerDE();
          break;
      }
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
        for (let i = 1; i <= SingularityMilestone.autoAscend.effectValue; i++) {
          MatterDimension(i).ascend();
        }
      }
    }
    if (interval !== 0) laitela.darkAutobuyerTimer %= interval;

    if (this.darkMatterMultGain >= laitela.autoAnnihilationSetting && this.darkMatterMult > 1 &&
      laitela.automation.annihilation) {
        this.annihilate();
    }

    if (Singularity.capIsReached && laitela.automation.singularity) {
      laitela.secondsSinceReachedSingularity += realDiff / 1000;
      if (laitela.secondsSinceReachedSingularity >= SingularityMilestone.autoCondense.effectValue) {
        Singularity.perform();
      }
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
