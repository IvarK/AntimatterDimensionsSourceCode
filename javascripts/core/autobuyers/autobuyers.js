"use strict";

const Autobuyers = (function() {
  const antimatterDimensions = Autobuyer.antimatterDimension.index;
  const infinityDimensions = Autobuyer.infinityDimension.index;
  const timeDimensions = Autobuyer.timeDimension.index;

  const dimensions = [antimatterDimensions, infinityDimensions, timeDimensions];

  const prestige = [
    Autobuyer.bigCrunch,
    Autobuyer.eternity,
    Autobuyer.reality,
  ];

  const singleBinary = [
    Autobuyer.replicantiGalaxy,
    Autobuyer.timeTheorem,
    Autobuyer.ipMult,
    Autobuyer.epMult,
  ];

  const single = [
    Autobuyer.tickspeed,
    Autobuyer.sacrifice,
    Autobuyer.dimboost,
    Autobuyer.galaxy,
  ].concat(singleBinary);

  const arrays = [
    Autobuyer.replicantiUpgrade.array,
    Autobuyer.dilationUpgrade.array,
    Autobuyer.blackHolePower.array,
    Autobuyer.realityUpgrade.array,
    Autobuyer.imaginaryUpgrade.array,
  ];
  const all = dimensions.concat(prestige, single, arrays);

  return {
    all: all.flat(),
    display: [dimensions.concat(arrays), singleBinary],
    antimatterDimensions,
    infinityDimensions,
    timeDimensions,
    dimensions,
    prestige,
    single,
    arrays,
    upgradeable: antimatterDimensions.concat(
      Autobuyer.tickspeed, Autobuyer.dimboost, Autobuyer.galaxy, Autobuyer.bigCrunch),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked || a.isBought);
    },

    toggle() {
      player.auto.autobuyersOn = !player.auto.autobuyersOn;
    },

    tick() {
      PerformanceStats.start("Autobuyers");

      const autobuyers = Autobuyers.all.filter(a => a.canTick);

      for (const autobuyer of autobuyers) {
        autobuyer.tick();
      }

      PerformanceStats.end();
    },

    resetTick(prestigeEvent) {
      const autobuyers = Autobuyers.all.filter(n => n.resetTick !== undefined);
      for (const autobuyer of autobuyers) {
        autobuyer.resetTick(prestigeEvent);
      }
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

EventHub.logic.on(GAME_EVENT.DIMBOOST_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.DIMENSION_BOOST));
EventHub.logic.on(GAME_EVENT.GALAXY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.ANTIMATTER_GALAXY));
EventHub.logic.on(GAME_EVENT.INFINITY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.INFINITY));
EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.ETERNITY));
EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.REALITY));
