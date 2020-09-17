"use strict";

GameDatabase.celestials.alchemy = {
  resources: {
    // T1 resources (Non-Effarig "base" resources)
    [ALCHEMY_RESOURCE.POWER]: {
      name: "Power",
      symbol: "Ω",
      isBaseResource: true,
      effect: amount => 1 + amount / 200000,
      tier: 1,
      uiOrder: 1,
      isUnlocked: () => Ra.pets.effarig.level >= 2,
      lockText: "Effarig Level 2",
      formatEffect: value => `Antimatter Dimension multipliers ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.INFINITY]: {
      name: "Infinity",
      symbol: "∞",
      isBaseResource: true,
      effect: amount => 1 + amount / 200000,
      tier: 1,
      uiOrder: 2,
      isUnlocked: () => Ra.pets.effarig.level >= 3,
      lockText: "Effarig Level 3",
      formatEffect: value => `Infinity Dimension multipliers ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.TIME]: {
      name: "Time",
      symbol: "Δ",
      isBaseResource: true,
      effect: amount => 1 + amount / 200000,
      tier: 1,
      uiOrder: 3,
      isUnlocked: () => Ra.pets.effarig.level >= 4,
      lockText: "Effarig Level 4",
      formatEffect: value => `Time Dimension multipliers ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.REPLICATION]: {
      name: "Replication",
      symbol: "Ξ",
      isBaseResource: true,
      effect: amount => Decimal.pow10(amount / 1000),
      tier: 1,
      uiOrder: 4,
      isUnlocked: () => Ra.pets.effarig.level >= 5,
      lockText: "Effarig Level 5",
      formatEffect: value => `Replication speed is increased by ${formatX(value, 2, 2)}`
    },
    [ALCHEMY_RESOURCE.DILATION]: {
      name: "Dilation",
      symbol: "Ψ",
      isBaseResource: true,
      effect: amount => Decimal.pow10(amount / 2000),
      tier: 1,
      uiOrder: 5,
      isUnlocked: () => Ra.pets.effarig.level >= 6,
      lockText: "Effarig Level 6",
      formatEffect: value => `Dilated Time production is increased by ${formatX(value, 2, 2)}`
    },

    // T2 resources (combinations of pairs of T1 resources)
    [ALCHEMY_RESOURCE.CARDINALITY]: {
      name: "Cardinality",
      symbol: "α",
      isBaseResource: false,
      effect: amount => 1 + 0.2 / (1 + amount / 20000),
      tier: 2,
      uiOrder: 3,
      isUnlocked: () => Ra.pets.effarig.level >= 8,
      lockText: "Effarig Level 8",
      formatEffect: value => `Replicanti interval increases slower ${formatX(1.2, 1, 1)} ➜ ` +
        `${formatX(value, 4, 4)} per ${format(Number.MAX_VALUE, 2)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.TIME,
          amount: 8
        },
        {
          resource: ALCHEMY_RESOURCE.REPLICATION,
          amount: 7
        }
      ]
    },
    [ALCHEMY_RESOURCE.ETERNITY]: {
      name: "Eternity",
      symbol: "τ",
      isBaseResource: false,
      effect: amount => 1 + amount / 15000,
      tier: 2,
      uiOrder: 2,
      isUnlocked: () => Ra.pets.effarig.level >= 9,
      lockText: "Effarig Level 9",
      formatEffect: value => `Eternitied stat generation ${formatPow(value, 4, 4)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.TIME,
          amount: 11
        },
        {
          resource: ALCHEMY_RESOURCE.INFINITY,
          amount: 4
        }
      ]
    },
    [ALCHEMY_RESOURCE.DIMENSIONALITY]: {
      name: "Dimensionality",
      symbol: "ρ",
      isBaseResource: false,
      effect: amount => Decimal.pow10(5 * amount),
      tier: 2,
      uiOrder: 1,
      isUnlocked: () => Ra.pets.effarig.level >= 10,
      lockText: "Effarig Level 10",
      formatEffect: value => `All Dimensions ${formatX(value)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.POWER,
          amount: 10
        },
        {
          resource: ALCHEMY_RESOURCE.INFINITY,
          amount: 5
        }
      ]
    },
    [ALCHEMY_RESOURCE.INFLATION]: {
      name: "Inflation",
      symbol: "λ",
      isBaseResource: false,
      effect: amount => Decimal.pow10(6e9 - 3e5 * amount),
      tier: 2,
      uiOrder: 5,
      isUnlocked: () => Ra.pets.effarig.level >= 11,
      lockText: "Effarig Level 11",
      formatEffect: value => `All Antimatter Dimension multipliers are ${formatPow(1.05, 2, 2)}
      if they are above ${format(value)} `,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.POWER,
          amount: 9
        },
        {
          resource: ALCHEMY_RESOURCE.DILATION,
          amount: 6
        }
      ]
    },
    [ALCHEMY_RESOURCE.ALTERNATION]: {
      name: "Alternation",
      symbol: "ω",
      isBaseResource: false,
      effect: amount => amount / 200000,
      tier: 2,
      uiOrder: 4,
      isUnlocked: () => Ra.pets.effarig.level >= 12,
      lockText: "Effarig Level 12",
      formatEffect: value => `Tachyon Galaxies are ${formatPercents(value, 2, 2)} stronger ` +
        `per ${format("1e1000000")} Replicanti`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.REPLICATION,
          amount: 5
        },
        {
          resource: ALCHEMY_RESOURCE.DILATION,
          amount: 10
        }
      ]
    },

    // T3 resources (Effarig and conbinations of T1/T2 with Effarig)
    [ALCHEMY_RESOURCE.EFFARIG]: {
      name: "Effarig",
      symbol: "Ϙ",
      isBaseResource: true,
      effect: amount => Math.pow(10, amount / 2500),
      tier: 2,
      uiOrder: 3.5,
      isUnlocked: () => Ra.pets.effarig.level >= 7,
      lockText: "Effarig Level 7",
      formatEffect: value => `Relic Shard gain is multiplied ${formatX(value, 2, 2)}`
    },
    [ALCHEMY_RESOURCE.SYNERGISM]: {
      name: "Synergism",
      symbol: "π",
      isBaseResource: false,
      effect: amount => Math.clampMax(0.3 + Math.sqrt(amount / 15000), 1),
      tier: 3,
      uiOrder: 2,
      isUnlocked: () => Ra.pets.effarig.level >= 13,
      lockText: "Effarig Level 13",
      formatEffect(value) {
        const baseEffect = `Alchemy reaction efficiency ${formatPercents(0.3)} ➜ ${formatPercents(value, 2, 2)}`;
        if (player.reality.glyphs.sac.reality === 0) {
          return baseEffect;
        }
        const increasedYield = formatPercents(value * Effects.sum(GlyphSacrifice.reality), 2, 2);
        return `${baseEffect} (${increasedYield} after Glyph Sacrifice)`;
      },
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.EFFARIG,
          amount: 3
        },
        {
          resource: ALCHEMY_RESOURCE.REPLICATION,
          amount: 16
        },
        {
          resource: ALCHEMY_RESOURCE.INFINITY,
          amount: 14
        }
      ]
    },
    [ALCHEMY_RESOURCE.MOMENTUM]: {
      name: "Momentum",
      symbol: "μ",
      isBaseResource: false,
      effect: amount => 1 + amount / 125000,
      tier: 3,
      uiOrder: 3,
      isUnlocked: () => Ra.pets.effarig.level >= 15,
      lockText: "Effarig Level 15",
      formatEffect: value => `All Dimensions ${formatPow(Ra.momentumValue, 4, 4)}, increasing by ${format(0.002, 3, 3)}
        per hour (real-time, never decreases), up to a maximum of ${formatPow(value, 4, 4)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.EFFARIG,
          amount: 11
        },
        {
          resource: ALCHEMY_RESOURCE.POWER,
          amount: 4
        },
        {
          resource: ALCHEMY_RESOURCE.TIME,
          amount: 20
        }
      ]
    },
    [ALCHEMY_RESOURCE.DECOHERENCE]: {
      name: "Decoherence",
      symbol: "ξ",
      isBaseResource: false,
      effect: amount => 0.10 * Math.sqrt(amount / 10000),
      tier: 3,
      uiOrder: 4,
      isUnlocked: () => Ra.pets.effarig.level >= 14,
      lockText: "Effarig Level 14",
      formatEffect: value => `Refined glyphs also give ${formatPercents(value, 2)} of their value ` +
        "to all other base resources",
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.EFFARIG,
          amount: 13
        },
        {
          resource: ALCHEMY_RESOURCE.ALTERNATION,
          amount: 8
        }
      ]
    },

    // T4 resources (resources which feed directly into the final resource)
    [ALCHEMY_RESOURCE.EXPONENTIAL]: {
      name: "Exponential",
      symbol: "Γ",
      isBaseResource: false,
      effect: amount => 10 * Math.pow(amount / 10000, 2),
      tier: 4,
      uiOrder: 2,
      isUnlocked: () => Ra.pets.effarig.level >= 18,
      lockText: "Effarig Level 18",
      formatEffect: value => `Infinity Points multiplied by Replicanti${formatPow(value, 2, 3)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.INFLATION,
          amount: 18
        },
        {
          resource: ALCHEMY_RESOURCE.SYNERGISM,
          amount: 3
        }
      ]
    },
    [ALCHEMY_RESOURCE.FORCE]: {
      name: "Force",
      symbol: "Φ",
      isBaseResource: false,
      effect: amount => 5 * amount,
      tier: 4,
      uiOrder: 2,
      isUnlocked: () => Ra.pets.effarig.level >= 17,
      lockText: "Effarig Level 17",
      formatEffect: value => `Multiply Antimatter Dimensions by Reality Machines${formatPow(value, 2, 2)}`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.DIMENSIONALITY,
          amount: 7
        },
        {
          resource: ALCHEMY_RESOURCE.MOMENTUM,
          amount: 8
        }
      ]
    },
    [ALCHEMY_RESOURCE.UNCOUNTABILITY]: {
      name: "Uncountability",
      symbol: "Θ",
      isBaseResource: false,
      effect: amount => Math.sqrt(amount),
      tier: 4,
      uiOrder: 3,
      isUnlocked: () => Ra.pets.effarig.level >= 19,
      lockText: "Effarig Level 19",
      formatEffect: value => `Generate ${format(value, 2, 2)} Realities and Perk Points per second`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.INFINITY,
          amount: 20
        },
        {
          resource: ALCHEMY_RESOURCE.EFFARIG,
          amount: 6
        },
        {
          resource: ALCHEMY_RESOURCE.CARDINALITY,
          amount: 16
        }
      ]
    },
    [ALCHEMY_RESOURCE.BOUNDLESS]: {
      name: "Boundless",
      symbol: "Π",
      isBaseResource: false,
      effect: amount => amount / 80000,
      tier: 4,
      uiOrder: 1,
      isUnlocked: () => Ra.pets.effarig.level >= 20,
      lockText: "Effarig Level 20",
      formatEffect: value => `Tesseracts are +${formatPercents(value, 2, 2)} stronger`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.ETERNITY,
          amount: 13
        },
        {
          resource: ALCHEMY_RESOURCE.INFLATION,
          amount: 18
        }
      ]
    },
    [ALCHEMY_RESOURCE.MULTIVERSAL]: {
      name: "Multiversal",
      symbol: "Σ",
      isBaseResource: false,
      effect: amount => 5 * Math.pow(amount / 10000, 2),
      tier: 4,
      uiOrder: 5,
      isUnlocked: () => Ra.pets.effarig.level >= 16,
      lockText: "Effarig Level 16",
      formatEffect: value => `Each Reality simulates ${format(value, 2, 3)} additional Realities, giving all
        the same rewards as if it was amplified`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.ALTERNATION,
          amount: 16
        },
        {
          resource: ALCHEMY_RESOURCE.DECOHERENCE,
          amount: 3
        }
      ]
    },
    [ALCHEMY_RESOURCE.UNPREDICTABILITY]: {
      name: "Unpredictability",
      symbol: "Λ",
      isBaseResource: false,
      effect: amount => amount / (10000 + amount),
      tier: 4,
      uiOrder: 4,
      isUnlocked: () => Ra.pets.effarig.level >= 21,
      lockText: "Effarig Level 21",
      formatEffect: value => `Any alchemy reaction has a ${formatPercents(value, 2, 2)}
        chance of triggering again`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.EFFARIG,
          amount: 15
        },
        {
          resource: ALCHEMY_RESOURCE.DECOHERENCE,
          amount: 3
        },
        {
          resource: ALCHEMY_RESOURCE.SYNERGISM,
          amount: 10
        }
      ]
    },

    // T5 (Reality)
    [ALCHEMY_RESOURCE.REALITY]: {
      name: "Reality",
      symbol: "Ϟ",
      isBaseResource: false,
      effect: amount => Math.floor(amount),
      tier: 5,
      isUnlocked: () => Ra.pets.effarig.level >= 25,
      lockText: "Effarig Level 25",
      formatEffect: value => `Consume all Reality resource to create a level ${formatInt(value)} Reality glyph`,
      reagents: [
        {
          resource: ALCHEMY_RESOURCE.EXPONENTIAL,
          amount: 1
        },
        {
          resource: ALCHEMY_RESOURCE.FORCE,
          amount: 1
        },
        {
          resource: ALCHEMY_RESOURCE.UNCOUNTABILITY,
          amount: 1
        },
        {
          resource: ALCHEMY_RESOURCE.BOUNDLESS,
          amount: 1
        },
        {
          resource: ALCHEMY_RESOURCE.MULTIVERSAL,
          amount: 1
        },
        {
          resource: ALCHEMY_RESOURCE.UNPREDICTABILITY,
          amount: 1
        }
      ]
    },
  },
};
