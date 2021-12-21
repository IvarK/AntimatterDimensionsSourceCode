<script>
export default {
  name: "UpdateRateSlider",
  data() {
    return {
      updateRate: 0
    };
  },
  methods: {
    update() {
      this.updateRate = player.options.updateRate;
    },
    handleInput(event) {
      this.updateRate = parseInt(event.target.value, 10);
      player.options.updateRate = this.updateRate;
      GameOptions.refreshUpdateRate();
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Update rate: {{ formatInt(updateRate) }} ms</b>
    <input
      v-model="updateRate"
      class="o-primary-btn--slider__slider"
      type="range"
      min="33"
      max="200"
      @input="handleInput"
    >
  </div>
</template>
