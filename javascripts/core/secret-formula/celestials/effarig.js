"use strict";

GameDatabase.celestials.effarig = {
  unlocks: {
    adjuster: {
      id: 0,
      description: "Glyph level weight adjustment",
      cost: 1e7
    },
    basicFilter: {
      id: 1,
      description: "Basic glyph filtering",
      cost: 2e8
    },
    advancedFilter: {
      id: 2,
      description: "Advanced glyph filtering",
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
      description:
        "Infinitied stat raises the replicanti cap\n" +
        "Infinitied stat increases your max RG\n" +
        "Base IP gain is capped at 1e200 in Effarig's Reality\n" +
        "Each type of IP multiplier is capped at 1e50 in Effarig's Reality"
    },
    eternity: {
      id: 5,
      label: "Eternity",
      description: "Eternitied stat generates Infinitied stat\n" +
        "Free tickspeed upgrade softcap is 100,000 larger\n" +
        "IP is no longer limited in any way in Effarig's Reality\n" +
        "You have unlocked The Enslaved Ones"
    },
    reality: {
      id: 6,
      label: "Reality",
      description: "You have unlocked Effarig Glyphs (You may equip at most one)"
    }
  }
};