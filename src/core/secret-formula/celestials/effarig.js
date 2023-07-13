import { DC } from "../../constants";

export const effarigUnlocks = {
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
    description: "Glyph Presets",
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
      return ` Replicanti cap is multiplied by a value based on Infinities
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
        Infinity Points are no longer limited in any way in Effarig's Reality
        You have unlocked The Nameless Ones`;
    },
  },
  reality: {
    id: 6,
    label: "Reality",
    get description() {
      return " You have unlocked Effarig Glyphs (You may equip at most one and some effects are mutually exclusive)";
    },
  }
};
