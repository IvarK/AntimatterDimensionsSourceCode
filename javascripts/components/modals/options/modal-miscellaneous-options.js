"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      formatIntegers: false,
      showGlyphEffectDots: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    formatIntegers(newValue) {
      player.options.formatIntegers = newValue;
    },
    showGlyphEffectDots(newValue) {
      player.options.showGlyphEffectDots = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.offlineProgress = options.offlineProgress;
      this.showGlyphEffectDots = options.showGlyphEffectDots;
      this.formatIntegers = options.formatIntegers ;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <on-off-button v-model="formatIntegers" text='Format integers in "painful" notations:'/>
      <on-off-button v-if="realityUnlocked" v-model="showGlyphEffectDots" text="Dots on glyphs (showing effects):"/>
    </modal-options>`
});
