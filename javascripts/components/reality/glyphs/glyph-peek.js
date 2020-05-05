"use strict";

Vue.component("glyph-peek", {
  data() {
    return {
      glyphs: [],
      level: 0,
      seed: 0,
    };
  },
  methods: {
    update() {
      this.isUnlocked = (Perk.glyphPeek1.isBought && TimeStudy.reality.isBought) || Perk.glyphPeek2.isBought;
      const newLevel = gainedGlyphLevel().actualLevel;
      const newSeed = player.reality.seed;
      if (newLevel !== this.level || newSeed !== this.seed) {
        this.glyphs = GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), false);
        this.level = newLevel;
        this.seed = newSeed;
      }
    }
  },
  template: `
  <glyph-set-preview :show="isUnlocked" :text="'Glyph choices on Reality'" :noLevelOverride="true" :glyphs="glyphs"/>
  `,
});
