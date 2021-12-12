import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("modal-options", {
  template: `
    <div class="c-modal-options l-modal-options">
      <modal-close-button @click="emitClose" />
      <slot />
    </div>`
});

export const modalOptionsMixin = {
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
      this.dilationUnlocked = progress.isRealityUnlocked || !Currency.tachyonParticles.eq(0);
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
      this.animatedThemeUnlocked = Theme.animatedThemeUnlocked;
    }
  },
  components: {
    "on-off-button": {
      components: {
        PrimaryToggleButton
      },
      props: ["value", "text"],
      template: `
        <PrimaryToggleButton
          :value="value"
          :label="text"
          @input="emitInput"
          class="o-primary-btn--option"
        />`
    },
    "wide-on-off-button": {
      components: {
        PrimaryToggleButton
      },
      props: ["value", "text"],
      template: `
        <PrimaryToggleButton
          :value="value"
          :label="text"
          @input="emitInput"
          class="o-primary-btn--option-wide"
        />`
    }
  }
};
