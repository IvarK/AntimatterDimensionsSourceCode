"use strict";

Vue.component("glyph-set-preview", {
  props: {
    show: Boolean,
    text: String,
    glyphs: Array
  },
  template:
    `<div v-if="show">
      <span v-if="text">
        {{ text }}
        <br>
      </span>
      <span v-if="glyphs.length !== 0">
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
      </span>
      <span v-else>
        (No glyphs equipped)
      </span>
    </div>`
});