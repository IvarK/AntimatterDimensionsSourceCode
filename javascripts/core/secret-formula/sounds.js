"use strict";

GameDatabase.sounds = [
  {
    id: 1,
    fileName: "dimension_boost.wav",
    checkRequirement: () => true,
    checkEvent: GameEvent.DIMBOOST_AFTER
  },
  {
    id: 2,
    fileName: "galaxy.wav",
    checkRequirement: () => true,
    checkEvent: GameEvent.GALAXY_RESET_AFTER
  },
  {
    id: 3,
    fileName: "glyph_move.wav",
    checkRequirement: () => true,
    checkEvent: GameEvent.GLYPHS_CHANGED
  },
];
