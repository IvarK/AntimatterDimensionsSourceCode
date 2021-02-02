"use strict";

const Autobuyers = (function() {
  const antimatterDims = AntimatterDimensionAutobuyerState.index;
  const infinityDims = InfinityDimensionAutobuyerState.index;
  const timeDims = TimeDimensionAutobuyerState.index;
  const dimensions = antimatterDims.concat(infinityDims, timeDims);
  const prestige = [
    Autobuyer.bigCrunch,
    Autobuyer.eternity,
    Autobuyer.reality,
  ];
  const single = [
    Autobuyer.tickspeed,
    Autobuyer.sacrifice,
    Autobuyer.dimboost,
    Autobuyer.galaxy,
    Autobuyer.replicantiGalaxy,
    Autobuyer.timeTheorem,
    Autobuyer.ipMult,
    Autobuyer.epMult,
  ];
  const other = BlackHolePowerAutobuyerState.index.concat(
                RealityUpgradeAutobuyerState.index,
                ReplicantiUpgradeAutobuyerState.index,
                DilationUpgradeAutobuyerState.index
    );
  const all = dimensions.concat(prestige, single, other);

  return {
    all,
    dimensions,
    prestige,
    single,
    other,
    upgradeable: antimatterDims.concat([Autobuyer.tickspeed]),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked || a.isBought);
    },

    toggle() {
      player.auto.autobuyersOn = !player.auto.autobuyersOn;
    },

    tick() {
      PerformanceStats.start("Autobuyers");

      const priorityQueue = [Autobuyer.tickspeed]
        .concat(antimatterDims)
        .sort((a, b) => a.priority - b.priority);

      const autobuyers = prestige
        .concat(single, other, infinityDims, timeDims)
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
