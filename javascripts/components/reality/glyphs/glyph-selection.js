"use strict";

Vue.component("modal-glyph-selection", {
  data() {
    return {
      glyphs: GlyphSelection.glyphs.map(GlyphGenerator.copy),
      canTrashGlyphs: false,
      levelDifference: 0,
    };
  },
  computed: {
    direction() {
      if (this.glyphs[0].level > player.bestGlyphLevel) return "higher";
      return "lower";
    }
  },
  methods: {
    update() {
      if (!GlyphSelection.glyphs.length) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphs[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.canTrashGlyphs = RealityUpgrades.allBought;
      this.levelDifference = Math.abs(player.bestGlyphLevel - this.glyphs[0].level);
    },
    select(index) {
      GlyphSelection.select(index, false);
    },
    trashGlyphs() {
      GlyphSelection.select(Math.floor(Math.random() * GlyphSelection.choiceCount), true);
    }
  },
  template: `
  <div class="l-modal-overlay c-modal-overlay">
    <div class="l-modal-glyph-selection c-modal">
      <div class="l-modal-glyph-selection__row">
        <glyph-component v-for="(glyph, index) in glyphs"
                        class="l-modal-glyph-selection__glyph"
                        :key="index"
                        :glyph="glyph"
                        :noLevelOverride="true"
                        @click.native="select(index)"/>
      </div>
      <button class="o-primary-btn o-primary-btn--glyph-trash"
        v-if="canTrashGlyphs"
        v-on:click="trashGlyphs()">
          I don't want any of these glyphs,
          <br>
          pick and sacrifice one at random.
          <br>
          (These are {{ formatInt(levelDifference) }} {{"level" | pluralize(levelDifference)}}
          {{ direction }} than your best)
      </button>
    </div>
  </div>`,
});
