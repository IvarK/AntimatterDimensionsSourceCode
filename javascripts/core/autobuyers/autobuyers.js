"use strict";

const Autobuyers = (function() {
  const dimensions = DimensionAutobuyerState.index;
  const all = dimensions
    .concat([
      Autobuyer.tickspeed,
      Autobuyer.dimboost,
      Autobuyer.galaxy,
      Autobuyer.bigCrunch,
      Autobuyer.sacrifice,
      Autobuyer.eternity,
      Autobuyer.reality
    ]);

  return {
    all,
    dimensions,
    withPriority: [Autobuyer.tickspeed].concat(dimensions),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked);
    },

    toggle() {
      const unlocked = Autobuyers.unlocked;
      if (unlocked.length === 0) return;
      const isOn = unlocked[0].isOn;
      for (const autobuyer of unlocked) {
        autobuyer.isOn = !isOn;
      }
    },

    tick() {
      PerformanceStats.start("Autobuyers");

      Autobuyer.reality.tick();
      Autobuyer.eternity.tick();
      Autobuyer.bigCrunch.tick();
      Autobuyer.galaxy.tick();
      Autobuyer.dimboost.tick();
      Autobuyer.sacrifice.tick();

      const priorityQueue = Autobuyers.withPriority
        .filter(a => a.isUnlocked)
        .sort((a, b) => a.priority - b.priority);
      for (const autobuyer of priorityQueue) {
        autobuyer.tick();
      }

      PerformanceStats.end();
    }
  };
}());

/**
 * @type {AutobuyerState[]}
 */
Autobuyer.unlockables = Autobuyers.dimensions
  .concat([
    Autobuyer.tickspeed,
    Autobuyer.dimboost,
    Autobuyer.galaxy,
    Autobuyer.sacrifice,
    Autobuyer.bigCrunch
  ]);

Autobuyer.tryUnlockAny = function() {
  for (const autobuyer of this.unlockables) {
    autobuyer.tryUnlock();
  }
};

Autobuyer.resetUnlockables = function() {
  player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  Autobuyer.tryUnlockAny();
};

Autobuyer.checkIntervalAchievements = function() {
  Achievement(52).tryUnlock();
  Achievement(53).tryUnlock();
};

Autobuyer.checkBulkAchievements = function() {
  Achievement(61).tryUnlock();
  SecretAchievement(38).tryUnlock();
};

Autobuyer.convertPropertiesToDecimal = function() {
  if (
    player.autobuyers[11] % 1 !== 0 &&
    player.autobuyers[11].priority !== undefined &&
    player.autobuyers[11].priority !== null &&
    player.autobuyers[11].priority !== "undefined"
  ) {
    player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority);
  }
};
