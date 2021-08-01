"use strict";

Vue.component("modal-glyph-delete", {
  props: {
    modalConfig: Object
  },
  methods: {
    update() {
      // I do things this way because I find it the easiest way to get the glyph.
      this.glyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      this.isProtected = this.modalConfig.idx < Glyphs.protectedSlots;
    },
    handleYesClick() {
      if (this.isProtected) {
        this.emitClose();
        Modal.message.show("This Glyph is protected and cannot be deleted.");
        return;
      }
      Glyphs.removeFromInventory(this.glyph);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
  <h2>You are about to delete a Glyph</h2>
  <div class="c-modal-message__text">
    Deleting a Glyph will remove the Glyph from your inventory, and you will not be able to recover it!
    <div class="c-modal-hard-reset-danger">There is no benefit in deleting a Glyph!</div>
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
</div>
  `
});