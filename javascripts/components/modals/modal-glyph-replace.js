"use strict";

Vue.component("modal-glyph-replace", {
  props: {
    modalConfig: Object
  },
  data() {
    return {
      targetSlot: 0,
      idx: 0,
    };
  },
  methods: {
    update() {
      this.targetSlot = this.modalConfig.targetSlot;
      this.idx = this.modalConfig.inventoryIndex;
      this.glyph = Glyphs.findByInventoryIndex(this.idx);
    },
    handleYesClick() {
      Glyphs.removeFromInventory(this.glyph);
      Glyphs.unequip(this.targetSlot, this.idx);
      finishProcessReality({
        reset: true,
        glyphUndo: false,
        restoreCelestialState: true,
      });
      player.reality.glyphs.active.push(this.glyph);
      Glyphs.active[this.targetSlot] = this.glyph;
      this.glyph.idx = this.targetSlot;
      Glyphs.updateRealityGlyphEffects();
      Glyphs.updateMaxGlyphCount();
      EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
      Glyphs.validate();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template: `<div class="c-modal-message l-modal-content--centered">
  <h2>You are about to replace a Glyph</h2>
  <div class="c-modal-message__text">
    Replacing a Glyph will restart this Reality.
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