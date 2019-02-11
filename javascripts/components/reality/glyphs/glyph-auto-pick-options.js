Vue.component("glyph-auto-pick-options", {
  data: function () {
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
      return [idx == this.mode
        ? "c-glyph-auto-pick-options__option--active"
        : "c-glyph-auto-pick-options__option--inactive",
        "c-glyph-auto-pick-options__option",
        "l-glyph-auto-pick-options__option"];
    },
    update() {
      this.unlocked = Effarig.has(EFFARIG_UNLOCKS.AUTOPICKER);
      this.mode = AutoGlyphPicker.mode;
    },
    setMode(m) {
      AutoGlyphPicker.mode = m;
    },
  },
  template: /*html*/`
  <div v-if="unlocked" class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
    <div :class="optionClass(0)" @click="setMode(modes.RANDOM)">
      Auto pick random
    </div>
    <div :class="optionClass(1)" @click="setMode(modes.RARITY)">
      Auto pick rarest
    </div>
    <div :class="optionClass(2)" @click="setMode(modes.ABOVE_SACRIFICE_THRESHOLD)">
      Auto pick farthest above threshold
    </div>
  </div>
  `
});