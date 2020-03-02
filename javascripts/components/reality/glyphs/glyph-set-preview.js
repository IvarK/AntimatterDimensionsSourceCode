"use strict";

Vue.component("glyph-set-preview", {
  props: {
    text: String,
    glyphs: Array
  },
  template:
    `<div>
      <span v-if="text">
        {{ text }}
        <br>
      </span>
      <glyph-component v-for="(g, idx) in glyphs"
        :key="idx"
        style="margin: 0.2rem;"
        :glyph="g"
        :showSacrifice="false"
        :draggable="false"
        :circular="true"
        size="2.8rem"
        :textProportion="0.6"
        glowBlur="0.2rem"
        glowSpread="0.1rem" />
    </div>`
});