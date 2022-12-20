<script>
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "ZoomLevelSlider",
  components: {
    SliderComponent
  },
  data() {
    return {
      updatedZoom: 0
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
        this.updatedZoom = Math.round(SteamFunctions.zoomLevel*100);
    },
    adjustSliderValue(value) {
        this.updatedZoom = value;
        SteamFunctions.zoomLevel = Math.round(value/10)/10
        localStorage.setItem("Zoom",SteamFunctions.zoomLevel)
        SteamFunctions.UIZoom()
        GameUI.notify.info(`Size changed to ${Math.round(SteamFunctions.zoomLevel*100)}%`);
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
    <b>Zoom Level: {{ formatInt(updatedZoom) }}%</b>
    <SliderComponent
      class="o-primary-btn--slider__slider"
      v-bind="sliderProps"
      :value="updatedZoom"
      @input="adjustSliderValue($event)"
    />
  </div>
</template>
