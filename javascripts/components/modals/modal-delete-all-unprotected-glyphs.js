"use strict";

Vue.component("modal-delete-all-unprotected-glyphs", {
  data() {
    return {
      isRefining: Boolean,
      isSacrificing: Boolean,
    };
  },
  computed: {
    refiningSacrificingOrDeleting() {
      if (this.isRefining) return `Refine`;
      if (this.isSacrificing) return `Sacrifice`;
      return `delete`;
    },
    topLabel() {
      return `You are about to ${this.refiningSacrificingOrDeleting} all unprotected Glyphs`;
    },
    message() {
      return `Are you sure you want to ${this.refiningSacrificingOrDeleting} all unprotected Glyphs 
      in your inventory? This process is irreversible!`;
    }
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
      this.isSacrificing = GlyphSacrificeHandler.canSacrifice;
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.deleteAllUnprotected();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ topLabel }}</h2>
    <div class="c-modal-hard-reset-danger">
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