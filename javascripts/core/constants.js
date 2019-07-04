"use strict";

const DIMENSION_COUNT = 8;
const DISPLAY_NAMES = [null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];
const SHORT_DISPLAY_NAMES = [null, "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const AutobuyerMode = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

const AutoCrunchMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

const AutoEternityMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

const AutoRealityMode = {
  RM: "rm",
  GLYPH: "glyph",
  EITHER: "either",
  BOTH: "both"
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

const AutoGlyphSacMode = {
  NONE: 0,
  ALL: 1,
  RARITY_THRESHOLDS: 2,
  ADVANCED: 3,
  ALCHEMY: 4  
}

const AutoGlyphPickMode = {
  RANDOM: 0,
  RARITY: 1,
  ABOVE_SACRIFICE_THRESHOLD: 2,
};

const TimeStudyPath = {
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

// Use through Automator.Instructions; here to support creation of index by ID
const _AutomatorInstructions = Object.freeze({
  WAIT: {
    id: 11,
    type: "command",
    price: 1,
    displayName: "WAIT",
  },
  BUY: {
    id: 12,
    type: "command",
    price: 0,
    displayName: "BUY"
  },
  IF: {
    id: 21,
    type: "target",
    price: 1,
    displayName: "IF",
    parent: 11,
  },
  ANTIMATTER: {
    id: 22,
    type: "target",
    price: 3,
    displayName: "ANTIMATTER",
    parent: 11,
  },
  EP: {
    id: 23,
    type: "target",
    price: 2,
    displayName: "EP",
    parent: 11,
  },
  STUDY: {
    id: 24,
    type: "target",
    price: 0,
    displayName: "STUDY",
  },
  STUDYUNTIL: {
    id: 25,
    type: "target",
    price: 0,
    displayName: "STUDYUNTIL",
  },
  STUDYPATH: {
    id: 26,
    type: "target",
    price: 50,
    displayName: "STUDYPATH",
  },
  GOTO: {
    id: 31,
    type: "target",
    price: 1,
    displayName: "GOTO",
    parent: 21,
  },
  IP: {
    id: 32,
    type: "target",
    price: 3,
    displayName: "IP",
    parent: 11,
  },
  REPLICANTI: {
    id: 33,
    type: "target",
    price: 2,
    displayName: "REPLICANTI",
    parent: 11,
  },
  TTEP: {
    id: 34,
    type: "target",
    price: 3,
    displayName: "TTEP",
  },
  TTIP: {
    id: 35,
    type: "target",
    price: 2,
    displayName: "TTIP",
  },
  STUDYIMPORT: {
    id: 36,
    type: "target",
    price: 500,
    displayName: "STUDYIMPORT",
    parent: 26,
  },
  TIME: {
    id: 41,
    type: "target",
    price: 3,
    displayName: "TIME",
    parent: 11,
  },
  RG: {
    id: 42,
    type: "target",
    price: 2,
    displayName: "RG",
    parent: 11,
  },
  TTAM: {
    id: 43,
    type: "target",
    price: 3,
    displayName: "TTAM",
  },
  TTMAX: {
    id: 44,
    type: "target",
    price: 20,
    displayName: "TTMAX",
  },
  LOAD: {
    id: 51,
    type: "command",
    price: 30,
    displayName: "LOAD",
    parent: 41,
  },
  MAX: {
    id: 52,
    type: "target",
    price: 10,
    displayName: "MAX",
    parent: 42,
  },
  TOGGLE: {
    id: 53,
    type: "command",
    price: 30,
    displayName: "TOGGLE",
    parent: 43,
  },
  UNLOCK: {
    id: 54,
    type: "command",
    price: 30,
    displayName: "UNLOCK",
    parent: 44,
  },
  RESPEC: {
    id: 61,
    type: "command",
    price: 30,
    displayName: "RESPEC",
    parent: 51,
  },
  ETERNITY: {
    id: 62,
    type: "command",
    price: 30,
    displayName: "ETERNITY",
    parent: 52,
  },
  UNLOCK_DILATION: {
    id: 63,
    type: "target",
    price: 30,
    displayName: "DILATION",
    parent: 54,
  },
  UNLOCK_EC: {
    id: 64,
    type: "target",
    price: 30,
    displayName: "EC",
    parent: 54,
  },
  CHANGE: {
    id: 71,
    type: "command",
    price: 30,
    displayName: "CHANGE",
    parent: 61,
  },
  STOP: {
    id: 72,
    type: "command",
    price: 30,
    displayName: "STOP",
    parent: 62,
  },
  START: {
    id: 73,
    type: "command",
    price: 30,
    displayName: "START",
    parent: 64,
  },
  IPAUTOBUYER: {
    id: 81,
    type: "target",
    price: 30,
    displayName: "IPAUTOBUYER",
    parent: 71,
  },
  EPAUTOBUYER: {
    id: 82,
    type: "target",
    price: 30,
    displayName: "EPAUTOBUYER",
    parent: 71,
  },
  START_DILATION: {
    id: 83,
    type: "target",
    price: 30,
    displayName: "DILATION",
    parent: 73,
  },
  START_EC: {
    id: 84,
    type: "target",
    price: 30,
    displayName: "EC",
    parent: 73,
  },
});

function _makeAutomatorInstructionsById() {
  const ret={};
  for (const k in _AutomatorInstructions) {
    if (_AutomatorInstructions.hasOwnProperty(k)) {
      ret[_AutomatorInstructions[k].id] = _AutomatorInstructions[k];
    }
  }
  return ret;
}

const AutomatorInstructions = Object.freeze({
  Instructions: _AutomatorInstructions,
  InstructionsById: _makeAutomatorInstructionsById(),
});
