import SliderComponent from "@/components/SliderComponent";

Vue.component("black-hole-charging-sliders", {
  components: {
    SliderComponent
  },
  data() {
    return {
      isNegativeBHUnlocked: false,
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
      this.isNegativeBHUnlocked = V.isFlipped && BlackHoles.arePermanent;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      this.canAdjustStoredTime = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
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
        show: true,
        width: "60rem",
        tooltip: false
      };
    },
  },
  template: `
    <div>
      <div v-if="canAdjustStoredTime" class="l-black-hole-sliders">
        Black Hole charging rate: {{ storedTimeRate }}
        <SliderComponent
          v-bind="sliderProps(false)"
          :value="storedFraction"
          @input="adjustSliderStoring($event)"
        />
      </div>
      <div v-if="isNegativeBHUnlocked" class="l-black-hole-sliders">
        Inverted Black Hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
        This requires both Black Holes to be permanent and only works when paused.
        <SliderComponent
          v-bind="sliderProps(true)"
          :value="negativeSlider"
          @input="adjustSliderNegative($event)"
        />
      </div>
    </div>`
});
