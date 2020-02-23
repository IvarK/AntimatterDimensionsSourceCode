"use strict";

Vue.component("modal-glyph-selection", {
  data() {
    return {
      glyphs: GlyphSelection.glyphs.map(GlyphGenerator.copy),
      canTrashGlyphs: false,
      bestGlyphLevel: 0,
    };
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
      this.bestGlyphLevel = player.bestGlyphLevel;
    },
    select(index) {
      GlyphSelection.select(index, false);
    },
    trashGlyphs() {
      if (!player.options.confirmations.glyphTrash ||
        confirm("Are you sure you want to sacrifice a random one of these glyphs?")) {
        GlyphSelection.select(Math.floor(Math.random() * GlyphSelection.choiceCount), true);
      }
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
          (Previous highest level glyph: {{ bestGlyphLevel }})
      </button>
    </div>
  </div>`,
});
