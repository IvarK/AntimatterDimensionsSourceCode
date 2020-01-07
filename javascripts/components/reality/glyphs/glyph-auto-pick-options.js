"use strict";

Vue.component("glyph-auto-pick-options", {
  data() {
    return {
      unlocked: false,
      mode: AUTO_GLYPH_PICK_MODE.RANDOM,
      alchemyUnlocked: false,
      sacMode: 0
    };
  },
  computed: {
    modes() {
      return AUTO_GLYPH_PICK_MODE;
    },
    pickerText() {
      switch (this.sacMode) {
        case AutoGlyphSacMode.ALL: return "Sacrifice";
        case AutoGlyphSacMode.ALCHEMY: return "Refine";
        default: return "Auto pick";
      }
    }
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
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      this.sacMode = AutoGlyphSacrifice.mode;
    },
    setMode(m) {
      AutoGlyphPicker.mode = m;
    },
  },
  template: `
  <div v-if="unlocked" class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
    <div :class="optionClass(modes.RANDOM)" @click="setMode(modes.RANDOM)">
      {{ pickerText }} random
    </div>
    <div :class="optionClass(modes.RARITY)" @click="setMode(modes.RARITY)">
      {{ pickerText }} rarest
    </div>
    <div :class="optionClass(modes.ABOVE_SACRIFICE_THRESHOLD)" @click="setMode(modes.ABOVE_SACRIFICE_THRESHOLD)">
      {{ pickerText }} farthest above threshold
    </div>
    <div
      v-if="alchemyUnlocked"
      :class="optionClass(modes.LOWEST_ALCHEMY_RESOURCE)"
      @click="setMode(modes.LOWEST_ALCHEMY_RESOURCE)">
      {{ pickerText }} lowest alchemy resource
    </div>
  </div>
  `
});
