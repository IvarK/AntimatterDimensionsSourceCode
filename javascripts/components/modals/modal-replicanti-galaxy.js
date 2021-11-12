"use strict";

Vue.component("modal-replicanti-galaxy", {
  data() {
    return {
      replicanti: new Decimal(0),
      achievement126Unlocked: false,
    };
  },
  computed: {
    message() {
      return `A Replicanti Galaxy functions as a regular, standard Antimatter Galaxy would. It, however, does not 
      increase the cost on Antimatter Galaxies. It will ${this.achievement126Unlocked
    ? `divide your Replicanti by ${format(Number.MAX_VALUE, 2, 2)} 
    (${format(this.replicanti, 2, 2)} to ${format(this.replicanti.divide(Number.MAX_VALUE), 2, 2)})`
    : `reset your Replicanti to ${formatInt(1)}`}.`;
    }
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.achievement126Unlocked = Achievement(126).isUnlocked;
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