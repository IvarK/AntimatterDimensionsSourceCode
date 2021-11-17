Vue.component("modal-exit-celestial-reality", {
  data() {
    return {
      isRestarting: false,
    };
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.isRestarting = player.options.retryCelestial;
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to exit a Celestial Reality</h2>
      <div class="c-modal-message__text">
        <span v-if="isRestarting">
          Restarting a Celestial's Reality will reset your Reality and
          immediately enter you into this Celestial again, without the benefits of completing the Celestial.
        </span>
        <span v-else>
          Exiting a Celestial's Reality early will reset your Reality and
          exit the Celestial without the benefits of completing the Celestial.
        </span>
      </div>
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
          <span v-if="isRestarting">Restart</span>
          <span v-else>Exit</span>
        </primary-button>
      </div>
    </div>`
});
