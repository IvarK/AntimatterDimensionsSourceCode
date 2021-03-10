"use strict";

Vue.component("modal-reality", {
  computed: {
    message() {
      return `Reality will reset everything except challenge records. Your Achievements are also reset, 
      but you will automatically get one back every 30 minutes. 
      You will also gain Reality Machines based on your Eternity Points, a Glyph with a power 
      level based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend 
      on quality of life upgrades, and unlock various upgrades.`;
    },
    gained() {
      return `You will gain ${format(gainedRealityMachines(), 2, 0)} Reality Machines 
      and ${format(simulatedRealityCount() + 1, 2, 0)} Perk 
      ${pluralize("Point", simulatedRealityCount() + 1, "Points")} on Reality.
      ${Achievement(154).isUnlocked ? `You also have a ${formatPercents(0.1)} 
      chance to multiply gained Perk Points due to Achievement 154.` : ""}`;
    },
    can() {
      return isRealityAvailable();
    }
  },
  methods: {
    handleYesClick() {
      requestManualReality();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: 
    `<div class="c-modal-message l-modal-content--centered">
      <h2>You are about to Reality</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <br>
      <div class="c-modal-message__text">
        {{ gained }}
      </div>
        <div class="l-options-grid__row">
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
          >Cancel</primary-button>
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
          :enabled="can"
          >Reality</primary-button>
        </div>
    </div>`
});

