"use strict";

Vue.component("modal-options", {
  template:
    `<div class="c-modal-options l-modal-options">
      <modal-close-button @click="emitClose"/>
      <slot/>
    </div>`
});

const modalOptionsMixin = {
  data() {
    return {
      infinityUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      dilationUnlocked: false,
      alchemyUnlocked: false,
      animatedThemeUnlocked: false
    };
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.infinityUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      this.realityUnlocked = progress.isRealityUnlocked;
      this.dilationUnlocked = progress.isRealityUnlocked || player.dilation.tachyonParticles.neq(0);
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
      this.animatedThemeUnlocked = Themes.find("S1").isAvailable() || Themes.find("S6").isAvailable();
    }
  },
  components: {
    "on-off-button": {
      props: ["value", "text"],
      template:
        `<primary-button-on-off
          :value="value"
          :text="text"
          @input="emitInput"
          class="o-primary-btn--option"
        />`
    }
  }
};