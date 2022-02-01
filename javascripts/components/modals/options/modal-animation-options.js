import { modalOptionsMixin } from "./modal-options.js";

Vue.component("modal-animation-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      bigCrunch: false,
      eternity: false,
      dilation: false,
      tachyonParticles: false,
      reality: false,
      background: false
    };
  },
  watch: {
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
      this.bigCrunch = options.bigCrunch;
      this.eternity = options.eternity;
      this.dilation = options.dilation;
      this.tachyonParticles = options.tachyonParticles;
      this.reality = options.reality;
      this.background = options.background;
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 50rem">
      <div class="c-modal-options__button-container">
        <wide-on-off-button v-if="infinityUnlocked" v-model="bigCrunch" text="Big crunch:" />
        <wide-on-off-button v-if="eternityUnlocked" v-model="eternity" text="Eternity:" />
        <wide-on-off-button v-if="dilationUnlocked" v-model="dilation" text="Dilation:" />
        <wide-on-off-button v-if="dilationUnlocked" v-model="tachyonParticles" text="Tachyon particles:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="reality" text="Reality:" />
        <wide-on-off-button
          v-if="animatedThemeUnlocked"
          v-model="background"
          onclick="Themes.find(player.options.theme).set();"
          text="Background:"
        />
      </div>
    </modal-options>`
});
