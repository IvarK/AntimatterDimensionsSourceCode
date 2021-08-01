"use strict";

Vue.component("modal-glyph-sacrifice", {
  props: { modalConfig: Object },
  data() {
    return { 
      isProtected: false,
      gain: 0
    };
  },
  methods: {
    update() {
      this.glyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      this.isProtected = this.modalConfig.idx < Glyphs.protectedSlots;
    },
    handleYesClick() {
      if (this.isProtected) {
        this.emitClose();
        Modal.message.show("This Glyph is protected and cannot be sacrificed.");
        return;
      }
      player.reality.glyphs.sac[this.glyph.type] += this.gain;
      Glyphs.removeFromInventory(this.glyph);
      EventHub.dispatch(GAME_EVENT.GLYPH_SACRIFICED, this.glyph);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `<div class="c-modal-message l-modal-content--centered">
  <h2>You are about to delete a Glyph</h2>
  <div class="c-modal-message__text">
    Deleting a Glyph will remove the Glyph from your inventory, and you will not be able to recover it!
    There is no benefit in deleting a Glyph!
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