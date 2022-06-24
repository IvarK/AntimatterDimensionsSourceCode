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
  methods: {
    update() {
      this.updateRate = player.options.updateRate;
    },
    adjustSliderStoring(value) {
      this.updateRate = value;
      player.options.updateRate = this.updateRate;
      GameOptions.refreshUpdateRate();
    },
    sliderProps() {
      return {
        min: 33,
        max: 200,
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
    <b>Update rate: {{ formatInt(updateRate) }} ms</b>
    <SliderComponent
      class="o-primary-btn--slider__slider"
      v-bind="sliderProps()"
      :value="updateRate"
      @input="adjustSliderStoring($event)"
    />
  </div>
</template>
