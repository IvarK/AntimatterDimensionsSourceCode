"use strict";

Vue.component("glyph-set-preview", {
  props: {
    show: Boolean,
    text: String,
    glyphs: Array,
    ignoreModifiedLevel: Boolean,
    flipTooltip: Boolean,
    isInModal: Boolean,
    showName: {
      type: Boolean,
      default: true,
    },
    forceNameColor: {
      type: Boolean,
      default: true,
    },
    showSacrifice: {
      type: Boolean,
      default: false
    },
    noneText: {
      type: String,
      default: "(No Glyphs equipped)"
    }
  },
  data() {
    return {
      realityGlyphBoost: 0,
    };
  },
  methods: {
    update() {
      // There should only be one reality glyph; this picks one pseudo-randomly if multiple are cheated/glitched in
      const realityGlyph = this.glyphs.filter(g => g.type === "reality")[0];
      this.realityGlyphBoost = realityGlyph
        ? GameDatabase.reality.glyphEffects.realityglyphlevel.effect(realityGlyph.level)
        : 0;
    },
  },
  template: `
    <div v-if="show">
      <span v-if="text">
        {{ text }}
        <br>
      </span>
      <span v-if="glyphs.length !== 0">
        <glyph-set-name
          v-if="showName"
          :glyphSet="glyphs"
          :forceColor="forceNameColor"
        />
        <glyph-component
          v-for="(g, idx) in glyphs"
          :key="idx"
          style="margin: 0.2rem;"
          :glyph="g"
          :showSacrifice="showSacrifice"
          :draggable="false"
          :circular="true"
          :ignoreModifiedLevel="ignoreModifiedLevel"
          :realityGlyphBoost="realityGlyphBoost"
          :flipTooltip="flipTooltip"
          :isInModal="isInModal"
          size="2.8rem"
          :textProportion="0.6"
          glowBlur="0.2rem"
          glowSpread="0.1rem"
          bottomPadding="0.4rem"
        />
      </span>
      <span v-else>
        {{ noneText }}
      </span>
    </div>`
});
