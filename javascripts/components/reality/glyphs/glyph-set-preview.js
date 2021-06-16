"use strict";

Vue.component("glyph-set-preview", {
  props: {
    show: Boolean,
    text: String,
    glyphs: Array,
    noLevelOverride: Boolean,
    flipTooltip: Boolean,
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
          :noLevelOverride="noLevelOverride"
          :flipTooltip="flipTooltip"
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
