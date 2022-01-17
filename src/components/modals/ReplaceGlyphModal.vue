<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplaceGlyphModal",
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
      Glyphs.swapIntoActive(this.glyph, this.targetSlot);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    @close="emitClose"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to replace a Glyph
    </template>
    Replacing a Glyph will restart this Reality.
  </ModalWrapperChoice>
</template>
