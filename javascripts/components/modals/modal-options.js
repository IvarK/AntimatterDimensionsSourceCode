Vue.component('modal-options', {
    props: {
        closeButton: Boolean
    },
    template:
    '<div class="modal-options">\
        <modal-close-button v-if="closeButton" @click="emitClose"></modal-close-button>\
        <slot></slot>\
    </div>'
});

Vue.component('modal-close-button', {
    template:
        '<store-button class="closebtn" @click="emitClick">&times;</store-button>'
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
    '<modal-options @close="emitClose" :closeButton="true" class="options-container">\
        <store-button-named-on-off text="Floating text:" v-model="options.floatingText"></store-button-named-on-off>\
        <store-button-named-on-off v-if="bigCrunchUnlocked" text="Big crunch:" v-model="options.bigCrunch"></store-button-named-on-off>\
        <store-button-named-on-off v-if="dilationUnlocked" text="Tachyon particles:" v-model="options.tachyonParticles"></store-button-named-on-off>\
        <store-button-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></store-button-named-on-off>\
    </modal-options>'
});

Vue.component('modal-confirmation-options', {
  mixins: [modalUnlocksMixin],
  data: function() {
    return {
      options: player.options.confirmations
    };
  },
  template:
    '<modal-options @close="emitClose" :closeButton="true" class="options-container">\
        <store-button-named-on-off text="Challenges:" v-model="options.challenges"></store-button-named-on-off>\
        <store-button-named-on-off v-if="eternityUnlocked" text="Eternity:" v-model="options.eternity"></store-button-named-on-off>\
        <store-button-named-on-off v-if="dilationUnlocked" text="Dilation:" v-model="options.dilation"></store-button-named-on-off>\
        <store-button-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></store-button-named-on-off>\
    </modal-options>'
});