"use strict";

Vue.component("modal-animation-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      floatingText: false,
      bigCrunch: false,
      eternity: false,
      dilation: false,
      tachyonParticles: false,
      reality: false,
      background: false
    };
  },
  watch: {
    floatingText(newValue) {
      player.options.animations.floatingText = newValue;
    },
    bigCrunch(newValue) {
      player.options.animations.bigCrunch = newValue;
    },
    eternity(newValue) {
      player.options.animations.eternity = newValue;
    },
    dilation(newValue) {
      player.options.animations.dilation = newValue;
    },
    tachyonParticles(newValue) {
      player.options.animations.tachyonParticles = newValue;
    },
    reality(newValue) {
      player.options.animations.reality = newValue;
    },
    background(newValue) {
      player.options.animations.background = newValue;
    }
  },
  methods: {
    update() {
      const options = player.options.animations;
      this.floatingText = options.floatingText;
      this.bigCrunch = options.bigCrunch;
      this.eternity = options.eternity;
      this.tachyonParticles = options.tachyonParticles;
      this.reality = options.reality;
      this.background = options.background;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="floatingText" text="Floating text:"/>
      <on-off-button v-if="infinityUnlocked" v-model="bigCrunch" text="Big crunch:"/>
      <on-off-button v-if="eternityUnlocked" v-model="eternity" text="Eternity:"/>
      <on-off-button v-if="dilationUnlocked" v-model="dilation" text="Dilation:"/>
      <on-off-button v-if="dilationUnlocked" v-model="tachyonParticles" text="Tachyon particles:"/>
      <on-off-button v-if="realityUnlocked" v-model="reality" text="Reality:"/>
      <on-off-button
        v-if="animatedThemeUnlocked"
        v-model="background"
        onclick="Themes.find(player.options.theme).set();"
        text="Background:"/>
    </modal-options>`
});
