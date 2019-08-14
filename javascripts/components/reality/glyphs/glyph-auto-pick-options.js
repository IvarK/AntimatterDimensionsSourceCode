"use strict";

Vue.component("glyph-auto-pick-options", {
  data() {
    return {
      unlocked: false,
      mode: AutoGlyphPickMode.RANDOM,
    };
  },
  computed: {
    modes() {
      return AutoGlyphPickMode;
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
      this.unlocked = EffarigUnlock.autopicker.isUnlocked;
      this.mode = AutoGlyphPicker.mode;
    },
    setMode(m) {
      AutoGlyphPicker.mode = m;
    },
  },
  template: `
  <div v-if="unlocked" class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
    <div :class="optionClass(modes.RANDOM)" @click="setMode(modes.RANDOM)">
      Auto pick random
    </div>
    <div :class="optionClass(modes.RARITY)" @click="setMode(modes.RARITY)">
      Auto pick rarest
    </div>
    <div :class="optionClass(modes.ABOVE_SACRIFICE_THRESHOLD)" @click="setMode(modes.ABOVE_SACRIFICE_THRESHOLD)">
      Auto pick farthest above threshold
    </div>
  </div>
  `
});