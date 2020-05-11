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
    return player.celestials.laitela.singularities >= this.start;
  }

  get previousGoal() {
    if (!this.isUnlocked) return 0;
    return this.start * Math.pow(this.repeat, this.completions - 1);
  }

  get nextGoal() {
    return this.start * Math.pow(this.repeat, this.completions);
  }

  get completions() {
    if (this.isUnique) return this.isUnlocked ? 1 : 0;
    if (!this.isUnlocked) return 0;

    return Math.min(Math.floor(
      1 + Math.log(player.celestials.laitela.singularities) /
        Math.log(this.repeat) - Math.log(this.start) / Math.log(this.repeat)
    ), this.limit === 0 ? Infinity : this.limit);
  }

  get remainingSingularities() {
    return this.nextGoal - player.celestials.laitela.singularities;
  }

  get progressToNext() {
    return formatPercents((player.celestials.laitela.singularities - this.previousGoal) / this.nextGoal);
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.limit !== 0 && this.completions >= this.limit);
  }

  get effectDisplay() {
    if (this.effectValue === Infinity) return "N/A";
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
    autoAscend: new SingularityMilestoneState(db.autoAscend),
    improvedSingularityCap: new SingularityMilestoneState(db.improvedSingularityCap),
    darkFromTesseracts: new SingularityMilestoneState(db.darkFromTesseracts),
    dilatedTimeFromSingularities: new SingularityMilestoneState(db.dilatedTimeFromSingularities),
    darkFromGlyphLevel: new SingularityMilestoneState(db.darkFromGlyphLevel),
    momentumFromSingularities: new SingularityMilestoneState(db.momentumFromSingularities),
    darkFromTheorems: new SingularityMilestoneState(db.darkFromTheorems),
    dim4Generation: new SingularityMilestoneState(db.dim4Generation),
    darkFromDM4: new SingularityMilestoneState(db.darkFromDM4),
    theoremPowerFromSingularities: new SingularityMilestoneState(db.theoremPowerFromSingularities),
    darkFromGamespeed: new SingularityMilestoneState(db.darkFromGamespeed),
    glyphLevelFromSingularities: new SingularityMilestoneState(db.glyphLevelFromSingularities),
    darkFromDilatedTime: new SingularityMilestoneState(db.darkFromDilatedTime),
    tesseractMultFromSingularities: new SingularityMilestoneState(db.tesseractMultFromSingularities),
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
  }
};

const Singularity = {
  get cap() {
    return 2e3 * Math.pow(10, player.celestials.laitela.singularityCapIncreases);
  },

  get gainPerCapIncrease() {
    return SingularityMilestone.improvedSingularityCap.effectValue;
  },

  get singularitiesGained() {
    return Math.floor(Math.pow(this.gainPerCapIncrease, player.celestials.laitela.singularityCapIncreases) *
        SingularityMilestone.singularityMult.effectOrDefault(1));
  },

  get capIsReached() {
    return player.celestials.laitela.darkEnergy > this.cap;
  },

  increaseCap() {
    if (player.celestials.laitela.singularityCapIncreases >= 96) return;
    player.celestials.laitela.singularityCapIncreases++;
    player.celestials.laitela.secondsSinceReachedSingularity = 0;
  },

  decreaseCap() {
    if (player.celestials.laitela.singularityCapIncreases === 0) return;
    player.celestials.laitela.singularityCapIncreases--;
  },

  perform() {
    if (!this.capIsReached) return;
    const laitela = player.celestials.laitela;
    
    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_BEFORE);

    laitela.darkEnergy = 0;
    laitela.singularities += this.singularitiesGained;
    laitela.secondsSinceReachedSingularity = 0;
    
    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_AFTER);
  }
};
