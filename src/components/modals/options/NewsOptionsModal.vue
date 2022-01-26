<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "NewsOptionsModal",
  components: {
    ModalOptionsToggleButton,
    PrimaryButton,
    ModalWrapperOptions,
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
    }
  },
};
</script>

<template>
  <ModalWrapperOptions>
    <template #header>
      News Options Modal
    </template>
    <PrimaryButton
      class="o-primary-btn o-primary-btn--option-wide"
      onclick="GameOptions.toggleNews()"
    >
      {{ newsOnOffLabel }}
    </PrimaryButton>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatInt(parseInt(repeatBuffer)) }} message repeat buffer</b>
      <input
        v-model="repeatBuffer"
        class="o-primary-btn--slider__slider"
        type="range"
        min="0"
        step="1"
        max="80"
      >
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(AIChance)) }} AI messages</b>
      <input
        v-model="AIChance"
        class="o-primary-btn--slider__slider"
        type="range"
        min="0"
        step="0.01"
        max="1"
      >
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(speed)) }} scroll speed</b>
      <input
        v-model="speed"
        class="o-primary-btn--slider__slider"
        type="range"
        min="0.5"
        step="0.01"
        max="2"
      >
    </div>
    <ModalOptionsToggleButton
      v-model="includeAnimated"
      class="o-primary-btn o-primary-btn--option-wide"
      text="Animation Effects:"
    />
  </ModalWrapperOptions>
</template>
