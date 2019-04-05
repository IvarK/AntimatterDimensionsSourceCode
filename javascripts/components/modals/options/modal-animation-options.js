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