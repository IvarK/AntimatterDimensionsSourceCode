"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    famineUnlock: {
      id: 1,
      description: "Unlock Famine",
      cost: 25,
      currency: "unstableMatter"
    },
    longerArmageddon: {
      id: 2,
      description: "Armageddon happens every 5 seconds",
      cost: 50,
      currency: "unstableMatter"
    },
    timeMultToUnstable: {
      id: 3,
      description: "Get more unstable matter based on Armageddon length",
      cost: 10,
      currency: "famine",
      effect: () => (Pelle.armageddonInterval / 500) ** 1.1,
      formatEffect: x => formatX(x, 2, 2)
    },
    ipGain: {
      id: 4,
      description: "You can gain IP on Infinity again",
      cost: 2e3,
      currency: "unstableMatter"
    },
    achievementsBack: {
      id: 5,
      description: "You gain back the disabled achievement rewards",
      cost: 100,
      currency: "famine"
    },
    famineRebuyable: {
      id: 6,
      description: "You can spend famine on permanent tickspeed",
      cost: 3e4,
      currency: "unstableMatter"
    },
    retainIP: {
      id: 7,
      description: "You retain IP on Armageddon",
      cost: 200,
      currency: "famine"
    },
    nerfedIPMult: {
      id: 8,
      description: "Get back your IP multipliers, but their effects are raised to the power of 0.3",
      cost: 1e5,
      currency: "unstableMatter"
    },
    famineGain: {
      id: 9,
      description: "Famine gain is twice as fast and produce twice as much",
      cost: 300,
      currency: "famine"
    },
    infDimRetain: {
      id: 10,
      description: "Infinity Dimensions aren't reset on Armageddon",
      cost: 500,
      currency: "famine"
    },
    doubleArmageddon: {
      id: 11,
      description: "Armageddon takes twice as long",
      cost: 2e5,
      currency: "unstableMatter"
    },
    nerfedGalaxies: {
      id: 12,
      description: "You can buy galaxies, but they are only 1/3rd as effective",
      cost: 1000,
      currency: "famine"
    },
    infinitiedGain: {
      id: 13,
      description: "You gain back the ability to gain multiple infinitied stat per Infinity",
      cost: 1e23,
      currency: "infinityPoints"
    },
    morePermanentTickspeed: {
      id: 14,
      description: "Gain 3x more permanent tickspeed upgrades from Famine buyable",
      cost: 3e5,
      currency: "unstableMatter"
    },
    moreFamine: {
      id: 15,
      description: "Gain 5x more Famine",
      cost: 1e50,
      currency: "infinityPoints"
    },
    antimatterGalaxyBoost: {
      id: 16,
      description: "Galaxies are 10% more effective",
      cost: new Decimal("1e20000"),
      currency: "antimatter",
      effect: 1.1
    },
    pestilenceUnlock: {
      id: 17,
      description: "Unlock Pestilence",
      cost: 3e3,
      currency: "famine"
    },
    passivePrestigeGain: {
      id: 18,
      description: "Gain back infinitied stat generation",
      cost: Number.MAX_VALUE,
      currency: "infinityPoints"
    },
    epGain: {
      id: 19,
      description: "You can gain eternity points",
      cost: new Decimal("1e100000"),
      currency: "antimatter"
    },
    studiesUnlock: {
      id: 20,
      description: "You can buy Time Studies with Time Theorems, but they cost 2x as much",
      cost: 1e5,
      currency: "famine"
    },
    pestilenceRebuyable: {
      id: 21,
      description: "You can buy permanent dimension boosts with Pestilence",
      cost: 100,
      currency: "pestilence"
    },
    retainTimeStudies: {
      id: 22,
      description: "You keep your Time Studies and Time Theorems on Armageddon",
      cost: new Decimal("1e200000"),
      currency: "antimatter"
    },
    retainEternityUpgrades: {
      id: 23,
      description: "You keep your Eternity Upgrades on Armageddon",
      cost: 5e5,
      currency: "unstableMatter"
    },
    retainTimeDimensions: {
      id: 24,
      description: "You keep your Time Dimensions on Armageddon",
      cost: new Decimal("1e750"),
      currency: "infinityPoints"
    },
    retainEP: {
      id: 25,
      description: "You keep your Eternity Points on Armageddon",
      cost: 500,
      currency: "pestilence"
    },
    nerfedEPMult: {
      id: 26,
      description: "Get back your EP multipliers, but their effects are raised to the power of 0.2",
      cost: 1e5,
      currency: "eternityPoints"
    },
    eternityGain: {
      id: 27,
      description: "Get back passive Eternity gain",
      cost: 3e5,
      currency: "famine"
    },
    rgMultToUnstable: {
      id: 28,
      description: "Unstable Matter gain is multiplied by your current Replicated Galaxies",
      cost: new Decimal("1e400000"),
      currency: "antimatter",
      effect: () => Math.max(Replicanti.galaxies.total, 1),
      formatEffect: x => formatX(x, 2, 0)
    },
    morePermanentDimBoosts: {
      id: 29,
      description: "Gain 5x more permanent Dimension Boosts from the Pestilence buyable",
      cost: new Decimal("1e1750"),
      currency: "infinityPoints"
    },
    passiveUnstableMatter: {
      id: 30,
      description: "Gain 30% of Unstable Matter gained on Armageddon every second.",
      cost: 1e8,
      currency: "unstableMatter"
    },
    passiveEP: {
      id: 31,
      description: "Gain back the EP generation from Teresa.",
      cost: 1e9,
      currency: "eternityPoints"
    },
    chaosUnlock: {
      id: 32,
      description: "Unlock Chaos.",
      cost: 5e3,
      currency: "pestilence"
    },
    moreIPMultipliers: {
      id: 33,
      description: "IP multipliers are raised to the power of 0.6 instead of 0.3.",
      cost: 2e6,
      currency: "famine"
    },
    infDimMultiplier: {
      id: 34,
      description: () => `Infinity Dimensions are ${formatX(1e200, 0, 0)} more effective.`,
      cost: 100,
      currency: "chaos",
      effect: 1e200
    },
    unspentTTArmageddon: {
      id: 35,
      description: "Unspent Time Theorems increase the armageddon duration.",
      cost: new Decimal("1e4250"),
      currency: "infinityPoints",
      effect: () => {
        if (!PelleUpgrade.armageddonTimeMultImprove.canBeApplied) return Currency.timeTheorems.value.pow(0.1).max(1).toNumber();
        return Math.max(TimeTheorems.totalPurchased() ** 0.1, 1);
      },
      formatEffect: x => formatX(x, 2, 2)
    },
    chaosEffect1stAnd4th: {
      id: 36,
      description: "Chaos affects 1st and 4th dimensions also.",
      cost: new Decimal("1e1000000"),
      currency: "antimatter"
    },
    chaosRebuyable: {
      id: 37,
      description: "You can buy permanent galaxies with Chaos.",
      cost: 500,
      currency: "chaos"
    },
    timeDimMultiplier: {
      id: 38,
      description: () => `Time Dimensions are ${formatX(1e20, 0, 0)} more effective.`,
      cost: 1e17,
      currency: "eternityPoints",
      effect: 1e20
    },
    epMultiplierFromUnstableMatter: {
      id: 39,
      description: "Unstable matter multiplies EP gain",
      cost: 3e8,
      currency: "unstableMatter",
      effect: () => Currency.unstableMatter.value.pow(0.5),
      formatEffect: x => formatX(x, 2, 2)
    },
    chaosMultiplier: {
      id: 40,
      description: "Gain more Chaos based on EP",
      cost: new Decimal("1e1500000"),
      currency: "antimatter",
      effect: () => Currency.eternityPoints.value.log10() ** 0.3,
      formatEffect: x => formatX(x, 2, 2)
    },
    autoEc: {
      id: 41,
      description: "Automatically complete a single EC every 3 seconds",
      cost: new Decimal("1e6500"),
      currency: "infinityPoints",
      effect: 3
    },
    longArmageddonBoost: {
      id: 42,
      description: () => `Antimatter Dimensions are ${formatPow(1.05, 2, 2)} stronger if armageddon has lasted over ${format(100)} seconds.`,
      cost: 1e35,
      currency: "eternityPoints",
      effect: 1.05
    },
    moreEPMultipliers: {
      id: 43,
      description: "EP multipliers are raised to the power of 0.4 instead of 0.2.",
      cost: new Decimal("1e2750000"),
      currency: "antimatter"
    },
    chaosMultFromRebuyables: {
      id: 44,
      description: "Chaos gain is multiplied based on Chaos rebuyables bought",
      cost: new Decimal("1e35000"),
      currency: "infinityPoints",
      effect: () => 1.3 ** player.celestials.pelle.rebuyables.permanentGalaxies,
      formatEffect: x => formatX(x, 2, 2)
    },
    morePermanentGalaxies: {
      id: 45,
      description: () => `Gain ${formatX(4)} more permanent Galaxies from the Chaos buyable`,
      cost: 1e5,
      currency: "chaos"
    },
    pestilenceMultFromRebuyables: {
      id: 46,
      description: "Pestilence gain is multiplied based on Pestilence rebuyables bought",
      cost: 1e150,
      currency: "eternityPoints",
      effect: () => 1.2 ** player.celestials.pelle.rebuyables.permanentDimensionBoosts,
      formatEffect: x => formatX(x, 2, 2)
    },
    dimensionBoostPower: {
      id: 47,
      description: () => `Dimension Boosts are ${formatX(1e5)} stronger`,
      cost: new Decimal("1e40000000"),
      currency: "antimatter",
      effect: 1e5
    },
    famineMultFromRebuyables: {
      id: 48,
      description: "Famine gain is multiplied based on Famine rebuyables bought",
      cost: new Decimal("1e200000"),
      currency: "infinityPoints",
      effect: () => 1.2 ** player.celestials.pelle.rebuyables.permanentTickspeed,
      formatEffect: x => formatX(x, 2, 2)
    },
    armageddonTimeMultImprove: {
      id: 49,
      description: "The multiplier to Armageddon duration from unspent Time Theorems is now based on total Time Theorems instead",
      cost: 1e10,
      currency: "pestilence"
    },
    replicantiSpeedMultipliers: {
      id: 50,
      description: "Gain back replicanti speed multipliers, but they are ^0.1 as effective",
      cost: 1e10,
      currency: "dilatedTime"
    },
    passiveTPGain: {
      id: 51,
      description: "Gain Tachyon Particles outside Dilation",
      cost: 1e12,
      currency: "dilatedTime"
    },
    nerfedTPMult: {
      id: 52,
      description: "You gain back your Tachyon Particle multipliers, but they are ^0.1 as effective",
      cost: new Decimal("1e2000000000"),
      currency: "antimatter"
    },
    chaosAllDimensions: {
      id: 53,
      description: "Chaos effect affects all dimensions except 8th",
      cost: 5e7,
      currency: "chaos"
    },
    infinityDimensionPower: {
      id: 54,
      description: () => `Infinity Dimensions are ${formatPow(1.1, 2, 2)} stronger if armageddon has lasted over ${format(450)} seconds.`,
      cost: new Decimal("1e15000000"),
      currency: "infinityPoints",
      effect: 1.1
    },
    firstGlyph: {
      id: 55,
      description: () => `You can equip a single glyph, its level is forced to 10`,
      cost: new Decimal("1e40000"),
      currency: "eternityPoints"
    },
  },
  rebuyables: {
    permanentTickspeed: {
      id: "permanentTickspeed",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentTickspeed + 1) * 15;

        if (player.celestials.pelle.rebuyables.permanentTickspeed > 50) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentTickspeed - 50)
        }

        if (player.celestials.pelle.rebuyables.permanentTickspeed > 100) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentTickspeed - 100)
        }

        return base;
      },
      description: () => `Gain ${PelleUpgrade.morePermanentTickspeed.canBeApplied ? 30 : 10} permanent tickspeed upgrades`,
      currency: "famine",
      effect: () => {
        let base = player.celestials.pelle.rebuyables.permanentTickspeed * 10
        if (PelleUpgrade.morePermanentTickspeed.canBeApplied) base *= 3;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    },
    permanentDimensionBoosts: {
      id: "permanentDimensionBoosts",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentDimensionBoosts + 1) * 25;

        if (player.celestials.pelle.rebuyables.permanentDimensionBoosts > 25) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentDimensionBoosts - 25)
        }
        
        if (player.celestials.pelle.rebuyables.permanentDimensionBoosts > 50) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentDimensionBoosts - 50)
        }

        return base;
      },
      description: () => `Gain ${PelleUpgrade.morePermanentDimBoosts.canBeApplied ? 50 : 10} permanent Dimension Boosts`,
      currency: "pestilence",
      effect: () => {
        let base = player.celestials.pelle.rebuyables.permanentDimensionBoosts * 10;
        if (PelleUpgrade.morePermanentDimBoosts.canBeApplied) base *= 5;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    },
    permanentGalaxies: {
      id: "permanentGalaxies",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentGalaxies + 1) * 100;

        if (player.celestials.pelle.rebuyables.permanentGalaxies > 10) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentGalaxies - 10)
        }
        
        if (player.celestials.pelle.rebuyables.permanentGalaxies > 20) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentGalaxies - 20)
        }

        return base;
      },
      description: () => `Gain ${PelleUpgrade.morePermanentGalaxies.canBeApplied ? 4 : "a"} permanent Galax${PelleUpgrade.morePermanentGalaxies.canBeApplied ? "ies" : "y"}`,
      currency: "chaos",
      effect: () => {
        let base = player.celestials.pelle.rebuyables.permanentGalaxies;
        if (PelleUpgrade.morePermanentGalaxies.canBeApplied) base *= 4;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    }
  }
};