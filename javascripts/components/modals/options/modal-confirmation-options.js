"use strict";

Vue.component("modal-confirmation-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      options: player.options.confirmations
    };
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="options.sacrifice" text="Sacrifice:"/>
      <on-off-button v-model="options.challenges" text="Challenges:"/>
      <on-off-button v-if="eternityUnlocked" v-model="options.eternity" text="Eternity:"/>
      <on-off-button v-if="dilationUnlocked" v-model="options.dilation" text="Dilation:"/>
      <on-off-button v-if="realityUnlocked" v-model="options.reality" text="Reality:"/>
    </modal-options>`
});