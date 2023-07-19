window.PRESTIGE_EVENT = {
  DIMENSION_BOOST: 0,
  ANTIMATTER_GALAXY: 1,
  INFINITY: 2,
  ETERNITY: 3,
  REALITY: 4,
};

function deepFreeze(obj) {
  Object.keys(obj).forEach(prop => {
    const reference = obj[prop];
    if (typeof reference === "object") deepFreeze(reference);
  });
  return Object.freeze(obj);
}

export const DC = deepFreeze({
  // Naming Scheme:
  // D[0-9]: Decimal mantissa variable
  // _: decimal (.) part of the mantissa
  // E[0-9]: Decimal exponent variable
  // C: Calculation. D - .div, P - .pow

  /* eslint-disable key-spacing */
  DM1:                  new Decimal("-1"),
  D0:                   new Decimal("0"),

  D0_01:                new Decimal("0.01"),
  D0_1:                 new Decimal("0.1"),
  D0_4:                 new Decimal("0.4"),
  D0_55:                new Decimal("0.55"),
  D0_8446303389034288:  new Decimal("0.8446303389034288"),
  D0_95:                new Decimal("0.95"),
  D0_965:               new Decimal("0.965"),
  D1:                   new Decimal("1"),
  D1_0000109:           new Decimal("1.0000109"),
  D1_00038:             new Decimal("1.00038"),
  D1_0004:              new Decimal("1.0004"),
  D1_0025:              new Decimal("1.0025"),
  D1_005:               new Decimal("1.005"),
  D1_007:               new Decimal("1.007"),
  D1_02:                new Decimal("1.02"),
  D1_0285:              new Decimal("1.0285"),
  D1_2:                 new Decimal("1.2"),
  D1_3:                 new Decimal("1.3"),
  D2:                   new Decimal("2"),
  D3:                   new Decimal("3"),
  D4:                   new Decimal("4"),
  D5:                   new Decimal("5"),
  D6_66:                new Decimal("6.66"),
  D15:                  new Decimal("15"),
  D16:                  new Decimal("16"),
  D11111:               new Decimal("11111"),
  D3E4:                 new Decimal("30000"),
  D2E5:                 new Decimal("2e5"),
  D2E6:                 new Decimal("2e6"),
  D5E7:                 new Decimal("5e7"),
  D2E9:                 new Decimal("2e9"),
  D2E25:                new Decimal("2e25"),
  D2E22222:             new Decimal("2e22222"),
  D9_99999E999:         new Decimal("9.99999e999"),
  D9_9999E9999:         new Decimal("9.9999e9999"),

  // Calculations for precise numbers.
  C1D1_1245:                Decimal.div(1, 1.1245),
  D2P30D0_61:               Decimal.pow(2, 30 / 0.61),
  C2P30:                    Decimal.pow(2, 30),
  C2P1024:                  Decimal.pow(2, 1024),
  C10P16000D3:              Decimal.pow(10, 16000 / 3),

  // 1e1 is 10
  E1:                   new Decimal("1e1"),
  E2:                   new Decimal("1e2"),
  E3:                   new Decimal("1e3"),
  E5:                   new Decimal("1e5"),
  E6:                   new Decimal("1e6"),
  E8:                   new Decimal("1e8"),
  E9:                   new Decimal("1e9"),
  E10:                  new Decimal("1e10"),
  E12:                  new Decimal("1e12"),
  E15:                  new Decimal("1e15"),
  E20:                  new Decimal("1e20"),
  E25:                  new Decimal("1e25"),
  E29:                  new Decimal("1e29"),
  E30:                  new Decimal("1e30"),
  E31:                  new Decimal("1e31"),
  E40:                  new Decimal("1e40"),
  E45:                  new Decimal("1e45"),
  E50:                  new Decimal("1e50"),
  E55:                  new Decimal("1e55"),
  E58:                  new Decimal("1e58"),
  E60:                  new Decimal("1e60"),
  E63:                  new Decimal("1e63"),
  E70:                  new Decimal("1e70"),
  E75:                  new Decimal("1e75"),
  E80:                  new Decimal("1e80"),
  E90:                  new Decimal("1e90"),
  E100:                 new Decimal("1e100"),
  E140:                 new Decimal("1e140"),
  E150:                 new Decimal("1e150"),
  E160:                 new Decimal("1e160"),
  E170:                 new Decimal("1e170"),
  E175:                 new Decimal("1e175"),
  E200:                 new Decimal("1e200"),
  E250:                 new Decimal("1e250"),
  E260:                 new Decimal("1e260"),
  E280:                 new Decimal("1e280"),
  E300:                 new Decimal("1e300"),
  E308:                 new Decimal("1e308"),
  E309:                 new Decimal("1e309"),
  E310:                 new Decimal("1e310"),
  E315:                 new Decimal("1e315"),
  E320:                 new Decimal("1e320"),
  E349:                 new Decimal("1e349"),
  E400:                 new Decimal("1e400"),
  E450:                 new Decimal("1e450"),
  E500:                 new Decimal("1e500"),
  E530:                 new Decimal("1e530"),
  E550:                 new Decimal("1e550"),
  E600:                 new Decimal("1e600"),
  E616:                 new Decimal("1e616"),
  E650:                 new Decimal("1e650"),
  E750:                 new Decimal("1e750"),
  E850:                 new Decimal("1e850"),
  E900:                 new Decimal("1e900"),
  E925:                 new Decimal("1e925"),
  E975:                 new Decimal("1e975"),
  E1000:                new Decimal("1e1000"),
  E1100:                new Decimal("1e1100"),
  E1200:                new Decimal("1e1200"),
  E1300:                new Decimal("1e1300"),
  E1400:                new Decimal("1e1400"),
  E1500:                new Decimal("1e1500"),
  E1750:                new Decimal("1e1750"),
  E1800:                new Decimal("1e1800"),
  E1900:                new Decimal("1e1900"),
  E2000:                new Decimal("1e2000"),
  E2350:                new Decimal("1e2350"),
  E2400:                new Decimal("1e2400"),
  E2500:                new Decimal("1e2500"),
  E2650:                new Decimal("1e2650"),
  E2700:                new Decimal("1e2700"),
  E2750:                new Decimal("1e2750"),
  E2800:                new Decimal("1e2800"),
  E2900:                new Decimal("1e2900"),
  E3000:                new Decimal("1e3000"),
  E3200:                new Decimal("1e3200"),
  E3350:                new Decimal("1e3350"),
  E4000:                new Decimal("1e4000"),
  E5000:                new Decimal("1e5000"),
  E6000:                new Decimal("1e6000"),
  E8000:                new Decimal("1e8000"),
  E9000:                new Decimal("1e9000"),
  E10000:               new Decimal("1e10000"),
  E10500:               new Decimal("1e10500"),
  E11000:               new Decimal("1e11000"),
  E11111:               new Decimal("1e11111"),
  E11200:               new Decimal("1e11200"),
  E12000:               new Decimal("1e12000"),
  E13000:               new Decimal("1e13000"),
  E14000:               new Decimal("1e14000"),
  E16500:               new Decimal("1e16500"),
  E17500:               new Decimal("1e17500"),
  E18000:               new Decimal("1e18000"),
  E20000:               new Decimal("1e20000"),
  E22500:               new Decimal("1e22500"),
  E23000:               new Decimal("1e23000"),
  E27000:               new Decimal("1e27000"),
  E28000:               new Decimal("1e28000"),
  E30000:               new Decimal("1e30000"),
  E45000:               new Decimal("1e45000"),
  E54000:               new Decimal("1e54000"),
  E60000:               new Decimal("1e60000"),
  E100000:              new Decimal("1e100000"),
  E110000:              new Decimal("1e110000"),
  E164000:              new Decimal("1e164000"),
  E200000:              new Decimal("1e200000"),
  E201600:              new Decimal("1e201600"),
  E208000:              new Decimal("1e208000"),
  E210000:              new Decimal("1e210000"),
  E300000:              new Decimal("1e300000"),
  E320000:              new Decimal("1e320000"),
  E500000:              new Decimal("1e500000"),
  E1E6:                 new Decimal("1e1000000"),
  E3E6:                 new Decimal("1e3000000"),
  E6E6:                 new Decimal("1e6000000"),
  E1E7:                 new Decimal("1e10000000"),
  E2E7:                 new Decimal("1e20000000"),
  E4E7:                 new Decimal("1e40000000"),
  E6E7:                 new Decimal("1e60000000"),
  E1E8:                 new Decimal("1e100000000"),
  E1_5E12:              new Decimal("1e1500000000000"),
  E1E15:                new Decimal("1e1000000000000000"),
});

window.AUTOBUYER_MODE = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

window.AUTO_CRUNCH_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_ETERNITY_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_REALITY_MODE = {
  RM: 0,
  GLYPH: 1,
  EITHER: 2,
  BOTH: 3,
  TIME: 4,
  RELIC_SHARD: 5,
};

window.RECENT_PRESTIGE_RESOURCE = {
  ABSOLUTE_GAIN: 0,
  RATE: 1,
  CURRENCY: 2,
  PRESTIGE_COUNT: 3,
};

// Free tickspeed multiplier with TS171. Shared here because formatting glyph effects depends on it
window.TS171_MULTIPLIER = 1.25;

// Used as drag and drop data type
window.GLYPH_MIME_TYPE = "text/x-ivark-glyph";

// These need to be in descending order for searching over them to work trivially, and all need to be hex codes
// in order for reality glyph color parsing to work properly in the cosmetic handler
window.GlyphRarities = [
  {
    minStrength: 3.5,
    name: "Celestial",
    darkColor: "#3d3dec",
    lightColor: "#9696ff",
    darkHighContrast: "#ffff00",
    lightHighContrast: "#c0c000"
  }, {
    minStrength: 3.25,
    name: "Transcendent",
    darkColor: "#03ffec",
    lightColor: "#00c3c3",
    darkHighContrast: "#00ffff",
    lightHighContrast: "#00c0c0"
  }, {
    minStrength: 3,
    name: "Mythical",
    darkColor: "#d50000",
    lightColor: "#d50000",
    darkHighContrast: "#c00000",
    lightHighContrast: "#ff0000"
  }, {
    minStrength: 2.75,
    name: "Legendary",
    darkColor: "#ff9800",
    lightColor: "#d68100",
    darkHighContrast: "#ff8000",
    lightHighContrast: "#ff8000"
  }, {
    minStrength: 2.5,
    name: "Epic",
    darkColor: "#9c27b0",
    lightColor: "#9c27b0",
    darkHighContrast: "#ff00ff",
    lightHighContrast: "#ff00ff"
  }, {
    minStrength: 2,
    name: "Rare",
    darkColor: "#5096f3",
    lightColor: "#0d40ff",
    darkHighContrast: "#6060ff",
    lightHighContrast: "#0000ff"
  }, {
    minStrength: 1.5,
    name: "Uncommon",
    darkColor: "#43a047",
    lightColor: "#1e8622",
    darkHighContrast: "#00ff00",
    lightHighContrast: "#00b000"
  }, {
    minStrength: 1,
    name: "Common",
    darkColor: "#ffffff",
    lightColor: "#000000",
    darkHighContrast: "#ffffff",
    lightHighContrast: "#000000"
  },
];

window.GLYPH_BG_SETTING = {
  AUTO: 0,
  LIGHT: 1,
  DARK: 2,
};

window.GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation",
  "effarig",
  "reality",
  "cursed",
  "companion"
];

window.BASIC_GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation"
];

window.ALCHEMY_BASIC_GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation",
  "effarig"
];

window.GLYPH_SYMBOLS = {
  power: "Ω",
  infinity: "∞",
  replication: "Ξ",
  time: "Δ",
  dilation: "Ψ",
  effarig: "Ϙ",
  reality: "Ϟ",
  cursed: "⸸",
  companion: "♥"
};

window.CANCER_GLYPH_SYMBOLS = {
  power: "⚡",
  infinity: "8",
  replication: "⚤",
  time: "🕟",
  dilation: "☎",
  effarig: "🦒",
  reality: "⛧",
  cursed: "☠",
  companion: "³"
};

window.ALTERATION_TYPE = {
  ADDITION: 1,
  EMPOWER: 2,
  BOOST: 3
};

window.BLACK_HOLE_PAUSE_MODE = {
  NO_PAUSE: 0,
  PAUSE_BEFORE_BH1: 1,
  PAUSE_BEFORE_BH2: 2,
};

window.GLYPH_SIDEBAR_MODE = {
  INVENTORY_MANAGEMENT: 0,
  FILTER_SETTINGS: 1,
  SAVED_SETS: 2,
  SACRIFICE_TYPE: 3,
};

window.AUTO_SORT_MODE = {
  NONE: 0,
  LEVEL: 1,
  POWER: 2,
  EFFECT: 3,
  SCORE: 4
};

window.AUTO_GLYPH_SCORE = {
  LOWEST_SACRIFICE: 0,
  EFFECT_COUNT: 1,
  RARITY_THRESHOLD: 2,
  SPECIFIED_EFFECT: 3,
  EFFECT_SCORE: 4,
  LOWEST_ALCHEMY: 5,
  ALCHEMY_VALUE: 6
};

window.AUTO_GLYPH_REJECT = {
  SACRIFICE: 0,
  REFINE: 1,
  REFINE_TO_CAP: 2,
};

window.TIME_STUDY_PATH = {
  NONE: 0,
  ANTIMATTER_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
};

window.TIME_STUDY_TYPE = {
  NORMAL: 0,
  ETERNITY_CHALLENGE: 1,
  DILATION: 2,
  TRIAD: 3
};

window.TS_REQUIREMENT_TYPE = {
  AT_LEAST_ONE: 0,
  ALL: 1,
  DIMENSION_PATH: 2,
};

window.ALCHEMY_RESOURCE = {
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
  REALITY: 20
};

window.SINGULARITY_MILESTONE_RESOURCE = {
  SINGULARITIES: 0,
  CONDENSE_COUNT: 1,
  MANUAL_TIME: 2,
  AUTO_TIME: 3,
};

window.SINGULARITY_MILESTONE_SORT = {
  SINGULARITIES_TO_NEXT: 0,
  CURRENT_COMPLETIONS: 1,
  PERCENT_COMPLETIONS: 2,
  FINAL_COMPLETION: 3,
  MOST_RECENT: 4,
};

window.COMPLETED_MILESTONES = {
  FIRST: 0,
  LAST: 1,
  IGNORED: 2,
};

window.SORT_ORDER = {
  ASCENDING: 0,
  DESCENDING: 1,
};

// One-indexed and ordered to simplify code elsewhere, do not change to be zero-indexed or reorder
window.PROGRESS_STAGE = {
  PRE_INFINITY: 1,

  EARLY_INFINITY: 2,
  BREAK_INFINITY: 3,
  REPLICANTI: 4,

  EARLY_ETERNITY: 5,
  ETERNITY_CHALLENGES: 6,
  EARLY_DILATION: 7,
  LATE_ETERNITY: 8,

  EARLY_REALITY: 9,

  TERESA: 10,
  EFFARIG: 11,
  ENSLAVED: 12,
  V: 13,
  RA: 14,
  IMAGINARY_MACHINES: 15,
  LAITELA: 16,
  PELLE: 17,
};

window.STD_BACKEND_URL = "https://antimatterdimensionspayments.ew.r.appspot.com";

window.SPEEDRUN_SEED_STATE = {
  UNKNOWN: 0,
  FIXED: 1,
  RANDOM: 2,
  PLAYER: 3,
};
