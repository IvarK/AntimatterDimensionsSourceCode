"use strict";

Vue.component("modal-enter-dilation", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      return `Dilating time will start a new Eternity, and all of your Antimatter Dimension/Infinity
      Dimension/Time Dimension multiplier's exponents and Tickspeed multiplier's exponent
      will be reduced to ${formatPow(0.75, 2, 2)}. If you can Eternity while Dilated, 
      you'll be rewarded with Tachyon Particles based on your antimatter and Tachyon Particles.`; 
    },
    entranceLabel() {
      return `You are about to enter Dilation`;
    },
    EPSinceLabel() {
      if (player.dilation.lastEP.eq(-1)) {
        return "This is your first Dilation";
      } 
      return `You last completed Dilation at ${format(player.dilation.lastEP, 2, 2)} Eternity Points`;
    }
  },
  methods: {
    handleYesClick() {
      if (player.dilation.active) return;
      if (player.options.animations.dilation && document.body.style.animation === "") {
        dilationAnimation();
        setTimeout(startDilatedEternity, 1000);
      } else {
        startDilatedEternity();
      }
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
    <h2>{{ entranceLabel }}</h2>
    <h3>{{ EPSinceLabel }}</h3>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <br>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >Cancel</primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >Enter</primary-button>
        </div>
      </div>
    </div>`
});
