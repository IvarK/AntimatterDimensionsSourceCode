"use strict";

Vue.component("modal-big-crunch", {
  props: { modalConfig: Object },
  data() {
    return { 
      first: this.modalConfig.first,
      gi: gainedInfinities().round(),
      gip: gainedInfinityPoints(),
    }; 
  },
  computed: {
    message() {
      const f = num => format(num, 2, 2);
      if (this.first) return `Welcome to Infinity! Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter
      Galaxies are reset, but in return, you gain an Infinity Point (IP). Thisallows you to buy multiple upgrades that
      you can find in the Infinity tab. Also, you gained an Infinitied stat, which is the stat shown in the Statistics 
      tab.`;
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. You will gain 
      ${f(this.gip)} ${pluralize("Infinity Point", this.gip)} on Infinity, and ${f(this.gi)}
      ${pluralize("Infinity", this.gi, "Infinities")}.`;
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
    update() {
      this.gi = gainedInfinities().round();
      this.gip = gainedInfinityPoints();
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
    </div>`
});