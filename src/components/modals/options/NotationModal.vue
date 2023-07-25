<script>
import * as ADNotations from "@antimatter-dimensions/notations";

import ModalWrapper from "@/components/modals/ModalWrapper";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NotationModal",
  components: {
    ModalWrapper,
    SliderComponent
  },
  data() {
    return {
      commaDigits: 0,
      notationDigits: 0,
    };
  },
  computed: {
    sampleNums() {
      const largestExponent = "123456789012345";
      const numbers = [];
      for (let digits = 4; digits < 16; digits++) numbers.push(Decimal.pow10(largestExponent.substring(0, digits)));
      return numbers;
    },
    sliderProps() {
      return {
        min: 3,
        max: 15,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    },
  },
  watch: {
    commaDigits(newValue) {
      player.options.notationDigits.comma = newValue;
      ADNotations.Settings.exponentCommas.min = 10 ** newValue;
    },
    notationDigits(newValue) {
      player.options.notationDigits.notation = newValue;
      ADNotations.Settings.exponentCommas.max = 10 ** newValue;
    },
  },
  // This puts the sliders in the right spots on initialization
  created() {
    const options = player.options.notationDigits;
    this.commaDigits = options.comma;
    this.notationDigits = options.notation;
  },
  methods: {
    update() {
      const options = player.options.notationDigits;
      this.commaDigits = options.comma;
      this.notationDigits = options.notation;
    },

    // These need a bit of extra logic to ensure that the notation threshold is always >= the comma threshold
    adjustSliderComma(value) {
      this.commaDigits = value;
      player.options.notationDigits.comma = value;
      if (value > this.notationDigits) this.adjustSliderNotation(value);
    },
    adjustSliderNotation(value) {
      this.notationDigits = value;
      player.options.notationDigits.notation = value;
      if (value < this.commaDigits) this.adjustSliderComma(value);
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Exponent Notation Settings
    </template>
    You can adjust what your numbers look like when very large. With small values, the exponent will
    be directly displayed with no additional formatting. Larger values will have commas inserted into the exponent
    for clarity, and the largest values will apply notation formatting to the exponent in order to shorten it. You can
    adjust the two thresholds between these regions below:
    <br>
    <br>
    <div class="c-single-slider">
      <b class="o-digit-text">Minimum for commas in exponent: {{ formatInt(commaDigits) }} digits</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="commaDigits"
        @input="adjustSliderComma($event)"
      />
    </div>
    <div class="c-single-slider">
      <b class="o-digit-text">Minimum for notation in exponent: {{ formatInt(notationDigits) }} digits</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="notationDigits"
        @input="adjustSliderNotation($event)"
      />
    </div>
    <br>
    Sample numbers for exponent formatting:
    <div class="c-sample-numbers">
      <span
        v-for="(num, id) in sampleNums"
        :key="id"
        class="o-single-number"
      >
        {{ formatPostBreak(num) }}
      </span>
    </div>
    <br>
    Note: The interface is generally optimized for Scientific notation with settings of {{ formatInt(5) }}
    and {{ formatInt(9) }} digits. Some text may look odd or overflow out of boxes if you
    differ significantly from these values. Additionally, these settings might not cause any visual changes
    when using certain notations.
  </ModalWrapper>
</template>

<style scoped>
.c-single-slider {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.o-digit-text {
  width: 40rem;
}

.o-slider {
  width: 25rem;
}

.c-sample-numbers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 1.5rem;
}

.o-single-number {
  width: 33%;
}
</style>
