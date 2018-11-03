Vue.component('modal-options', {
    props: {
        closeButton: Boolean
    },
    template:
    `<div class="modal-options">
        <modal-close-button v-if="closeButton" @click="emitClose"/>
        <slot/>
    </div>`
});

Vue.component('modal-close-button', {
    template:
        '<primary-button class="closebtn" @click="emitClick">&times;</primary-button>'
});

var modalUnlocksMixin = {
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
  }
};

Vue.component('modal-animation-options', {
  mixins: [modalUnlocksMixin],
  data: function() {
    return {
      options: player.options.animations
    };
  },
  template:
    `<modal-options @close="emitClose" :closeButton="true" class="options-container">
        <primary-button-on-off text="Floating text:" v-model="options.floatingText"/>
        <primary-button-on-off v-if="bigCrunchUnlocked" text="Big crunch:" v-model="options.bigCrunch"/>
        <primary-button-on-off v-if="dilationUnlocked" text="Tachyon particles:" v-model="options.tachyonParticles"/>
        <primary-button-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"/>
    </modal-options>`
});

Vue.component('modal-confirmation-options', {
  mixins: [modalUnlocksMixin],
  data: function() {
    return {
      options: player.options.confirmations
    };
  },
  template:
    `<modal-options @close="emitClose" :closeButton="true" class="options-container">
        <primary-button-on-off text="Challenges:" v-model="options.challenges"/>
        <primary-button-on-off v-if="eternityUnlocked" text="Eternity:" v-model="options.eternity"/>
        <primary-button-on-off v-if="dilationUnlocked" text="Dilation:" v-model="options.dilation"/>
        <primary-button-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"/>
    </modal-options>`
});