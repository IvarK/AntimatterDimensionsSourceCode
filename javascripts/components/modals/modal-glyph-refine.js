"use strict";

Vue.component("modal-glyph-refine", {
  props: { modalConfig: Object },
  computed: {
    message() {
      return `Refining a Glyph will remove the Glyph from your inventory, and in return, you will increase your
      ${this.resourceName} Alchemy resource from ${format(this.resourceAmount, 2, 2)} to ${format(this.after, 2, 2)}.
      Your current Alchemy cap is ${this.cap}.`;
    }
  },
  data() {
    return {
      idx: this.modalConfig.idx,
      resourceName: this.modalConfig.resourceName,
      resourceAmount: this.modalConfig.resourceAmount,
      gain: this.modalConfig.gain, 
      after: this.resourceAmount + this.gain,
      cap: format(this.modalConfig.cap, 2, 2),
    };
  },
  methods: {
    update() {
      this.glyph = Glyphs.findByInventoryIndex(this.idx);
      this.isProtected = this.idx < Glyphs.protectedSlots;
      this.after = this.resourceAmount + this.gain;
    },
    handleYesClick() {
      if (this.isProtected) {
        this.emitClose();
        Modal.message.show("This Glyph is protected and cannot be refined.");
        return;
      }
      GlyphSacrificeHandler.actuallyRefineGlyph(this.glyph);
      this.emitClose();
    }, 
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `<div class="c-modal-message l-modal-content--centered">
  <h2>You are about to refine a Glyph</h2>
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