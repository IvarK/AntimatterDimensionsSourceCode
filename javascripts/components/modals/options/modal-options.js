"use strict";

Vue.component("modal-options", {
  template: `<div class="c-modal-options l-modal-options">
    <modal-close-button @click="emitClose"/><slot/>
  </div>`
});

const modalOptionsMixin = {
  data() {
    return {
      bigCrunchUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      dilationUnlocked: false,
      animatedThemeUnlocked: false
    };
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.bigCrunchUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      this.realityUnlocked = progress.isRealityUnlocked;
      this.dilationUnlocked = progress.isRealityUnlocked || player.dilation.tachyonParticles.neq(0);
      this.animatedThemeUnlocked = Themes.find("S6").isAvailable() || Themes.find("s1").isAvailable();
    }
  },
  components: {
    "on-off-button": {
      props: ["value", "text"],
      template: `<primary-button-on-off :value="value" :text="text" @input="emitInput" class="o-primary-btn--option"/>`
    }
  }
};