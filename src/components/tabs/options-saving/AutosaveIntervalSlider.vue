<script>
export default {
  name: "AutosaveIntervalSlider",
  data() {
    return {
      autosaveInterval: 10
    };
  },
  methods: {
    update() {
      this.autosaveInterval = player.options.autosaveInterval / 1000;
    },
    handleInput(event) {
      this.autosaveInterval = parseInt(event.target.value, 10);
      player.options.autosaveInterval = this.autosaveInterval * 1000;
      GameOptions.refreshAutosaveInterval();
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Autosave interval: {{ formatInt(autosaveInterval) }}s</b>
    <input
      :value="autosaveInterval"
      class="o-primary-btn--slider__slider"
      type="range"
      min="10"
      max="60"
      @input="handleInput"
    >
  </div>
</template>
