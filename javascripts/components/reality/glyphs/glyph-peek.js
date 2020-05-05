"use strict";

Vue.component("glyph-peek", {
  data() {
    return {
      glyphs: [],
      level: 0,
      seed: 0,
      canPeek: false,
      isVisible: false,
    };
  },
  methods: {
    update() {
      this.canPeek = Perk.glyphPeek1.isBought;
      this.isVisible = (Perk.glyphPeek1.isBought && TimeStudy.reality.isBought) || Perk.glyphPeek2.isBought;
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
  <glyph-set-preview v-if="isVisible"
    class="c-glyph-peek"
    :show="isVisible"
    :text="'Glyph choices for this Reality:'"
    :noLevelOverride="true"
    :glyphs="glyphs"/>
  <span v-else-if="canPeek"
    class="c-glyph-peek">
      Purchase the Reality study to see
      <br>
      this Reality's glyph choices
  </span>
  `,
});
