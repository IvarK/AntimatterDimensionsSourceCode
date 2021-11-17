Vue.component("modal-break-infinity", {
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  computed: {
    message() {
      const infinity = formatPostBreak(Number.MAX_VALUE, 2);
      return `Breaking Infinity will allow you to gain antimatter past ${infinity}${PlayerProgress.eternityUnlocked()
        ? "." : `, and allow you to read numbers past ${infinity}.`}
        Dimensions and Tickspeed Upgrades will scale in cost faster after ${infinity} antimatter.
        You will gain additional Infinity Points on Big Crunch based on antimatter produced over ${infinity}.\
        ${EternityMilestone.keepAutobuyers.isReached ? "" : `\nIt will also unlock Break Infinity Upgrades and max\
        all Normal Challenge Autobuyers.`}`.split("\n");
    },
  },
  methods: {
    handleYesClick() {
      breakInfinity();
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are Breaking Infinity</h2>
      <div class="c-modal-message__text">
        <span v-for="line in message">
          {{ line }} <br>
        </span>
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Break
        </primary-button>
      </div>
    </div>`
});
