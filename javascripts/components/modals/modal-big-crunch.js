import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-big-crunch", {
  components: {
    PrimaryButton
  },
  data() {
    return {
      gainedInfinities: Decimal,
      gainedInfinityPoints: Decimal,
    };
  },
  created() {
    this.$on(GAME_EVENT.INFINITY_RESET_AFTER, this.emitClose);
    this.$on(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.$on(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  computed: {
    message() {
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. You will gain
      ${quantify("Infinity Point", this.gainedInfinityPoints, 2, 2)} on Infinity,
      and ${quantify("Infinity", this.gainedInfinities)}.`;
    },
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints().round();
    },
    handleYesClick() {
      this.emitClose();
      bigCrunchResetRequest();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to Infinity</h2>
      <div class="c-modal-message__text">
        {{ message }}
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
          Confirm
        </PrimaryButton>
      </div>
    </div>`
});
