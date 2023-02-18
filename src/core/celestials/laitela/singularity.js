import { GameMechanicState } from "../../game-mechanics";

import { deepmergeAll } from "@/utility/deepmerge";

class SingularityMilestoneState extends GameMechanicState {
  constructor(config) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
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

  get increaseThreshold() {
    return this.config.increaseThreshold;
  }

  nerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    if (!softcap || (completions < softcap)) return completions;
    return softcap + (completions - softcap) / 3;
  }

  unnerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    if (!softcap || (completions < softcap)) return completions;
    return softcap + (completions - softcap) * 3;
  }

  get previousGoal() {
    if (this.isUnique) return 1;
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
    const prog = (Currency.singularities.value - this.previousGoal) / this.nextGoal;
    return formatPercents(Math.clampMax(prog, 1));
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.completions >= this.limit);
  }

  get effectDisplay() {
    if (Number.isFinite(this.effectValue)) return this.config.effectFormat(this.effectValue);
    return "N/A";
  }

  get nextEffectDisplay() {
    return this.config.effectFormat(this._rawEffect(this.completions + 1));
  }

  get description() {
    return this.config.description;
  }

  get canBeApplied() {
    return this.isUnlocked && !Pelle.isDisabled("singularity");
  }
}

export const SingularityMilestone = mapGameDataToObject(
  GameDatabase.celestials.singularityMilestones,
  config => new SingularityMilestoneState(config)
);

export const SingularityMilestones = {
  all: SingularityMilestone.all,
  lastNotified: player.celestials.laitela.lastCheckedMilestones,

  get sorted() {
    return this.all.sort((a, b) => a.remainingSingularities - b.remainingSingularities);
  },

  sortedForCompletions(moveNewToTop) {
    const options = player.celestials.laitela.singularitySorting;

    // Sorting functions for singularity milestones, values are generally around 0 to 2ish. Should generally attempt
    // to return unique values for all milestones for the sake of stable sorting
    let sortFn;
    switch (options.sortResource) {
      case SINGULARITY_MILESTONE_SORT.SINGULARITIES_TO_NEXT:
        sortFn = m => {
          // If it's maxed, we order based on the final goal value - higher goals are sorted later
          if (m.isMaxed) return 1 + Math.log10(m.isUnique ? m.nextGoal : m.previousGoal) / 1000;
          return Math.log10(m.remainingSingularities) / 100;
        };
        break;
      case SINGULARITY_MILESTONE_SORT.CURRENT_COMPLETIONS:
        // Also counts partial completion on the current step
        sortFn = m => {
          // For never-completed repeatable milestones, this is zero and will cause NaN bugs if we don't set it to 1
          const prev = Math.clampMin(m.previousGoal, 1);
          const part = Math.clamp(Math.log(Currency.singularities.value / prev) / Math.log(m.nextGoal / prev), 0, 1);
          return (m.completions + part) / 20;
        };
        break;
      case SINGULARITY_MILESTONE_SORT.PERCENT_COMPLETIONS:
        // Orders infinite milestones based on completion count, putting them after all limited ones even if
        // they're completed
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 100;
          const currComp = Math.log(Currency.singularities.value / m.previousGoal) /
            Math.log(m.nextGoal / m.previousGoal);
          return Math.clampMax((m.completions + currComp) / limit, 1) + (Number.isFinite(m.limit) ? 0 : 1);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.FINAL_COMPLETION:
        // Sorts infinite milestones as if they end at 50 steps; for any given number of completions, this
        // treats infinite milestones with larger steps as if they complete at a higher value
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 50;
          return Math.log10(m.config.start * Math.pow(m.config.repeat, limit - 1)) / 100;
        };
        break;
      case SINGULARITY_MILESTONE_SORT.MOST_RECENT:
        sortFn = m => {
          if (!m.isUnlocked) return 1 + Math.log10(m.start) / 1000;
          // For unique milestones, previousGoal is actually 1 and nextGoal contains the completion amount
          return Math.log10(m.isUnique ? m.nextGoal : m.previousGoal) / 100;
        };
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (order)");
    }

    // Shift the fully completed milestones to the front or back with a constant offset which should be larger
    // than the value that the sort function should ever evaluate to
    let completedVal;
    switch (options.showCompleted) {
      case COMPLETED_MILESTONES.FIRST:
        completedVal = 10;
        break;
      case COMPLETED_MILESTONES.LAST:
        completedVal = -10;
        break;
      case COMPLETED_MILESTONES.IGNORED:
        completedVal = 0;
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (completed milestones)");
    }

    // Compose the functions together; possibly reverse the final order and bring new milestones to the top
    const isNew = m => ((m.previousGoal > player.celestials.laitela.lastCheckedMilestones && moveNewToTop) ? 20 : 0);
    const compFn = m => (m.isMaxed ? completedVal : 0) + (options.sortOrder ? sortFn(m) : -sortFn(m)) + isNew(m);
    return this.sorted.sort((a, b) => compFn(b) - compFn(a));
  },

  get nextMilestoneGroup() {
    return this.sortedForCompletions(false).filter(m => !m.isMaxed).slice(0, 6);
  },

  get unseenMilestones() {
    const laitela = player.celestials.laitela;
    return SingularityMilestoneThresholds
      .filter(s => s > laitela.lastCheckedMilestones && Currency.singularities.gte(s));
  },

  get unnotifiedMilestones() {
    return SingularityMilestoneThresholds.filter(s => s > this.lastNotified && Currency.singularities.gte(s));
  }
};

// Sorted list of all the values where a singularity milestone exists, used for "new milestone" styling
const SingularityMilestoneThresholds = (function() {
  return SingularityMilestones.all
    .map(m => Array.range(0, Math.min(50, m.limit))
      .filter(r => !m.increaseThreshold || r <= m.increaseThreshold ||
        (r > m.increaseThreshold && ((r - m.increaseThreshold) % 3) === 2))
      .map(r => m.start * Math.pow(m.repeat, r)))
    .flat(Infinity)
    .filter(n => n < 1e100)
    .sort((a, b) => a - b);
}());

export const Singularity = {
  get cap() {
    return 200 * Math.pow(10, player.celestials.laitela.singularityCapIncreases);
  },

  get gainPerCapIncrease() {
    return SingularityMilestone.improvedSingularityCap.effectOrDefault(11);
  },

  get singularitiesGained() {
    return Math.floor(Math.pow(this.gainPerCapIncrease, player.celestials.laitela.singularityCapIncreases) *
      SingularityMilestone.singularityMult.effectOrDefault(1) *
      (1 + ImaginaryUpgrade(10).effectOrDefault(0)));
  },

  // Time (in seconds) to go from 0 DE to the condensing requirement
  get timePerCondense() {
    return this.cap / Currency.darkEnergy.productionPerSecond;
  },

  // Time (in seconds) to reach the condensing requirement from *current* DE
  get timeUntilCap() {
    return (this.cap - Currency.darkEnergy.value) / Currency.darkEnergy.productionPerSecond;
  },

  // Total additional time auto-condense will wait after reaching the condensing requirement
  get timeDelayFromAuto() {
    return this.timePerCondense * (SingularityMilestone.autoCondense.effectOrDefault(Infinity) - 1);
  },

  get capIsReached() {
    return Currency.darkEnergy.gte(this.cap);
  },

  increaseCap() {
    if (player.celestials.laitela.singularityCapIncreases >= 50) return;
    player.celestials.laitela.singularityCapIncreases++;
  },

  decreaseCap() {
    if (player.celestials.laitela.singularityCapIncreases === 0) return;
    player.celestials.laitela.singularityCapIncreases--;
  },

  perform() {
    if (!this.capIsReached || Pelle.isDoomed) return;

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_BEFORE);

    Currency.darkEnergy.reset();
    Currency.singularities.add(this.singularitiesGained);

    for (const quote of Laitela.quotes.all) {
      if (quote.requirement) {
        quote.show();
      }
    }

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_AFTER);
  }
};

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => SingularityMilestones.lastNotified = Currency.singularities.value);

EventHub.logic.on(GAME_EVENT.SINGULARITY_RESET_AFTER, () => {
  const newMilestones = SingularityMilestones.unnotifiedMilestones.length;
  if (newMilestones === 0) return;
  if (newMilestones === 1) GameUI.notify.blackHole(`You reached a Singularity milestone!`);
  else GameUI.notify.blackHole(`You reached ${formatInt(newMilestones)} Singularity milestones!`);
  SingularityMilestones.lastNotified = Currency.singularities.value;
});
