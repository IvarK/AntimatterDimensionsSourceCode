Vue.component('modal-options', {
  template:
    `<div class="c-modal-options l-modal-options">
      <modal-close-button @click="emitClose"/>
      <slot/>
    </div>`
});

const modalOptionsMixin = {
  data: function() {
    return {
      bigCrunchUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      dilationUnlocked: false
    };
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.bigCrunchUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      this.realityUnlocked = progress.isRealityUnlocked;
      this.dilationUnlocked = progress.isRealityUnlocked || player.dilation.tachyonParticles.neq(0);
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