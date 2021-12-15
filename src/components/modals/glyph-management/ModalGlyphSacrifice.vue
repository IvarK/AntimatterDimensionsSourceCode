<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentGlyphSacrifice: 0,
      gain: 0
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.modalConfig.idx);
    },
    message() {
      return `Do you really want to sacrifice this Glyph? Your total power of sacrificed ${this.glyph.type}
      Glyphs will increase from ${format(this.currentGlyphSacrifice, 2, 2)} to
      ${format(this.currentGlyphSacrifice + this.gain, 2, 2)}.`;
    }
  },
  methods: {
    update() {
      this.currentGlyphSacrifice = player.reality.glyphs.sac[this.glyph.type];
      this.gain = GlyphSacrificeHandler.glyphSacrificeGain(this.glyph);

      const newGlyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      if (this.glyph !== newGlyph) {
        this.emitClose();
        Modal.message.show("The selected Glyph changed position or was otherwise changed!");
      }
    },
    handleYesClick() {
      this.emitClose();
      GlyphSacrificeHandler.sacrificeGlyph(this.glyph, true);
    },
    handleNoClick() {
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>You are about to sacrifice a Glyph</h2>
    <div class="c-modal-message__text">
      {{ message }}
    </div>

    <div class="l-options-grid__row">
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >
        Cancel
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >
        Confirm
      </PrimaryButton>
    </div>
  </div>
</template>
