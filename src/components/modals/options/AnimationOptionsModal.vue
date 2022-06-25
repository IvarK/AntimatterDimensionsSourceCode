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
      this.infinityUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      // 136 is given upon dilating
      this.dilationUnlocked = progress.isRealityUnlocked || Achievement(136).canBeApplied;
      this.tachyonsUnlocked = progress.isRealityUnlocked || Currency.tachyonParticles.gt(0);
      this.realityUnlocked = progress.isRealityUnlocked;
      this.animatedThemeUnlocked = Theme.animatedThemeUnlocked;
      this.isS11Active = player.options.theme === "S11";

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
    },
    sliderProps() {
      return {
        min: 1,
        max: 500,
        interval: 1,
        show: true,
        width: "100%",
        tooltip: false
      };
    }
  },
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
        text="Big crunch:"
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
          onclick="Themes.find(player.options.theme).set();"
          text="Background:"
        />
      </div>
      <div v-else>
        <ModalOptionsToggleButton
          v-if="animatedThemeUnlocked"
          v-model="background"
          onclick="Themes.find(player.options.theme).set();"
          text="Blobsnow:"
        />
      </div>
      <div
        v-if="isS11Active"
        class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider"
      >
        <b>{{ quantifyInt("Blobflake", parseInt(blobSnowflakes)) }}</b>
        <SliderComponent
          class="o-primary-btn--slider__slider"
          v-bind="sliderProps()"
          :value="blobSnowflakes"
          @input="adjustSliderValue($event)"
        />
      </div>
    </div>
  </ModalWrapperOptions>
</template>
