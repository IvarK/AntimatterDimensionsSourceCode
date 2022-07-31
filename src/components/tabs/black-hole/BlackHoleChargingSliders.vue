<script>
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "BlackHoleChargingSliders",
  components: {
    SliderComponent
  },
  data() {
    return {
      isAdjustableChargingUnlocked: false,
      isNegativeBHUnlocked: false,
      isInverted: false,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 300,
      storedFraction: 0,
    };
  },
  computed: {
    storedTimeRate() {
      return formatPercents(this.storedFraction / 1000, 1);
    },
  },
  methods: {
    update() {
      this.isAdjustableChargingUnlocked = Ra.unlocks.adjustableStoredTime.canBeApplied;
      this.isNegativeBHUnlocked = V.isFlipped && BlackHoles.arePermanent;
      this.isInverted = BlackHoles.areNegative;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      this.canAdjustStoredTime = Ra.unlocks.adjustableStoredTime.canBeApplied;
      this.storedFraction = 1000 * player.celestials.enslaved.storedFraction;
    },
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.requirementChecks.reality.slowestBH = Math.max(
        player.requirementChecks.reality.slowestBH,
        player.blackHoleNegative
      );
    },
    adjustSliderStoring(value) {
      this.storedFraction = value;
      player.celestials.enslaved.storedFraction = value / 1000;
    },
    sliderProps(negative) {
      return {
        min: 0,
        max: negative ? this.maxNegativeBlackHole : 990,
        interval: 1,
        width: "55rem",
        tooltip: false
      };
    },
  }
};
</script>

<template>
  <div>
    <div
      v-if="isAdjustableChargingUnlocked"
      class="l-black-hole-sliders"
    >
      <b>Black Hole charging rate: {{ storedTimeRate }}</b>
      <SliderComponent
        v-bind="sliderProps(false)"
        :value="storedFraction"
        @input="adjustSliderStoring($event)"
      />
    </div>
    <div
      v-if="isNegativeBHUnlocked"
      class="l-black-hole-sliders"
    >
      <b>
        Inverted Black Hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
        (Currently {{ isInverted ? "active" : "inactive" }}<span
          v-if="negativeSlider !== 0 && !isInverted"
          ach-tooltip="Black Hole must be paused to activate Inverted Black Hole"
        >
          <i class="fas fa-question-circle l-margin-left" />
        </span>)
      </b>
      <SliderComponent
        v-bind="sliderProps(true)"
        :value="negativeSlider"
        @input="adjustSliderNegative($event)"
      />
      <br>
      Inverting the Black Hole only affects its own speedup, no other upgrades or effects, although
      it will also indirectly affect the Effarig Game speed power effect.
    </div>
  </div>
</template>

<style scoped>
.l-margin-left {
  margin-left: 0.5rem;
}
</style>
