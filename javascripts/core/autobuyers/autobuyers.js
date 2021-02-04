"use strict";

const Autobuyers = (function() {
  const antimatterDimensions = Autobuyer.antimatterDimension.index;
  const infinityDimensions = Autobuyer.infinityDimension.index;
  const timeDimensions = Autobuyer.timeDimension.index;
  const dimensions = [antimatterDimensions, infinityDimensions, timeDimensions];
  const prestige = [
    [Autobuyer.bigCrunch],
    [Autobuyer.eternity],
    [Autobuyer.reality],
  ];
  const singleBinary = [
    [Autobuyer.replicantiGalaxy],
    [Autobuyer.timeTheorem],
    [Autobuyer.ipMult],
    [Autobuyer.epMult],
  ];
  const single = [
    [Autobuyer.tickspeed],
    [Autobuyer.sacrifice],
    [Autobuyer.dimboost],
    [Autobuyer.galaxy],
  ].concat(singleBinary);
  const other = [
    Autobuyer.replicantiUpgrade.index,
    Autobuyer.dilationUpgrade.index,
    Autobuyer.realityUpgrade.index,
    Autobuyer.blackHolePower.index,
  ];
  const all = dimensions.concat(prestige, single, other);

  return {
    all: all.flat(),
    display: [dimensions, other, singleBinary],
    antimatterDimensions,
    infinityDimensions,
    timeDimensions,
    dimensions,
    prestige,
    single,
    other,
    upgradeable: antimatterDimensions.concat([Autobuyer.tickspeed]),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked || a.isBought);
    },

    toggle() {
      player.auto.autobuyersOn = !player.auto.autobuyersOn;
    },

    tick() {
      PerformanceStats.start("Autobuyers");

      const priorityQueue = [Autobuyer.tickspeed]
        .concat(antimatterDimensions)
        .sort((a, b) => a.priority - b.priority);

      const autobuyers = prestige.flat()
        .concat(single.flat(), other.flat(), infinityDimensions, timeDimensions)
        .concat(priorityQueue)
        .filter(a => a.canTick);

      for (const autobuyer of autobuyers) {
        autobuyer.tick();
      }

      PerformanceStats.end();
    },

    reset() {
      for (const autobuyer of Autobuyers.all) {
        autobuyer.reset();
      }
    }
  };
}());

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => Autobuyers.reset());
EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => Autobuyers.reset());
