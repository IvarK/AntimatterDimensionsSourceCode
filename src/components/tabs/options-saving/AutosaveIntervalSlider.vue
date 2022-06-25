<script>
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "AutosaveIntervalSlider",
  components: {
    SliderComponent
  },
  data() {
    return {
      autosaveInterval: 10
    };
  },
  methods: {
    update() {
      this.autosaveInterval = player.options.autosaveInterval / 1000;
    },
    adjustSliderValue(value) {
      this.autosaveInterval = value;
      player.options.autosaveInterval = this.autosaveInterval * 1000;
      GameOptions.refreshAutosaveInterval();
    },
    sliderProps() {
      return {
        min: 10,
        max: 60,
        interval: 1,
        show: true,
        width: "100%",
        tooltip: false
      };
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Autosave interval: {{ formatInt(autosaveInterval) }}s</b>
    <SliderComponent
      class="o-primary-btn--slider__slider"
      v-bind="sliderProps()"
      :value="autosaveInterval"
      @input="adjustSliderValue($event)"
    />
  </div>
</template>
