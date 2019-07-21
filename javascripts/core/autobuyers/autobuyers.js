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
    intervaled: dimensions
      .concat([
        Autobuyer.tickspeed,
        Autobuyer.dimboost,
        Autobuyer.galaxy,
        Autobuyer.sacrifice,
        Autobuyer.bigCrunch
      ]),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked);
    },

    toggle() {
      player.options.autobuyersOn = !player.options.autobuyersOn;
    },

    tick() {
      PerformanceStats.start("Autobuyers");

      const priorityQueue = [Autobuyer.tickspeed]
        .concat(dimensions)
        .sort((a, b) => a.priority - b.priority);

      const autobuyers = [
        Autobuyer.reality,
        Autobuyer.eternity,
        Autobuyer.bigCrunch,
        Autobuyer.galaxy,
        Autobuyer.dimboost,
        Autobuyer.sacrifice
      ]
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

EventHub.logic.on(GameEvent.ETERNITY_RESET_AFTER, () => Autobuyers.reset());
EventHub.logic.on(GameEvent.REALITY_RESET_AFTER, () => Autobuyers.reset());
