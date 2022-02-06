<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SacrificeGlyphModal",
  components: {
    ModalWrapperChoice
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
      Modal.hide();
      GlyphSacrificeHandler.sacrificeGlyph(this.glyph, true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      You are about to sacrifice a Glyph
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
