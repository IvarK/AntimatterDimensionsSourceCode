"use strict";

Vue.component("modal-exit-dilation", {
  props: {
    modalConfig: Object,
  },
  data() {
    return {
      tachyonGain: new Decimal(0),
      totalTachyons: new Decimal(0),
      requiredForGain: new Decimal(0),
      hasGain: false
    };
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  computed: {
    entranceLabel() {
      return `You are about to exit Dilation`;
    },
  },
  methods: {
    update() {
      if (!player.dilation.active) {
        this.emitClose();
        return;
      }
      this.tachyonGain.copyFrom(getTachyonGain());
      this.totalTachyons.copyFrom(Currency.tachyonParticles.value.plus(getTachyonGain()));
      this.requiredForGain = getTachyonReq();
      this.hasGain = this.tachyonGain.gt(0);
    },
    message() {
      return `Exiting Dilation now will ${this.hasGain
        ? `reward you with ${format(this.tachyonGain, 2, 2)} Tachyon Particles, increasing your Tachyon Particles to
          ${format(this.totalTachyons, 2, 2)}`
        : `not reward you with any Tachyon Particles, as you need at least
          ${format(this.requiredForGain, 2, 2)} antimatter to gain more Tachyon Particles`
      }.`;
    },
    handleYesClick() {
      Reset.exitDilation.request(this.modalConfig);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ entranceLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message() }}
      </div>
      <br>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Exit
        </primary-button>
      </div>
    </div>`
});
