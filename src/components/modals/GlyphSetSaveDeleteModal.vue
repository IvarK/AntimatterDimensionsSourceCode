<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetSaveDeleteModal",
  components: {
    ModalWrapperChoice,
    GlyphSetPreview
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      glyphSet: []
    };
  },
  methods: {
    update() {
      this.glyphSet = Glyphs.copyForRecords(player.reality.glyphs.sets[this.modalConfig.glyphSetId]);
    },
    handleYesClick() {
      player.reality.glyphs.sets[this.modalConfig.glyphSetId] = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Delete this Glyph Set
    </template>
    <div class="c-modal-message__text">
      Please confirm your desire to delete this Glyph Set:
      <GlyphSetPreview
        :is-in-modal="true"
        :glyphs="glyphSet"
      />
      This will not affect your actual glyphs, only the saved preset.
      <br>
      This is permanent and irreversible.
    </div>
    <template #confirm-text>
      Delete
    </template>
  </ModalWrapperChoice>
</template>
