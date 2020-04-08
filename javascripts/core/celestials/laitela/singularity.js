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

    return Math.floor(
      1 +
        Math.log(player.celestials.laitela.singularities) /
          Math.log(this.repeat - Math.log(this.start) / Math.log(this.repeat))
    );
  }

  get remainingSingularities() {
    return this.nextGoal - player.celestials.laitela.singularities;
  }

  get progressToNext() {
    return (player.celestials.laitela.singularities - this.previousGoal) / this.nextGoal;
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.limit !== 0 && this.completions >= this.limit);
  }

  get effectDisplay() {
    if (this.effectValue === Infinity) return "Infinity";
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

const SingularityMilestone = SingularityMilestoneState.createAccessor(GameDatabase.celestials.singularityMilestones);

const SingularityMilestones = {
  all: SingularityMilestone.index.compact(),

  get sorted() {
    return this.all.sort((a, b) => a.remainingSingularities - b.remainingSingularities);
  },

  get sortedForCompletions() {
    return this.sorted.sort((a, b) => {
      if (a.isMaxed === b.isMaxed) return 0;
      return a.isMaxed ? 1 : -1;
    });
  },

  get nextFive() {
    return this.sortedForCompletions.slice(0, 5);
  }
};

const Singularity = {
  get cap() {
    return 1e4 * Math.pow(10, player.celestials.laitela.singularityCapIncreases);
  },

  get singularitiesGained() {
    return Math.pow(20, player.celestials.laitela.singularityCapIncreases) * SingularityMilestone(5).effectValue;
  },

  get capIsReached() {
    return player.celestials.laitela.darkEnergy > this.cap;
  },

  perform() {
    if (!this.capIsReached) return;

    player.celestials.laitela.darkEnergy = 0;
    player.celestials.laitela.singularities += this.singularitiesGained;
  },

  autobuyerLoop(diff) {
    if (this.capIsReached) {
      player.celestials.laitela.secondsSinceReachedSingularity += diff * 1000;
      if (player.celestials.laitela.secondsSinceReachedSingularity >= SingularityMilestone(6).effectValue) {
        this.perform();
        player.celestials.laitela.secondsSinceReachedSingularity = 0;
      }

      for (let i = 1; i <= SingularityMilestone(8).effectValue; i++) {
        MatterDimension(i).buyInterval();
        MatterDimension(i).buyPowerDM();
        MatterDimension(i).buyPowerDE();
      }
    }
  }
};
