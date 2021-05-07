"use strict";

Vue.component("modal-break-infinity", {
  computed: {
    message() {
      const infinity = formatPostBreak(Number.MAX_VALUE, 2);
      return `Breaking Infinity will allow you to gain antimatter past ${infinity}${PlayerProgress.eternityUnlocked()
        ? "." : `, and allow you to read numbers past ${infinity}.`}
      Dimensions and Tickspeed Upgrades will scale in cost faster after ${infinity} antimatter.
      You will gain additional Infinity Points on Big Crunch based on antimatter produced over ${infinity}.\
      ${EternityMilestone.keepBreakUpgrades.isReached ? "" : "\nIt will also unlock Break Infinity Upgrades."}`
        .split("\n");
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
              >Break</primary-button>
      </div>
    </div>`
});
