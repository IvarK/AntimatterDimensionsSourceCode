"use strict";

const ALCHEMY_RESOURCE = {
  POWER: 0,
  INFINITY: 1,
  TIME: 2,
  REPLICATION: 3,
  DILATION: 4,
  CARDINALITY: 5,
  ETERNITY: 6,
  DIMENSIONALITY: 7,
  INFLATION: 8,
  ALTERNATION: 9,
  EFFARIG: 10,
  SYNERGISM: 11,
  MOMENTUM: 12,
  DECOHERENCE: 13,
  EXPONENTIAL: 14,
  FORCE: 15,
  UNCOUNTABILITY: 16,
  BOUNDLESS: 17,
  MULTIVERSAL: 18,
  UNPREDICTABILITY: 19,
  REALITY: 20,
};


GameDatabase.celestials.alchemy = {
  resources: {
    // T1 resources (Non-Effarig "base" resources)
    [ALCHEMY_RESOURCE.POWER]: {
      name: "Power",
      symbol: "Ω",
      isBaseResource: true,
      effect: 1,
      formatEffect: value => `Normal dimensions ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.INFINITY]: {
      name: "Infinity",
      symbol: "∞",
      isBaseResource: true,
      effect: 1,
      formatEffect: value => `Infinity dimensions ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.TIME]: {
      name: "Time",
      symbol: "Δ",
      isBaseResource: true,
      effect: 1,
      formatEffect: value => `Time dimensions ${formatPow(value, 4, 4)}`
    },
    [ALCHEMY_RESOURCE.REPLICATION]: {
      name: "Replication",
      symbol: "Ξ",
      isBaseResource: true,
      effect: new Decimal(1),
      formatEffect: value => `Replication speed ${formatX(value)}`
    },
    [ALCHEMY_RESOURCE.DILATION]: {
      name: "Dilation",
      symbol: "Ψ",
      isBaseResource: true,
      effect: new Decimal(1),
      formatEffect: value => `Dilated Time ${formatX(value)}`
    },

    // T2 resources (combinations of pairs of T1 resources)
    [ALCHEMY_RESOURCE.CARDINALITY]: {
      name: "Cardinality",
      symbol: "α",
      isBaseResource: false,
      effect: 1,
      formatEffect: value => `Uncapped replicanti slowdown ${formatX(1.2)} ➜ ` +
        `${formatX(value)} per ${shorten(Number.MAX_VALUE)}`,
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
      effect: 1,
      formatEffect: value => `Eternitied stat gain ${formatPow(value, 4, 4)}`,
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
      effect: new Decimal(1),
      formatEffect: value => `All dimensions ${formatX(value)}`,
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
      effect: new Decimal(1),
      formatEffect: value => `^1.002 for multipliers above ${shorten(value)}`,
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
      effect: 1,
      formatEffect: value => `Dilation penalty reduced by ${formatPercents(value)} ` +
        `per ${shorten("1e1000000")} replicanti`,
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
      effect: new Decimal(1),
      formatEffect: value => `Relic Shards ${formatX(value)}`
    },
    [ALCHEMY_RESOURCE.SYNERGISM]: {
      name: "Synergism",
      symbol: "π",
      isBaseResource: false,
      effect: 1,
      formatEffect: value => `Alchemy reaction efficiency 30% ➜ ${formatPercents(value)}`,
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
      effect: 1,
      formatEffect: value => `Game speed ${formatX(value)} for every real-time minute ` +
        "spent in your current reality",
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
      effect: 1,
      formatEffect: value => `Alchemy decay reduced by ${formatPercents(value)}`,
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
      effect: 1,
      formatEffect: value => `IP gain multiplied by replicanti${formatPow(value, 2, 2)}`,
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
      effect: 1,
      formatEffect: value => `Multiply normal dimensions by RM${formatPow(value, 2, 2)}}`,
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
      effect: 1,
      formatEffect: value => `Generate ${shorten(value)} realities and perk points per second`,
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
      effect: 1,
      formatEffect: value => `Glyph level cap increased by ${shortenSmallInteger(value)}`,
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
      effect: 1,
      formatEffect: value => `Each reality simulates ${shortenSmallInteger(value)} additional realities`,
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
      effect: 1,
      formatEffect: value => (Ra.has(RA_UNLOCKS.LAITELA_UNLOCK)
        ? "?????"
        : `Boost matter dimension generation chance by +${formatPercents(value)}`),
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
      effect: 1,
      formatEffect: value => `Can be used to create a level ${shortenSmallInteger(value)} Reality glyph`,
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
