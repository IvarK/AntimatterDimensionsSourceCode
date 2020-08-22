"use strict";

Vue.component("modal-enter-dilation", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "Dilating time will start a new eternity, and all of your Dimension/Infinity" + 
        "Dimension/Time Dimension multiplier's exponents and tickspeed multiplier's exponent will be reduced to" +
        "^ 0.75. If you can eternity while Dilated, you'll be rewarded with tachyon particles based on your" +
        "antimatter and tachyon particles."; 
},
    entranceLabel() {
      return `You are about to enter Dilation`;
    },
    EPSinceLabel() {
        return `test1`;
    },
    EternitiesSinceLabel() {
      return `test2`;
    }
  },
  methods: {
    handleYesClick() {
      
    if (player.options.animations.dilation && document.body.style.animation === "") {
        dilationAnimation();
        setTimeout(startDilatedEternity, 1000);
      } else {
        startDilatedEternity();
      }
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
    <h2>{{ entranceLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <div v-if="!challengeIsCompleted" class="c-modal-message__text">
      <br>
      {{ reward }}
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >Cancel</primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleYesClick"
        >Begin</primary-button>
        </div>
      </div>
    </div>`
});