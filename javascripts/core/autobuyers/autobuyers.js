import { Autobuyer } from "./autobuyer.js";

export const Autobuyers = (function() {
  const antimatterDimensions = Autobuyer.antimatterDimension.zeroIndexed;
  const infinityDimensions = Autobuyer.infinityDimension.zeroIndexed;
  const timeDimensions = Autobuyer.timeDimension.zeroIndexed;

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
    Autobuyer.galaxy,
    Autobuyer.dimboost,
  ].concat(singleBinary);

  const arrays = [
    Autobuyer.replicantiUpgrade.zeroIndexed,
    Autobuyer.dilationUpgrade.zeroIndexed,
    Autobuyer.blackHolePower.zeroIndexed,
    Autobuyer.realityUpgrade.zeroIndexed,
    Autobuyer.imaginaryUpgrade.zeroIndexed,
  ];
  const all = dimensions.concat(prestige, single, arrays);
  const multiple = [
    Autobuyer.antimatterDimension,
    Autobuyer.infinityDimension,
    Autobuyer.timeDimension,
    Autobuyer.replicantiUpgrade,
    Autobuyer.dilationUpgrade,
    Autobuyer.blackHolePower,
    Autobuyer.realityUpgrade,
    Autobuyer.imaginaryUpgrade,
  ];

  return {
    all: all.flat(),
    display: [multiple, singleBinary],
    upgradeable: antimatterDimensions.concat(
      Autobuyer.tickspeed,
      Autobuyer.dimboost,
      Autobuyer.galaxy,
      Autobuyer.bigCrunch,
    ),

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
