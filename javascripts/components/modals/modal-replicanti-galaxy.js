Vue.component("modal-replicanti-galaxy", {
  data() {
    return {
      replicanti: new Decimal(0),
      divideReplicanti: false,
    };
  },
  computed: {
    message() {
      const reductionString = this.divideReplicanti
        ? `divide your Replicanti by ${format(Number.MAX_VALUE, 2, 2)}
          (${format(this.replicanti, 2, 2)} to ${format(this.replicanti.divide(Number.MAX_VALUE), 2, 2)})`
        : `reset your Replicanti to ${formatInt(1)}`;
      return `A Replicanti Galaxy boosts Tickspeed the same way an Antimatter Galaxy does. However, it does not
        increase the cost of Antimatter Galaxies, nor is it affected by multipliers to Antimatter Galaxies specifically.
        It will ${reductionString}.`;
    }
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.divideReplicanti = Achievement(126).isUnlocked;
    },
    handleYesClick() {
      replicantiGalaxy();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to purchase a Replicanti Galaxy</h2>
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
