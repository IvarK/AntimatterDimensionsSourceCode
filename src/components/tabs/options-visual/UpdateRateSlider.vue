<script>
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "UpdateRateSlider",
  components: {
    SliderComponent
  },
  data() {
    return {
      updateRate: 0
    };
  },
  computed: {
    sliderProps() {
      return {
        min: 33,
        max: 200,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    }
  },
  methods: {
    update() {
      this.updateRate = player.options.updateRate;
    },
    adjustSliderValue(value) {
      this.updateRate = value;
      player.options.updateRate = this.updateRate;
      GameOptions.refreshUpdateRate();
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Update rate: {{ formatInt(updateRate) }} ms</b>
    <SliderComponent
      class="o-primary-btn--slider__slider"
      v-bind="sliderProps"
      :value="updateRate"
      @input="adjustSliderValue($event)"
    />
  </div>
</template>
