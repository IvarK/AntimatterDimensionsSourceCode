"use strict";

class SingularityMilestoneState extends GameMechanicState {

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

    get completions() {
        if (this.isUnique) return this.isUnlocked ? 1 : 0;
        return Math.max(
            Math.min(
                Math.floor(1 + (player.celestials.laitela.singularities - this.start) / this.repeat)
            , this.limit === 0 ? Infinity : this.limit)
        , 0);
    }

    get remainingSingularities() {
        return this.start + this.repeat * (this.completions) - player.celestials.laitela.singularities;
    }

    get progressToNext() {
        if (this.completions === 0) {
            return formatPercents(
                1 - (this.start - player.celestials.laitela.singularities) / this.start
            );
        }

        return formatPercents(
            (player.celestials.laitela.singularities - this.start - this.repeat * (this.completions - 1)) / this.repeat
        );
    }

    get isMaxed() {
        return (this.isUnique && this.isUnlocked) ||
               (this.limit !== 0 && this.completions >= this.limit);
    }

    get effect() {
        return this.config.effect(this.completions);
    }

    get effectDisplay() {
        if (this.effect === Infinity) return "Infinity";
        return this.config.effectFormat(this.effect);
    }

    get nextEffectDisplay() {
        return this.config.effectFormat(this.config.effect(this.completions + 1));
    }

    get description() {
        return this.config.description;
    }
}


const SingularityMilestone = SingularityMilestoneState.createAccessor(GameDatabase.celestials.singularityMilestones);

const SingularityMilestones = {
  all: SingularityMilestone.index.compact(),

  get sorted() {
    return this.all
        .sort((a, b) => a.remainingSingularities - b.remainingSingularities);
  },

  get sortedForCompletions() {
    return this.sorted
        .sort((a, b) => {
            if (a.isMaxed === b.isMaxed) return 0;
            return a.isMaxed ? 1 : -1;
        });
  },

  get nextFive() {
    return this.sortedForCompletions
        .slice(0, 5);
  }
};

const Singularity = {

    get cap() {
        return 1e4 * Math.pow(10, player.celestials.laitela.singularityCapIncreases);
    },

    get singularitiesGained() {
        return Math.pow(20, player.celestials.laitela.singularityCapIncreases);
    },

    get capIsReached() {
        return player.celestials.laitela.darkEnergy > this.cap;
    },

    perform() {
        if (!this.capIsReached) return;

        player.celestials.laitela.darkEnergy = 0;
        player.celestials.laitela.singularities += this.singularitiesGained;
    }
};