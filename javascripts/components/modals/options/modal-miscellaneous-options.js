"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      showGlyphEffectDots: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
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
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <on-off-button v-if="realityUnlocked" v-model="showGlyphEffectDots" text="Dots on glyphs (showing effects):"/>
    </modal-options>`
});
