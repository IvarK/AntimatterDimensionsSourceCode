"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      showGlyphEffectDots: false,
      tabSwitch: false,
      respecIntoProtected: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    tabSwitch(newValue) {
      player.options.tabSwitch = newValue;
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
      this.tabSwitch = options.tabSwitch;
      this.respecIntoProtected = options.respecIntoProtected;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <wide-on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <wide-on-off-button
        v-if="infinityUnlocked"
        v-model="tabSwitch"
        text="Switch tabs on certain game events (such as entering challenges):"/>
      <wide-on-off-button
        v-if="realityUnlocked"
        v-model="showGlyphEffectDots"
        text="Dots on glyphs (showing effects):"/>
      <wide-on-off-button
        v-if="realityUnlocked"
        v-model="respecIntoProtected"
        text="Put glyphs cleared from inventory into top two rows:"/>
    </modal-options>`
});
