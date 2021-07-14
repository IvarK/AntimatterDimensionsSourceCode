"use strict";

class SingularityMilestoneState extends GameMechanicState {
  constructor(config) {
    const effect = config.effect;
    const configCopy = deepmerge.all([{}, config]);
    configCopy.effect = () => effect(this.completions);
    super(configCopy);
    this._rawEffect = effect;
  }

  get start() {
    return this.config.start;
  }

  get repeat() {
    return this.config.repeat;
  }

  get limit() {
    return this.config.limit;
  }

  get isUnique() {
    return this.repeat === 0;
  }

  get isUnlocked() {
    return Currency.singularities.gte(this.start);
  }

  nerfCompletions(completions) {
    const softcap = this.config.increaseThreshold;
    if (!softcap || completions < softcap) return completions;
    return softcap + (completions - softcap) / 3;
  }

  unnerfCompletions(completions) {
    const softcap = this.config.increaseThreshold;
    if (!softcap || completions < softcap) return completions;
    return softcap + (completions - softcap) * 3;
  }

  get previousGoal() {
    if (!this.isUnlocked) return 0;
    return this.start * Math.pow(this.repeat, this.unnerfCompletions(this.completions) - 1);
  }

  get nextGoal() {
    if (this.isUnique) return this.start;
    return this.start * Math.pow(this.repeat, this.unnerfCompletions(this.completions + 1) - 1);
  }
  
  get rawCompletions() {
    if (this.isUnique) return this.isUnlocked ? 1 : 0;
    if (!this.isUnlocked) return 0;
    return 1 + (Math.log(Currency.singularities.value) - Math.log(this.start)) / Math.log(this.repeat);
  }

  get completions() {
    return Math.min(Math.floor(this.nerfCompletions(this.rawCompletions)), this.limit);
  }

  get remainingSingularities() {
    return this.nextGoal - Currency.singularities.value;
  }

  get progressToNext() {
    return formatPercents((Currency.singularities.value - this.previousGoal) / this.nextGoal);
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.completions >= this.limit);
  }

  get effectDisplay() {
    if (!Number.isFinite(this.effectValue)) return "N/A";
    return this.config.effectFormat(this.effectValue);
  }

  get nextEffectDisplay() {
    return this.config.effectFormat(this._rawEffect(this.completions + 1));
  }

  get description() {
    return this.config.description;
  }

  get canBeApplied() {
    return this.isUnlocked;
  }
}

const SingularityMilestone = (function() {
  const db = GameDatabase.celestials.singularityMilestones;
  return {
    continuumMult: new SingularityMilestoneState(db.continuumMult),
    darkMatterMult: new SingularityMilestoneState(db.darkMatterMult),
    darkEnergyMult: new SingularityMilestoneState(db.darkEnergyMult),
    darkDimensionCostReduction: new SingularityMilestoneState(db.darkDimensionCostReduction),
    singularityMult: new SingularityMilestoneState(db.singularityMult),
    darkDimensionIntervalReduction: new SingularityMilestoneState(db.darkDimensionIntervalReduction),
    ascensionIntervalScaling: new SingularityMilestoneState(db.ascensionIntervalScaling),
    autoCondense: new SingularityMilestoneState(db.autoCondense),
    darkDimensionAutobuyers: new SingularityMilestoneState(db.darkDimensionAutobuyers),
    darkAutobuyerSpeed: new SingularityMilestoneState(db.darkAutobuyerSpeed),
    improvedSingularityCap: new SingularityMilestoneState(db.improvedSingularityCap),
    darkFromTesseracts: new SingularityMilestoneState(db.darkFromTesseracts),
    dilatedTimeFromSingularities: new SingularityMilestoneState(db.dilatedTimeFromSingularities),
    darkFromGlyphLevel: new SingularityMilestoneState(db.darkFromGlyphLevel),
    gamespeedFromSingularities: new SingularityMilestoneState(db.gamespeedFromSingularities),
    darkFromTheorems: new SingularityMilestoneState(db.darkFromTheorems),
    dim4Generation: new SingularityMilestoneState(db.dim4Generation),
    darkFromDM4: new SingularityMilestoneState(db.darkFromDM4),
    theoremPowerFromSingularities: new SingularityMilestoneState(db.theoremPowerFromSingularities),
    darkFromGamespeed: new SingularityMilestoneState(db.darkFromGamespeed),
    glyphLevelFromSingularities: new SingularityMilestoneState(db.glyphLevelFromSingularities),
    darkFromDilatedTime: new SingularityMilestoneState(db.darkFromDilatedTime),
    tesseractMultFromSingularities: new SingularityMilestoneState(db.tesseractMultFromSingularities),
    improvedAscensionDM: new SingularityMilestoneState(db.improvedAscensionDM),
    realityDEMultiplier: new SingularityMilestoneState(db.realityDEMultiplier),
    intervalCostScalingReduction: new SingularityMilestoneState(db.intervalCostScalingReduction),
    multFromInfinitied: new SingularityMilestoneState(db.multFromInfinitied),
    infinitiedPow: new SingularityMilestoneState(db.infinitiedPow),
  };
}());

const SingularityMilestones = {
  all: Object.values(SingularityMilestone),

  get sorted() {
    return this.all.sort((a, b) => a.remainingSingularities - b.remainingSingularities);
  },

  get sortedForCompletions() {
    return this.sorted.sort((a, b) => {
      if (a.isMaxed === b.isMaxed) return 0;
      return a.isMaxed ? 1 : -1;
    });
  },

  get nextMilestoneGroup() {
    return this.sortedForCompletions.slice(0, 6);
  },

  get unseenMilestones() {
    const laitela = player.celestials.laitela;
    return SingularityMilestoneThresholds
      .filter(s => s > laitela.lastCheckedMilestones && Currency.singularities.gte(s));
  }
};

// Sorted list of all the values where a singularity milestone exists, used for "new milestone" styling
const SingularityMilestoneThresholds = (function() {
  return Object.values(GameDatabase.celestials.singularityMilestones)
    .map(m => Array.range(0, Math.min(50, m.limit))
      .map(r => m.start * Math.pow(m.repeat, r)))
    .flat(Infinity)
    .filter(n => n < 1e100)
    .sort((a, b) => a - b);
}());

const Singularity = {
  get cap() {
    return 200 * Math.pow(10, player.celestials.laitela.singularityCapIncreases);
  },

  get gainPerCapIncrease() {
    return SingularityMilestone.improvedSingularityCap.effectValue;
  },

  get singularitiesGained() {
    return Math.floor(Math.pow(this.gainPerCapIncrease, player.celestials.laitela.singularityCapIncreases) *
      SingularityMilestone.singularityMult.effectOrDefault(1) *
      (1 + ImaginaryUpgrade(10).effectValue));
  },

  get capIsReached() {
    return Currency.darkEnergy.gte(this.cap);
  },

  increaseCap() {
    if (player.celestials.laitela.singularityCapIncreases >= 96) return;
    player.celestials.laitela.singularityCapIncreases++;
  },

  decreaseCap() {
    if (player.celestials.laitela.singularityCapIncreases === 0) return;
    player.celestials.laitela.singularityCapIncreases--;
  },

  perform() {
    if (!this.capIsReached) return;

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_BEFORE);

    Currency.darkEnergy.reset();
    Currency.singularities.add(this.singularitiesGained);

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_AFTER);
  }
};
