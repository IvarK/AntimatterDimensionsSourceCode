"use strict";

Vue.component("glyph-auto-pick-options", {
  data() {
    return {
      mode: AUTO_GLYPH_REJECT.SACRIFICE,
    };
  },
  computed: {
    modes() {
      return AUTO_GLYPH_REJECT;
    },
  },
  methods: {
    optionClass(idx) {
      return [
        idx === this.mode
          ? "c-glyph-auto-pick-options__option--active"
          : "c-glyph-auto-pick-options__option--inactive",
        "c-glyph-auto-pick-options__option",
        "l-glyph-auto-pick-options__option"
      ];
    },
    update() {
      this.mode = AutoGlyphProcessor.sacMode;
    },
    setMode(m) {
      AutoGlyphProcessor.sacMode = m;
    },
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
      <span class="c-glyph-sacrifice-options__advanced">
        Behavior for deleted and filtered
        <br>
        Glyphs in non-Alchemy modes:
      </span>
      <br>
      <div :class="optionClass(modes.SACRIFICE)" @click="setMode(modes.SACRIFICE)">
        Always sacrifice
      </div>
      <div :class="optionClass(modes.REFINE)" @click="setMode(modes.REFINE)">
        Always refine
      </div>
      <div :class="optionClass(modes.REFINE_TO_CAP)" @click="setMode(modes.REFINE_TO_CAP)">
        Refine to cap, then sacrifice
      </div>
    </div>`
});
