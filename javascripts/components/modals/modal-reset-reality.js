import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-reset-reality", {
  components: {
    PrimaryButton
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleNoClick() {
      this.emitClose();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to reset your Reality</h2>
      <div class="c-modal-message__text">
        This will put you at the start of your Reality and reset your progress in this Reality,
        giving you no rewards from your progress in your current Reality.
        <br>
        <br>
        Are you sure you want to do this?
      </div>
      <div class="l-options-grid__row">
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Reset
        </PrimaryButton>
      </div>
    </div>`
});
