import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

GameDatabase.celestials.effarig.unlocks = {
  adjuster: {
    id: 0,
    description: "Adjustable Glyph level factor weights",
    cost: 1e7,
    onPurchased: () => {
      Effarig.quotes.unlockWeights.show();
      ui.view.tabs.reality.openGlyphWeights = true;
      Tab.reality.glyphs.show();
    }
  },
  glyphFilter: {
    id: 1,
    description: "Glyph Filtering",
    cost: 2e8,
    onPurchased: () => {
      Effarig.quotes.unlockGlyphFilter.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.FILTER_SETTINGS;
    }
  },
  setSaves: {
    id: 2,
    description: "Glyph Set Saves",
    cost: 3e9,
    onPurchased: () => {
      Effarig.quotes.unlockSetSaves.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.SAVED_SETS;
    }
  },
  run: {
    id: 3,
    description: "Effarig's Reality",
    cost: 5e11,
    onPurchased: () => {
      Effarig.quotes.unlockRun.show();
    }
  },
  infinity: {
    id: 4,
    label: "Infinity",
    get description() {
      if (Pelle.isDoomed) return "Any rewards from Effarig's Infinity have been disabled.";
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
      if (Pelle.isDoomed) return "Any rewards from Effarig's Eternity have been disabled.";
      return ` Eternities generates Infinities
        Infinity Points are no longer limited in any way in Effarig's Reality
        You have unlocked The Enslaved Ones`;
    },
  },
  reality: {
    id: 6,
    label: "Reality",
    get description() {
      if (Pelle.isDoomed) return "Any rewards from Effarig's Reality have been disabled.";
      return " You have unlocked Effarig Glyphs (You may equip at most one and some effects are mutually exclusive)";
    },
  }
};
