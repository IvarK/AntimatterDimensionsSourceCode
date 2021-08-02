"use strict";

Vue.component("modal-glyph-sacrifice", {
  props: { modalConfig: Object },
  data() {
    return { 
      isProtected: false,
      gain: 0
    };
  },
  created() {
    if (this.isProtected) {
      this.emitClose();
      Modal.message.show("This Glyph is protected and cannot be refined.");
    }
  },
  computed: {
    message() {
      return `Do you really want to sacrifice this glyph? Your total power of sacrificed ${this.glyph.type} ` +
      `glyphs will increase from ${format(player.reality.glyphs.sac[this.glyph.type], 2, 2)} to ` +
      `${format(player.reality.glyphs.sac[this.glyph.type] + this.gain, 2, 2)}.`;
    }
  },
  methods: {
    update() {
      this.glyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      this.isProtected = this.modalConfig.idx < Glyphs.protectedSlots;
      this.gain = this.modalConfig.gain;
    },
    handleYesClick() {
      player.reality.glyphs.sac[this.glyph.type] += this.gain;
      Glyphs.removeFromInventory(this.glyph);
      EventHub.dispatch(GAME_EVENT.GLYPH_SACRIFICED, this.glyph);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
    <h2>You are about to delete a Glyph</h2>
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