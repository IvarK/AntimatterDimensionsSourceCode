<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "AnimationOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    SliderComponent
  },
  data() {
    return {
      infinityUnlocked: false,
      eternityUnlocked: false,
      dilationUnlocked: false,
      tachyonsUnlocked: false,
      realityUnlocked: false,
      animatedThemeUnlocked: false,
      bigCrunch: false,
      eternity: false,
      dilation: false,
      tachyonParticles: false,
      reality: false,
      background: false,
      blobSnowflakes: 16,
      isS11Active: false
    };
  },
  computed: {
    sliderProps() {
      return {
        min: 1,
        max: 500,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    },
    fullCompletion() {
      return player.records.fullGameCompletions > 0;
    }
  },
  watch: {
    bigCrunch(newValue) {
      player.options.animations.bigCrunch = newValue;
    },
    eternity(newValue) {
      player.options.animations.eternity = newValue;
    },
    dilation(newValue) {
      player.options.animations.dilation = newValue;
    },
    tachyonParticles(newValue) {
      player.options.animations.tachyonParticles = newValue;
    },
    reality(newValue) {
      player.options.animations.reality = newValue;
    },
    background(newValue) {
      player.options.animations.background = newValue;
    },
    blobSnowflakes(newValue) {
      player.options.animations.blobSnowflakes = parseInt(newValue, 10);
    }
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.infinityUnlocked = this.fullCompletion || progress.isInfinityUnlocked;
      this.eternityUnlocked = this.fullCompletion || progress.isEternityUnlocked;
      this.realityUnlocked = this.fullCompletion || progress.isRealityUnlocked;
      // 136 is given upon dilating
      this.dilationUnlocked = this.realityUnlocked || Achievement(136).canBeApplied;
      this.tachyonsUnlocked = this.realityUnlocked || Currency.tachyonParticles.gt(0);
      this.animatedThemeUnlocked = Theme.animatedThemeUnlocked;
      this.isS11Active = Theme.currentName() === "S11";

      const options = player.options.animations;
      this.bigCrunch = options.bigCrunch;
      this.eternity = options.eternity;
      this.dilation = options.dilation;
      this.tachyonParticles = options.tachyonParticles;
      this.reality = options.reality;
      this.background = options.background;
      this.blobSnowflakes = options.blobSnowflakes;
    },
    adjustSliderValue(value) {
      this.blobSnowflakes = value;
      player.options.blobSnowflakes = this.blobSnowflakes;
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Animation Options
    </template>
    <div class="c-modal-options__button-container">
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="bigCrunch"
        text="Big Crunch:"
      />
      <ModalOptionsToggleButton
        v-if="eternityUnlocked"
        v-model="eternity"
        text="Eternity:"
      />
      <ModalOptionsToggleButton
        v-if="dilationUnlocked"
        v-model="dilation"
        text="Dilation:"
      />
      <ModalOptionsToggleButton
        v-if="tachyonsUnlocked"
        v-model="tachyonParticles"
        text="Tachyon particles:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="reality"
        text="Reality:"
      />
      <div v-if="!isS11Active">
        <ModalOptionsToggleButton
          v-if="animatedThemeUnlocked"
          v-model="background"
          onclick="Themes.find(Theme.currentName()).set();"
          text="Background:"
        />
      </div>
      <div v-else>
        <ModalOptionsToggleButton
          v-if="animatedThemeUnlocked"
          v-model="background"
          onclick="Themes.find(Theme.currentName()).set();"
          text="Blobsnow:"
        />
      </div>
      <div
        v-if="isS11Active"
        class="c-blobflake-slider o-primary-btn o-primary-btn--modal-option o-primary-btn--slider"
      >
        <b>{{ quantifyInt("Blobflake", parseInt(blobSnowflakes)) }}</b>
        <SliderComponent
          class="o-primary-btn--slider__slider"
          v-bind="sliderProps"
          :value="blobSnowflakes"
          @input="adjustSliderValue($event)"
        />
      </div>
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.c-blobflake-slider {
  padding: 1.2rem;
}
</style>
