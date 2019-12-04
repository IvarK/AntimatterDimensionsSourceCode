"use strict";

GameDatabase.sounds = [
  {
    id: 1,
    fileName: "dimension_boost",
    checkRequirement: () => true,
    checkEvent: GameEvent.DIMBOOST_AFTER
  },
  {
    id: 2,
    fileName: "galaxy",
    checkRequirement: () => true,
    checkEvent: GameEvent.GALAXY_RESET_AFTER
  },
  {
    id: 3,
    fileName: "glyphs_changed",
    checkRequirement: () => true,
    checkEvent: GameEvent.GLYPHS_CHANGED
  },
  {
    id: 4,
    fileName: "tab_change",
    checkRequirement: () => true,
    checkEvent: GameEvent.TAB_CHANGED
  },
  {
    id: 5,
    fileName: "achievement_unlocked",
    checkRequirement: () => true,
    checkEvent: GameEvent.ACHIEVEMENT_UNLOCKED
  },
  {
    id: 6,
    fileName: "break_infinity",
    checkRequirement: () => true,
    checkEvent: GameEvent.BREAK_INFINITY
  },
];
