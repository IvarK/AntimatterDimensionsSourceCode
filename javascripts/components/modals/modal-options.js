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
          class="c-primary-btn--option"
        />`
    }
  }
};

Vue.component('modal-animation-options', {
  mixins: [modalOptionsMixin],
  data: function() {
    return {
      options: player.options.animations
    };
  },
  template:
    `<modal-options @close="emitClose">
        <on-off-button v-model="options.floatingText" text="Floating text:"/>
        <on-off-button v-if="bigCrunchUnlocked" v-model="options.bigCrunch" text="Big crunch:"/>
        <on-off-button v-if="dilationUnlocked" v-model="options.tachyonParticles" text="Tachyon particles:"/>
        <on-off-button v-if="realityUnlocked" v-model="options.reality" text="Reality:"/>
    </modal-options>`
});

Vue.component('modal-confirmation-options', {
  mixins: [modalOptionsMixin],
  data: function() {
    return {
      options: player.options.confirmations
    };
  },
  template:
    `<modal-options @close="emitClose">
        <on-off-button v-model="options.challenges" text="Challenges:"/>
        <on-off-button v-model="options.eternity" v-if="eternityUnlocked" text="Eternity:"/>
        <on-off-button v-model="options.dilation" v-if="dilationUnlocked" text="Dilation:"/>
        <on-off-button v-model="options.reality" v-if="realityUnlocked" text="Reality:"/>
    </modal-options>`
});