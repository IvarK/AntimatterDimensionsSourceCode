"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      showGlyphEffectDots: false,
      respecIntoProtected: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    showGlyphEffectDots(newValue) {
      player.options.showGlyphEffectDots = newValue;
    },
    respecIntoProtected(newValue) {
      player.options.respecIntoProtected = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.offlineProgress = options.offlineProgress;
      this.showGlyphEffectDots = options.showGlyphEffectDots;
      this.respecIntoProtected = options.respecIntoProtected;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <on-off-button v-if="realityUnlocked" v-model="showGlyphEffectDots" text="Dots on glyphs (showing effects):"/>
      <on-off-button v-if="realityUnlocked" v-model="respecIntoProtected" text="Put glyphs cleared from inventory into top two rows:"/>
    </modal-options>`
});
