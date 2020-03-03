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
        case AUTO_GLYPH_SAC_MODE.ALL: return "Sacrifice";
        case AUTO_GLYPH_SAC_MODE.ALCHEMY: return "Refine";
        default: return "Auto pick";
      }
    },
    lowestResourceText() {
      if (Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) && this.sacMode === AUTO_GLYPH_SAC_MODE.ALCHEMY) return "alchemy resource";
      return "total sacrifice";
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
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
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
    <div :class="optionClass(modes.LOWEST_RESOURCE)" @click="setMode(modes.LOWEST_RESOURCE)">
      {{ pickerText }} lowest {{ lowestResourceText }}
    </div>
  </div>
  `
});
