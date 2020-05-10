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

const SingularityMilestone =  (function() {
  const db = GameDatabase.celestials.singularityMilestones;
  return {
    continuumMult: new SingularityMilestoneState(db.continuumMult),
    darkMatterMult: new SingularityMilestoneState(db.darkMatterMult),
    darkEnergyMult: new SingularityMilestoneState(db.darkEnergyMult),
    darkDimensionCostReduction: new SingularityMilestoneState(db.darkDimensionCostReduction),
    singularityMult: new SingularityMilestoneState(db.singularityMult),
    autoCondense: new SingularityMilestoneState(db.autoCondense),
    darkDimensionIntervalReduction: new SingularityMilestoneState(db.darkDimensionIntervalReduction),
    darkDimensionAutobuyers: new SingularityMilestoneState(db.darkDimensionAutobuyers),
    darkMatterFromTesseracts: new SingularityMilestoneState(db.darkMatterFromTesseracts),
    dilatedTimeFromSingularities: new SingularityMilestoneState(db.dilatedTimeFromSingularities),
    darkEnergyFromGlyphLevel: new SingularityMilestoneState(db.darkEnergyFromGlyphLevel),
    momentumFromSingularities: new SingularityMilestoneState(db.momentumFromSingularities),
    darkMultiplierFromAnnihilation: new SingularityMilestoneState(db.darkMultiplierFromAnnihilation),
    annihilationBoostFromSingularities: new SingularityMilestoneState(db.annihilationBoostFromSingularities),
    darkEnergyFromGamespeed: new SingularityMilestoneState(db.darkEnergyFromGamespeed),
    glyphLevelFromSingularities: new SingularityMilestoneState(db.glyphLevelFromSingularities),
    darkMatterFromDilatedTime: new SingularityMilestoneState(db.darkMatterFromDilatedTime),
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

  get singularitiesGained() {
    return Math.pow(20, player.celestials.laitela.singularityCapIncreases) *
      SingularityMilestone.singularityMult.effectOrDefault(1);
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
  },

  autobuyerLoop(diff) {
    const laitela = player.celestials.laitela;

    for (let i = 1; i <= SingularityMilestone.darkDimensionAutobuyers.effectValue; i++) {
      MatterDimension(i).buyInterval();
      MatterDimension(i).buyPowerDM();
      MatterDimension(i).buyPowerDE();
    }

    if (Laitela.darkMatterMultGain >= laitela.autoAnnihilationSetting && Laitela.darkMatterMult > 1) {
      Laitela.annihilate();
    }

    if (this.capIsReached) {
      laitela.secondsSinceReachedSingularity += diff / 1000;
      if (laitela.secondsSinceReachedSingularity >= SingularityMilestone.autoCondense.effectValue) {
        this.perform();
      }
    }
  }
};
