import { AnnihilationAutobuyerState } from "./annihilation-autobuyer";
import { AntimatterDimensionAutobuyerState } from "./antimatter-dimension-autobuyer";
import { BigCrunchAutobuyerState } from "./big-crunch-autobuyer";
import { BlackHolePowerAutobuyerState } from "./black-hole-power-autobuyer";
import { DarkMatterDimensionAscensionAutobuyerState } from "./dark-matter-dimension-ascension-autobuyer";
import { DarkMatterDimensionAutobuyerState } from "./dark-matter-dimension-autobuyer";
import { DilationUpgradeAutobuyerState } from "./dilation-upgrade-autobuyer";
import { DimBoostAutobuyerState } from "./dimboost-autobuyer";
import { EternityAutobuyerState } from "./eternity-autobuyer";
import { GalaxyAutobuyerState } from "./galaxy-autobuyer";
import { ImaginaryUpgradeAutobuyerState } from "./imaginary-upgrade-autobuyer";
import { InfinityDimensionAutobuyerState } from "./infinity-dimension-autobuyer";
import { EPMultAutobuyerState, IPMultAutobuyerState } from "./prestige-currency-multiplier-autobuyer";
import { RealityAutobuyerState } from "./reality-autobuyer";
import { RealityUpgradeAutobuyerState } from "./reality-upgrade-autobuyer";
import { ReplicantiGalaxyAutobuyerState } from "./replicanti-galaxy-autobuyer";
import { ReplicantiUpgradeAutobuyerState } from "./replicanti-upgrade-autobuyer";
import { SacrificeAutobuyerState } from "./sacrifice-autobuyer";
import { SingularityAutobuyerState } from "./singularity-autobuyer";
import { TickspeedAutobuyerState } from "./tickspeed-autobuyer";
import { TimeDimensionAutobuyerState } from "./time-dimension-autobuyer";
import { TimeTheoremAutobuyerState } from "./time-theorem-autobuyer";

export const Autobuyer = {
  annihilation: new AnnihilationAutobuyerState(),
  antimatterDimension: AntimatterDimensionAutobuyerState.createAccessor(),
  bigCrunch: new BigCrunchAutobuyerState(),
  blackHolePower: BlackHolePowerAutobuyerState.createAccessor(),
  darkMatterDimsAscension: new DarkMatterDimensionAscensionAutobuyerState(),
  darkMatterDims: new DarkMatterDimensionAutobuyerState(),
  dilationUpgrade: DilationUpgradeAutobuyerState.createAccessor(),
  dimboost: new DimBoostAutobuyerState(),
  eternity: new EternityAutobuyerState(),
  galaxy: new GalaxyAutobuyerState(),
  imaginaryUpgrade: ImaginaryUpgradeAutobuyerState.createAccessor(),
  infinityDimension: InfinityDimensionAutobuyerState.createAccessor(),
  ipMult: new IPMultAutobuyerState(),
  epMult: new EPMultAutobuyerState(),
  reality: new RealityAutobuyerState(),
  realityUpgrade: RealityUpgradeAutobuyerState.createAccessor(),
  replicantiGalaxy: new ReplicantiGalaxyAutobuyerState(),
  replicantiUpgrade: ReplicantiUpgradeAutobuyerState.createAccessor(),
  sacrifice: new SacrificeAutobuyerState(),
  singularity: new SingularityAutobuyerState(),
  tickspeed: new TickspeedAutobuyerState(),
  timeDimension: TimeDimensionAutobuyerState.createAccessor(),
  timeTheorem: new TimeTheoremAutobuyerState()
};

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

  const single = [
    Autobuyer.sacrifice,
    Autobuyer.replicantiGalaxy,
    Autobuyer.timeTheorem,
    Autobuyer.ipMult,
    Autobuyer.epMult,
    Autobuyer.darkMatterDims,
    Autobuyer.darkMatterDimsAscension,
    Autobuyer.singularity,
    Autobuyer.annihilation,
  ];

  const singleComplex = [
    Autobuyer.tickspeed,
    Autobuyer.galaxy,
    Autobuyer.dimboost,
  ].concat(single);

  const arrays = [
    Autobuyer.replicantiUpgrade.zeroIndexed,
    Autobuyer.dilationUpgrade.zeroIndexed,
    Autobuyer.blackHolePower.zeroIndexed,
    Autobuyer.realityUpgrade.zeroIndexed,
    Autobuyer.imaginaryUpgrade.zeroIndexed,
  ];
  const all = dimensions.concat(prestige, singleComplex, arrays);
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
    display: [multiple, single],
    upgradeable: antimatterDimensions.concat(
      Autobuyer.tickspeed,
      Autobuyer.dimboost,
      Autobuyer.galaxy,
      Autobuyer.bigCrunch,
    ),

    get unlocked() {
      return Autobuyers.all.filter(a => a.isUnlocked || a.isBought);
    },

    get hasAutobuyersForEditModal() {
      return [Autobuyer.dimboost,
        Autobuyer.galaxy,
        Autobuyer.bigCrunch,
        Autobuyer.eternity,
        Autobuyer.reality].some(autobuyer => autobuyer.isUnlocked);
    },

    toggle() {
      player.auto.autobuyersOn = !player.auto.autobuyersOn;
    },

    tick() {
      if (!player.auto.autobuyersOn) return;
      PerformanceStats.start("Autobuyers");

      // The canTick condition must be checked after the previous autobuyer has triggered
      // in order to avoid slow dimension autobuyers.
      for (const autobuyer of Autobuyers.all) {
        if (autobuyer.canTick) autobuyer.tick();
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
EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.INFINITY));
EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.ETERNITY));
EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => Autobuyers.resetTick(PRESTIGE_EVENT.REALITY));
