<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NewsOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    PrimaryButton,
    SliderComponent
  },
  data() {
    return {
      enabled: false,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1,
      includeAnimated: false,
    };
  },
  computed: {
    newsOnOffLabel() {
      return `News: ${this.enabled ? "On" : "Off"}`;
    }
  },
  watch: {
    type(newValue) {
      player.options.news.type = newValue;
    },
    repeatBuffer(newValue) {
      player.options.news.repeatBuffer = parseInt(newValue, 10);
    },
    AIChance(newValue) {
      player.options.news.AIChance = parseFloat(newValue, 10);
    },
    speed(newValue) {
      player.options.news.speed = parseFloat(newValue, 10);
    },
    includeAnimated(newValue) {
      player.options.news.includeAnimated = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options.news;
      this.enabled = options.enabled;
      this.repeatBuffer = options.repeatBuffer;
      this.AIChance = options.AIChance;
      this.speed = options.speed;
      this.includeAnimated = options.includeAnimated;
    },
    adjustSliderStoring(select, value) {
      switch (select) {
        case 0:
          this.repeatBuffer = value;
          player.options.repeatBuffer = this.repeatBuffer;
          break;
        case 1:
          this.AIChance = value;
          player.options.AIChance = this.AIChance;
          break;
        case 2:
          this.speed = value;
          player.options.speed = this.speed;
          break;
        default:
          throw new Error("Unrecognized News Options selection");
      }
    },
    sliderProps(select) {
      switch (select) {
        case 0:
          return {
            min: 0,
            max: 80,
            interval: 1,
            show: true,
            width: "98%",
            tooltip: false
          };
        case 1:
          return {
            min: 0,
            max: 1,
            interval: 0.01,
            show: true,
            width: "98%",
            tooltip: false
          };
        case 2:
          return {
            min: 0.5,
            max: 2,
            interval: 0.01,
            show: true,
            width: "98%",
            tooltip: false
          };
        default:
          throw new Error("Unrecognized News Options selection");
      }
    }
  },
};
</script>

<template>
  <ModalWrapperOptions>
    <template #header>
      News Options
    </template>
    <PrimaryButton
      class="o-primary-btn o-primary-btn--option-wide"
      onclick="GameOptions.toggleNews()"
    >
      {{ newsOnOffLabel }}
    </PrimaryButton>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatInt(parseInt(repeatBuffer)) }} message repeat buffer</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderProps(0)"
        :value="repeatBuffer"
        @input="adjustSliderStoring(0, $event)"
      />
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(AIChance)) }} AI messages</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderProps(1)"
        :value="AIChance"
        @input="adjustSliderStoring(1, $event)"
      />
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(speed)) }} scroll speed</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderProps(2)"
        :value="speed"
        @input="adjustSliderStoring(2, $event)"
      />
    </div>
    <ModalOptionsToggleButton
      v-model="includeAnimated"
      class="o-primary-btn o-primary-btn--option-wide"
      text="Animation Effects:"
    />
  </ModalWrapperOptions>
</template>
