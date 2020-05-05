"use strict";

Vue.component("reality-peek-button", {
  data: () => ({
    isUnlocked: false,
    isUsable: false,
    ratio: 1,
  }),
  computed: {
    text() {
      return this.isUsable ? "View glyph choices" : "Unlock reality to view glyph choices";
    }
  },
  methods: {
    update() {
      this.isUnlocked = Perk.glyphPeek1.isBought;
      this.isUsable = TimeStudy.reality.isBought || Perk.glyphPeek2.isBought;
    },
    peek() {
      if (this.isUsable) {
        GlyphSelection.generate(GlyphSelection.choiceCount, getRealityProps(false, false), false);
      }
    }
  },
  template: `
  <button v-if="isUnlocked"
       class="c-reality-upgrade-btn l-reality-glyph-peek-button" v-on:click="peek()">
    {{text}}
  </button>`
});
