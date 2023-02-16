<script>
import { ElectronRuntime } from "@/steam";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "ZoomLevelSlider",
  components: {
    SliderComponent
  },
  data() {
    return {
      zoomLevel: 0
    };
  },
  computed: {
    sliderProps() {
      return {
        min: 50,
        max: 150,
        interval: 10,
        width: "100%",
        tooltip: false
      };
    }
  },
  methods: {
    update() {
      this.zoomLevel = Math.round(ElectronRuntime.zoomFactor * 100);
    },
    adjustSliderValue(value) {
      this.zoomLevel = value;
      ElectronRuntime.zoomLevel = Math.round(value / 10) / 10;
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Zoom Level: {{ formatInt(zoomLevel) }}%</b>
    <SliderComponent
      class="o-primary-btn--slider__slider"
      v-bind="sliderProps"
      :value="zoomLevel"
      @input="adjustSliderValue($event)"
    />
  </div>
</template>
