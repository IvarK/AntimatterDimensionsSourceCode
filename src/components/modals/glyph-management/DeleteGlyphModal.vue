<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "DeleteGlyphModal",
  components: {
    PrimaryButton
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.modalConfig.idx);
    },
  },
  methods: {
    update() {
      const newGlyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      if (this.glyph !== newGlyph) {
        this.emitClose();
        Modal.message.show("The selected Glyph changed position or was otherwise changed!");
      }
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.removeFromInventory(this.glyph);
    },
    handleNoClick() {
      this.emitClose();
    },
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>You are about to delete a Glyph</h2>
    <div class="c-modal-message__text">
      Deleting a Glyph will remove the Glyph from your inventory!
      <div class="c-modal-hard-reset-danger">
        There is no benefit in deleting a Glyph before you have unlocked Glyph Sacrifice!
      </div>
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
