Vue.component("modal-glyph-selection", {
  data: function () {
    return {
      glyphs: GlyphSelection.glyphs.map(GlyphGenerator.copy),
    };
  },
  methods: {
    update() {
      if (!GlyphSelection.glyphs.length) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        if (this.glyphs[i].level != GlyphSelection.glyphs[i].level) {
          this.glyphs[i].level = GlyphSelection.glyphs[i].level;
          for (e of Object.keys(this.glyphs[i].effects)) {
            this.glyphs[i].effects[e] = GlyphSelection.glyphs[i].effects[e];
          }
        }
      }
    },
    select(index) {
      GlyphSelection.select(index);
    }
  },
  template: /*html*/`
  <div class="l-modal-overlay c-modal-overlay">
    <div class="l-modal-glyph-selection c-modal">
      <glyph-component v-for="(glyph, index) in glyphs" :key="index" :glyph=glyph
        @click.native="select(index)" class="l-modal-glyph-selection__glyph"/>
    </div>
  </div>`,
  computed: {
  },
});