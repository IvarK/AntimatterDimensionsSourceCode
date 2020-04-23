"use strict";

Vue.component("modal-miscellaneous-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      offlineProgress: false,
      showGlyphEffectDots: false,
      respecStudiesTabSwitch: false,
      unlockEternityChallengeTabSwitch: false,
      respecIntoProtected: false,
    };
  },
  watch: {
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    respecStudiesTabSwitch(newValue) {
      player.options.respecStudiesTabSwitch = newValue;
    },
    unlockEternityChallengeTabSwitch(newValue) {
      player.options.unlockEternityChallengeTabSwitch = newValue;
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
      this.respecStudiesTabSwitch = options.respecStudiesTabSwitch;
      this.unlockEternityChallengeTabSwitch = options.unlockEternityChallengeTabSwitch;
      this.respecIntoProtected = options.respecIntoProtected;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <wide-on-off-button v-model="offlineProgress" text="Offline progress:"/>
      <wide-on-off-button
        v-if="eternityUnlocked"
        v-model="respecStudiesTabSwitch"
        text="Switch tabs to Time Study tab on time study respec:"/>
      <wide-on-off-button
        v-if="eternityUnlocked"
        v-model="unlockEternityChallengeTabSwitch"
        text="Switch tabs to Eternity Challenge tab on Eternity Challenge unlock:"/>
      <wide-on-off-button v-if="realityUnlocked" v-model="showGlyphEffectDots" text="Dots on glyphs (showing effects):"/>
      <wide-on-off-button
        v-if="realityUnlocked"
        v-model="respecIntoProtected"
        text="Put glyphs cleared from inventory into top two rows:"/>
    </modal-options>`
});
