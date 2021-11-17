import { CelestialQuotes } from "../quotes.js";
import { DC } from "../../constants.js";

export const Laitela = {
  displayName: "Lai'tela",
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
  get isUnlocked() {
    return ImaginaryUpgrade(15).isBought;
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
    return this.continuumUnlocked && !player.auto.disableContinuum;
  },
  setContinuum(x) {
    player.auto.disableContinuum = !x;
    // If continuum is now not disabled (i.e. is enabled) we update the relevant requirement check.
    if (!player.auto.disableContinuum) {
      player.requirementChecks.reality.noContinuum = false;
    }
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
          amount: DC.D0,
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        }
      )
    );
    Currency.darkMatter.reset();
    Laitela.quotes.show(Laitela.quotes.ANNIHILATION);
    return true;
  },
  tickDarkMatter(realDiff) {
    if (!this.isUnlocked) return;
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
    if (!this.isUnlocked) return;
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
  },
  quotes: new CelestialQuotes("laitela", {
    UNLOCK: {
      id: 1,
      lines: [
        "You finally reached me.",
        "I guess it is time to reveal to you,",
        "The secrets hidden beneath existence.",
        "The omnipresent ruling perfection. Continuum.",
        "And the binding keys to the multiverse,",
        "Dark Matter and Dark Energy.",
        "My knowledge is endless and my wisdom divine.",
        "So you can play around all you want.",
        "I am Lai'tela, the Celestial of Dimensions,",
        "And I will be watching you forever.",
      ]
    },
    FIRST_DESTABILIZE: {
      id: 2,
      destabilize: 1,
      lines: [
        "It is fine. Unlike the others, I never had a Reality.",
        "I built this one just now, precisely so it would collapse.",
        "I can rebuild this Reality over and over, unlike them.",
        "I could trap all of them if I wanted.",
        "You will never find a way to overpower me.",
      ]
    },
    FIRST_SINGULARITY: {
      id: 3,
      singularities: 1,
      lines: [
        "It is weird, how all beings question things.",
        "You are different. You can build and manipulate Dimensions.",
        "Were you truly once one of them?",
        "You have taken control of the darkness so quickly.",
        "Molded them into Dimensions and Points just like one of us.",
        "What... ARE you?",
      ]
    },
    // Note: This happens around e10-e11 singularities
    ANNIHILATION: {
      id: 4,
      lines: [
        "Back to square one.",
        "We, the Celestials transcend time and existence.",
        "We always know that whatever is lost always comes back eventually.",
        "Even if we were to cease, we would just come back stronger.",
        "The cycle... repeats forever.",
        "Do they also understand? Or was it only you as well?",
        "I feel like I should know the answer...",
      ]
    },
    HALF_DIMENSIONS: {
      id: 5,
      destabilize: 4,
      lines: [
        "You seem to be having too much fun.",
        "Just like they did before meeting their... fate.",
        "You freed them of their eternal imprisonment, yes?",
        "I always regret how harsh I was that day.",
        "Maybe it doesn't matter.",
        "But I digress. Let's keep constricting this Reality.",
      ]
    },
    SINGULARITY_1: {
      id: 6,
      singularities: 1e8,
      lines: [
        "What was it again...? Antimatter?",
        "That was the first thing you turned into Dimensions?",
        "It could not have been an accident.",
        "How did you... attain the power to control it?",
        "This never happened in all of existence... or did it?",
        "My endless knowledge... is it waning?",
      ]
    },
    SINGULARITY_2: {
      id: 7,
      singularities: 1e16,
      lines: [
        "Of those who tried to control dimensions...",
        "Who were they? I cannot seem to remember...",
        "And how... did they vanish?",
        "Are they... us? Simply transcending existence?",
        "Did they surpass us and become something we can't comprehend?",
        "Are we all imprisoned in this falsity...",
      ]
    },
    SINGULARITY_3: {
      id: 8,
      singularities: 1e24,
      lines: [
        "Is this a cycle?",
        "Will our existence just end and start anew...",
        "Just like... the Dimensions I rule?",
        "And if such... what will bring our end?",
        "I knew the answer to all these questions...",
        "But I forgot all of them...",
        "Your power... is it... erasing mine...?",
      ]
    },
    SINGULARITY_4: {
      id: 9,
      singularities: 1e32,
      lines: [
        "I don't know for how much... longer I can hold.",
        "There is... next to nothing left...",
        "You have attained... complete and total mastery... over the dark...",
        "While I can barely... hold onto my name anymore...",
        "What am I meant to be doing anyways?",
        "Did... my mistakes cause all of this?",
      ]
    },
    FULL_DESTABILIZE: {
      id: 10,
      destabilize: 8,
      lines: [
        "I feel... like I had something to say...",
        "Who am I? I am not sure...",
        "I cannot... hold onto the darkness any longer...",
        "I... have nothing left...",
        "Something about... destabilizing... collapsing...",
        "The end...",
      ]
    },
  }),
  symbol: "ᛝ"
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.laitela.isOpen) Laitela.quotes.show(Laitela.quotes.UNLOCK);
});
