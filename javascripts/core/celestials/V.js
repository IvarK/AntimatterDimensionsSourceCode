"use strict";

/**
 * Information about how to format runUnlocks:
 * id: unique id
 * name: the achievement name
 * description: Description what you need to do, for values add {value}
 * values: different values to display and check against the game
 * condition: function that takes the current value as an argument, if true completes an achievement
 * format: optional function that formats the value, defaults to format()
 */

class VRunUnlockState extends GameMechanicState {
  get completions() {
    const completions = player.celestials.v.runUnlocks[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionBaseValue() {
    const value = this.config.values[this.completions];
    return value === undefined ? this.config.values[this.completions - 1] : value;
  }

  get canBeReduced() {
    return this.completions < this.config.values.length &&
      new Decimal(this.reduction).neq(this.config.maxShardReduction(this.conditionBaseValue));
  }

  get isReduced() {
    if (player.celestials.v.goalReductionSteps[this.id] === 0) return false;
    return (V.has(V_UNLOCKS.SHARD_REDUCTION) && this.reduction > 0);
  }

  get reductionCost() {
    const stepCount = this.config.reductionStepSize ? this.config.reductionStepSize : 1;
    if (this.config.isHard) {
      // The numbers come from inside of nextHardReductionCost, this is an effective bulk-buy factor
      const modifiedStepCount = (Math.pow(1.15, stepCount) - 1) / 0.15;
      return modifiedStepCount * V.nextHardReductionCost(player.celestials.v.goalReductionSteps[this.id]);
    }
    return stepCount * V.nextNormalReductionCost();
  }

  get tiersReduced() {
    return player.celestials.v.goalReductionSteps[this.id] / 100;
  }

  get reduction() {
    const value = this.conditionBaseValue;
    return Math.clamp(this.config.shardReduction(this.tiersReduced), 0, this.config.maxShardReduction(value));
  }

  get conditionValue() {
    let value = this.conditionBaseValue;
    if (!this.isReduced) return value;
    value -= this.reduction;
    return value;
  }

  get formattedDescription() {
    return this.config.description(this.conditionValue);
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }

  tryComplete() {
    const playerData = player.celestials.v;
    const value = this.config.currentValue();
    if (this.config.condition() && Decimal.gte(value, playerData.runRecords[this.id])) {
      playerData.runRecords[this.id] = value;
      playerData.runGlyphs[this.id] = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    while (this.completions < this.config.values.length &&
    Decimal.gte(playerData.runRecords[this.id], this.conditionValue)) {
      if (!V.isFlipped && this.config.isHard) continue;
      this.completions++;
      GameUI.notify.success(`You have unlocked V-Achievement '${this.config.name}' tier ${this.completions}`);

      for (const quote of Object.values(V.quotes)) {
        // Quotes without requirements will be shown in other ways - need to check if it exists before calling though
        if (quote.requirement && quote.requirement()) {
          // TODO If multiple quotes show up simultaneously, this only seems to actually show one of them and skips the
          // rest. This might be related to the modal stacking issue
          V.quotes.show(quote);
        }
      }

      V.updateTotalRunUnlocks();
    }
  }
}

/**
 * @param {number} id
 * @return {VRunUnlockState}
 */
const VRunUnlock = VRunUnlockState.createAccessor(GameDatabase.celestials.v.runUnlocks);

const VRunUnlocks = {
  /**
   * @type {VRunUnlockState[]}
   */
  all: VRunUnlock.index.compact(),
};

const V_UNLOCKS = {
  V_ACHIEVEMENT_UNLOCK: {
    id: 0,
    reward: "Unlock V, The Celestial Of Achievements",
    description: "Meet all the above requirements simultaneously",
    requirement: () => Object.values(GameDatabase.celestials.v.mainUnlock).every(e => e.progress() >= 1)
  },
  SHARD_REDUCTION: {
    id: 1,
    reward: () => `You can spend Perk Points to reduce V-Achievement requirements for later tiers.`,
    get description() { return `Have ${formatInt(2)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 2
  },
  ND_POW: {
    id: 2,
    reward: "Antimatter Dimension power based on Space Theorems.",
    get description() { return `Have ${formatInt(5)} V-Achievements`; },
    effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
    format: x => formatPow(x, 3, 3),
    requirement: () => V.spaceTheorems >= 5
  },
  FAST_AUTO_EC: {
    id: 3,
    reward: "Achievement multiplier reduces Auto-EC completion time.",
    get description() { return `Have ${formatInt(10)} V-Achievements`; },
    effect: () => Achievements.power,
    // Base rate is 60 ECs at 20 minutes each
    format: x => `${TimeSpan.fromMinutes(60 * 20 / x).toStringShort()} for full completion`,
    requirement: () => V.spaceTheorems >= 10
  },
  AUTO_AUTOCLEAN: {
    id: 4,
    reward: "Unlock the ability to Auto Purge on Reality.",
    get description() { return `Have ${formatInt(16)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 16
  },
  ACHIEVEMENT_BH: {
    id: 5,
    reward: "Achievement multiplier affects Black Hole power.",
    get description() { return `Have ${formatInt(30)} V-Achievements`; },
    effect: () => Achievements.power,
    format: x => formatX(x, 2, 0),
    requirement: () => V.spaceTheorems >= 30
  },
  RA_UNLOCK: {
    id: 6,
    reward: "Reduce the Space Theorem cost of Time Studies by 2. Unlock Ra, Celestial of the Forgotten.",
    get description() { return `Have ${formatInt(36)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 36
  }
};

const V = {
  displayName: "V",
  spaceTheorems: 0,
  checkForUnlocks() {
    for (const key of Object.keys(V_UNLOCKS)) {
      const unl = V_UNLOCKS[key];
      if (unl.id === V_UNLOCKS.V_ACHIEVEMENT_UNLOCK.id) continue;
      if (unl.requirement() && !this.has(unl)) {
        // eslint-disable-next-line no-bitwise
        player.celestials.v.unlockBits |= (1 << unl.id);
        GameUI.notify.success(unl.description);
      }
    }

    if (this.isRunning) {
      for (const unlock of VRunUnlocks.all) {
        unlock.tryComplete();
      }
    }

    if (V.has(V_UNLOCKS.RA_UNLOCK) && !Ra.has(RA_UNLOCKS.AUTO_TP)) {
      Ra.checkForUnlocks();
    }
  },
  get canUnlockCelestial() {
    return V_UNLOCKS.V_ACHIEVEMENT_UNLOCK.requirement();
  },
  unlockCelestial() {
    // eslint-disable-next-line no-bitwise
    player.celestials.v.unlockBits |= (1 << V_UNLOCKS.V_ACHIEVEMENT_UNLOCK.id);
    GameUI.notify.success("You have unlocked V, The Celestial Of Achievements!");
    V.quotes.show(V.quotes.UNLOCK);
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.v.unlockBits & (1 << info.id));
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.v.run = true;
    this.quotes.show(this.quotes.REALITY_ENTER);
  },
  updateTotalRunUnlocks() {
    let sum = 0;
    for (let i = 0; i < player.celestials.v.runUnlocks.length; i++) {
      if (i < 6) sum += player.celestials.v.runUnlocks[i];
      else sum += player.celestials.v.runUnlocks[i] * 2;
    }
    this.spaceTheorems = sum;
  },
  reset() {
    player.celestials.v = {
      unlockBits: 0,
      run: false,
      quotes: [],
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      triadStudies: [],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      runRecords: [-10, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    this.spaceTheorems = 0;
  },
  get availableST() {
    return V.spaceTheorems - player.celestials.v.STSpent;
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get isFlipped() {
    return Ra.has(RA_UNLOCKS.HARD_V);
  },
  get isFullyCompleted() {
    return this.spaceTheorems >= 66;
  },
  nextNormalReductionCost() {
    return 1000;
  },
  nextHardReductionCost(currReductionSteps) {
    return 1000 * Math.pow(1.15, currReductionSteps);
  },
  quotes: new CelestialQuotes("v", {
    INITIAL: CelestialQuotes.singleLine(
      1, "How pathetic..."
    ),
    UNLOCK: {
      id: 2,
      lines: [
        "Welcome to my Reality.",
        "I'm surprised you could reach it.",
        "This is my realm after all...",
        "Not everyone is as great as me.",
      ]
    },
    REALITY_ENTER: {
      id: 3,
      lines: [
        "Good luck with that!",
        "You'll need it.",
        "My reality is flawless. You will fail.",
      ]
    },
    REALITY_COMPLETE: {
      id: 4,
      lines: [
        "So fast...",
        "Don't think so much of yourself.",
        "This is just the beginning.",
        "You will never be better than me.",
      ]
    },
    ACHIEVEMENT_1: {
      id: 5,
      requirement: () => V.spaceTheorems >= 1,
      lines: [
        "Only one? Pathetic.",
        "Your accomplishments pale in comparison to mine.",
      ]
    },
    ACHIEVEMENT_6: {
      id: 6,
      requirement: () => V.spaceTheorems >= 6,
      lines: [
        "This is nothing.",
        "Don't be so full of yourself.",
      ]
    },
    HEX_1: {
      id: 7,
      requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 1,
      lines: [
        "Don't think it'll get any easier from now on.",
        "You're awfully proud for such a little achievement.",
      ]
    },
    ACHIEVEMENT_12: {
      id: 8,
      requirement: () => V.spaceTheorems >= 12,
      lines: [
        "How did you...",
        "This barely amounts to anything!",
        "You will never complete them all.",
      ]
    },
    ACHIEVEMENT_24: {
      id: 9,
      requirement: () => V.spaceTheorems >= 24,
      lines: [
        "Impossible...",
        "After how difficult it was for me...",
      ]
    },
    HEX_3: {
      id: 10,
      requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 3,
      lines: [
        "No... No... No...",
        "This can't be...",
      ]
    },
    ALL_ACHIEVEMENTS: {
      id: 11,
      requirement: () => V.spaceTheorems >= 36,
      lines: [
        "I... how did you do it...",
        "I worked so hard to get them...",
        "I am the greatest...",
        "No one is better than me...",
        "No one... no one... no on-",
      ]
    }
  }),
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.v.isOpen) V.quotes.show(V.quotes.INITIAL);
});
