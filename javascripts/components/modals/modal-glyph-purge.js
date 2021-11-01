"use strict";

Vue.component("modal-glyph-purge", {
  props: { modalConfig: Object },
  computed: {
    glyphsTotal() { return Glyphs.inventory.filter(slot => slot !== null).length; },
    harsh() { return this.modalConfig.harsh; },
    threshold() { return this.harsh ? 1 : 5; },
    glyphsDeleted() { return Glyphs.autoClean(this.threshold, false); },
    extraMessage() {
      return `${this.whichType} will delete ${this.glyphsDeleted}/${this.glyphsTotal} of your Glyphs.`;
    },
    explanation() {
      if (this.harsh) return `Harsh Purging deletes Glyphs that are strictly worse than any other Glyph in your
      inventory. For example, if there is a Glyph that has all better effects than another, the worse is deleted.`;
      return `Purging deletes Glyphs that are worse than enough other Glyphs. Instead of keeping one good Glyph,
      like Harsh Purge, it keeps five.`;
    },
    whichType() {
      return this.harsh ? `Harsh Purging` : `Purging`;
    },
    topLabel() {
      return `You are about to ${this.harsh ? `Harsh Purge` : `Purge`} your Glyphs`;
    },
  },
  methods: {
    handleYesClick() {
      this.emitClose();
      Glyphs.autoClean(this.harsh ? 1 : 5, true);
      if (player.reality.autoCollapse) Glyphs.collapseEmptySlots();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ topLabel }}</h2>
      <div class="c-modal-message__text">
        This could delete Glyphs in your inventory that are good enough that you might want to use them
        later. Are you sure you want to do this? This process is irreversible! Purging will Purge Glyphs based on your
        Purge mode.
        <br>
        <br>
        {{ explanation }}
      </div>
      <br>
      <div class="c-modal-hard-reset-danger">
        {{ extraMessage }}
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