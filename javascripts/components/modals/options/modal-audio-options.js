"use strict";

Vue.component("modal-audio-options", {
  data() {
    return {
      dimensionBoost: 0,
      antimatterGalaxy: 0,
      glyphMoved: 0,
      tabChanged: 0,
      achievementUnlocked: 0,
      breakInfinity: 0,
      fixInfinity: 0
    };
  },
  computed: {
    sounds() {
      return GameDatabase.sounds;
    }
  },
  methods: {
    update() {
      const sounds = Object.keys(this.$data);
      const options = player.options.audio;
      for (const sound of sounds) {
        this[sound] = options[sound];
      }
    },
    updateOption(sound) {
      const name = `${sound.name.camelize()}`;
      player.options.audio[name] = (player.options.audio[name] + 1) % this.getLabels(sound.options).length;
    },
    getText(name) {
      return `${name}: `;
    },
    getLabels(options) {
      if (options) {
        const labels = options.distinct();
        labels.unshift("Off");
        return labels;
      }
      return ["Off", "On"];
    },
    getButtonText(sound) {
      const labelIndex = this[`${sound.name.camelize()}`];
      return `${sound.name}: ${this.getLabels(sound.options)[labelIndex]}`;
    }
  },
  template: `
    <modal-options @close="emitClose">
      <primary-button
        v-for="(sound, index) in sounds"
        :key="index"
        @click="updateOption(sound)"
        class="o-primary-btn--option"
      >
      {{ getButtonText(sound) }}
      </primary-button>
    </modal-options>`
});
