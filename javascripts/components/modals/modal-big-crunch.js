"use strict";

Vue.component("modal-big-crunch", {
  props: { modalConfig: Object },
  data() { return { first: this.modalConfig.first }; },
  computed: {
    message() {
      const f = num => format(num, 2, 2);
      const gip = gainedInfinityPoints();
      const gi = gainedInfinities().round();
      if (this.first) return `Welcome to Infinity! Upon Infinity, all Dimensions, Dimension Boosts,
      and Antimatter Galaxies are reset, but in return, you gain an Infinity Point (IP). This
      allows you to buy multiple upgrades that you can find in the Infinity tab. There is no inherent boost for 
      unspent IP, but you can buy an upgrade that gives such a boost. Also, you gained an Infinitied stat,
      which is the stat shown in the Statistics tab. This contributes to multiple multipliers 
      seen in the Infinity Upgrades tab. `;
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset.
      You will gain ${f(gip)} ${pluralize("Infinity Point", gip)} on Infinity, as well as 
      ${f(gi)} ${pluralize("Infinity", gi, "Infinities")}.`;
    },
    topLabel() {
      if (this.first) return `Congratulations on reaching Infinity!`;
      return "You are about to Infinity";
    },
    buttonLabel() {
      if (this.first) return "Close";
      return "Cancel";
    }
  },
  methods: { 
    handleYesClick() {
      this.emitClose();
      bigCrunchReset();
    },
    handleNoClick() {
      this.emitClose();
    }
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
      {{ buttonLabel }}
    </primary-button>
    <primary-button
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="handleYesClick"
      v-if="!first"
    >
      Confirm
    </primary-button>
  </div>
</div>
  `
});