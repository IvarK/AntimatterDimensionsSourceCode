"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      showGlyphEffectDots: false,
      automaticTabSwitching: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    automaticTabSwitching(newValue) {
      player.options.automaticTabSwitching = newValue;
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
      this.automaticTabSwitching = options.automaticTabSwitching;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <wide-on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <wide-on-off-button
        v-if="infinityUnlocked"
        v-model="automaticTabSwitching"
        text="Switch tabs on certain game events (such as entering challenges):"/>
      <wide-on-off-button
        v-if="realityUnlocked"
        v-model="showGlyphEffectDots"
        text="Dots on glyphs (showing effects):"/>
    </modal-options>`
});
