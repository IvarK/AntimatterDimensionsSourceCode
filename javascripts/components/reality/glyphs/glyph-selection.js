"use strict";

Vue.component("modal-glyph-selection", {
  data() {
    return {
      glyphs: GlyphSelection.glyphs.map(GlyphGenerator.copy),
      canSacrifice: false,
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
      this.levelDifference = Math.abs(player.bestGlyphLevel - this.glyphs[0].level);
      this.canSacrifice = RealityUpgrades(19).isEffectActive;
    },
    select(index) {
      GlyphSelection.select(index, false);
    },
    trashGlyphs() {
      if (!player.options.confirmations.glyphSacrifice ||
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
                        :showSacrifice="canSacrifice"
                        @click.native="select(index)"/>
      </div>
      <button class="o-primary-btn o-primary-btn--glyph-trash"
        v-if="canSacrifice"
        v-on:click="trashGlyphs()">
          I don't want any of these glyphs,
          <br>
          pick and sacrifice one at random.
          <br>
          (these are {{ formatInt(levelDifference) }} {{"level" | pluralize(levelDifference)}}
          {{ direction }} than your best)
      </button>
    </div>
  </div>`,
});
