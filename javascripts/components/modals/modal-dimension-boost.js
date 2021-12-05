Vue.component("modal-dimension-boost", {
  props: { modalConfig: Object },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, this.emitClose);
    this.on$(GAME_EVENT.BIG_CRUNCH_AFTER, this.emitClose);
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      return `You are about to do a Dimension Boost Reset`;
    },
    message() {
      const areDimensionsReset = Perk.antimatterNoReset.isBought || Achievement(111).isUnlocked
        ? `not reset anything because you have ${Perk.antimatterNoReset.isBought ? "Perk ANR" : "Achievement 111"}`
        : `reset your Antimatter and Antimatter Dimensions`;

      return `This will ${areDimensionsReset}. Are you sure you want to do this?`;
    },
  },
  methods: {
    handleYesClick() {
      this.emitClose();
      requestDimensionBoost(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ topLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
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
          Confirm
        </primary-button>
      </div>
    </div>`
});
