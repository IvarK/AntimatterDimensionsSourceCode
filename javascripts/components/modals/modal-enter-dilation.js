"use strict";

Vue.component("modal-enter-dilation", {
  data() {
    return {
      EPSinceLastDilation: new Decimal(0),
      OldEPSinceLastDilation: new Decimal(0),
      hasDilated: Achievement(136).isUnlocked
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return `Dilating time will start a new Eternity, and all of your Dimension/Infinity
        Dimension/Time Dimension multiplier's exponents and Tickspeed multiplier's exponent will be reduced to
        ^ ${format(0.75, 2, 2)}. If you can Eternity while Dilated,
        you'll be rewarded with Tachyon Particles based on your antimatter and Tachyon Particles.`;
},
    entranceLabel() {
      return `You are about to enter Dilation`;
    },
    EPSinceLabel() {
        if (!this.hasDilated) {
          return "This is your first Dilation";
        } 
          return `You last attempted Dilation at ${format(this.OldEPSinceLastDilation, 2, 2)} EP`;
        },
  },
  methods: {
    handleYesClick() {
      if (player.dilation.active) return;
      this.OldEPSinceLastDilation = this.OldEPSinceLastDilation.copyFrom(player.eternityPoints);
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
