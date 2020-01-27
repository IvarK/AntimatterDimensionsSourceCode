"use strict";

const AUTOBUYER_MODE = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

const AUTO_CRUNCH_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_LAST: 2
};

const AUTO_ETERNITY_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_LAST: 2
};

const AUTO_REALITY_MODE = {
  RM: 0,
  GLYPH: 1,
  EITHER: 2,
  BOTH: 3
};

// Free tickspeed multiplier with TS171. Shared here because formatting glyph effects depends on it
const TS171_MULTIPLIER = 1.25;

// Used as drag and drop data type
const GLYPH_MIME_TYPE = "text/x-ivark-glyph";

// These need to be in descending order for searching over them to work trivially
const GlyphRarities = [
  {
    minStrength: 3.5,
    name: "Celestial",
    color: "#5151ec"
  }, {
    minStrength: 3.25,
    name: "Transcendent",
    color: "#03ffec"
  }, {
    minStrength: 3,
    name: "Mythical",
    color: "#d50000"
  }, {
    minStrength: 2.75,
    name: "Legendary",
    color: "#ff9800"
  }, {
    minStrength: 2.5,
    name: "Epic",
    color: "#9c27b0"
  }, {
    minStrength: 2,
    name: "Rare",
    color: "#2196f3"
  }, {
    minStrength: 1.5,
    name: "Uncommon",
    color: "#43a047"
  }, {
    minStrength: 1,
    name: "Common",
    color: "white"
  },
];

const AUTO_GLYPH_SAC_MODE = {
  NONE: 0,
  ALL: 1,
  RARITY_THRESHOLDS: 2,
  EFFECTS: 3,
  ADVANCED: 4,
  ALCHEMY: 5
};

const AUTO_GLYPH_PICK_MODE = {
  RANDOM: 0,
  RARITY: 1,
  ABOVE_SACRIFICE_THRESHOLD: 2,
  LOWEST_ALCHEMY_RESOURCE: 3
};

const TIME_STUDY_PATH = {
  NONE: 0,
  NORMAL_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
};

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
  CURSED: 21
};
