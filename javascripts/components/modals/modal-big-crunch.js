"use strict";

Vue.component("modal-big-crunch", {
  data() {
    return { 
      gainedInfinities: gainedInfinities().round(),
      gainedInfinityPoints: gainedInfinityPoints(),
    }; 
  },
  computed: {
    message() {
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. You will gain 
      ${format(this.gainedInfinityPoints, 2, 2)} ${pluralize("Infinity Point", this.gainedInfinityPoints)} on Infinity,
      and ${format(this.gainedInfinities, 2, 2)} ${pluralize("Infinity", this.gainedInfinities, "Infinities")}.`;
    },
  },
  methods: { 
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints();
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