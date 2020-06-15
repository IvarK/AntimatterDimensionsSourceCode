"use strict";

GameDatabase.sounds = [
  {
    name: "Dimension Boost",
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    name: "Antimatter Galaxy",
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    name: "Glyph moved",
    checkEvent: GAME_EVENT.GLYPHS_MOVED
  },
  {
    name: "Tab changed",
    options: ["Clicky", "Deep"],
    checkEvent: GAME_EVENT.TAB_CHANGED
  },
  {
    name: "Achievement unlocked",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED
  },
  {
    name: "Break Infinity",
    checkEvent: GAME_EVENT.BREAK_INFINITY
  },
  {
    name: "Fix Infinity",
    checkEvent: GAME_EVENT.FIX_INFINITY
  },
];
