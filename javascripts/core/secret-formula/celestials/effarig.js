"use strict";

GameDatabase.celestials.effarig = {
  unlocks: {
    adjuster: {
      id: 0,
      description: "Adjustable Glyph level factor weights",
      cost: 1e7
    },
    glyphFilter: {
      id: 1,
      description: "Glyph Filtering",
      cost: 2e8
    },
    setSaves: {
      id: 2,
      description: "Glyph Set Saves",
      cost: 3e9
    },
    run: {
      id: 3,
      description: "Effarig's Reality",
      cost: 5e11
    },
    infinity: {
      id: 4,
      label: "Infinity",
      get description() {
        return ` Infinities raise the Replicanti cap
        Infinities increase your max Replicanti Galaxies
        Base Infinity Point gain is capped at ${format(DC.E200)} in Effarig's Reality
        Each type of Infinity Point multiplier is capped at ${format(DC.E50)} in Effarig's Reality`;
      },
    },
    eternity: {
      id: 5,
      label: "Eternity",
      get description() {
        return ` Eternities generates Infinities
          The Tickspeed upgrades from Time Dimensions softcaps ${formatInt(100000)} later
          Infinity Points are no longer limited in any way in Effarig's Reality
          You have unlocked The Enslaved Ones`;
      },
    },
    reality: {
      id: 6,
      label: "Reality",
      description: " You have unlocked Effarig Glyphs (You may equip at most one)"
    }
  }
};
