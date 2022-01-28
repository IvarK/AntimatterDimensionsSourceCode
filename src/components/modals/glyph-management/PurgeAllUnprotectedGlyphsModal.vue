<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllUnprotectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
      isSacrificing: false,
    };
  },
  computed: {
    refiningSacrificingOrDeleting() {
      if (this.isRefining) return `Refine`;
      if (this.isSacrificing) return `Sacrifice`;
      return `delete`;
    },
    topLabel() {
      return `You are about to ${this.refiningSacrificingOrDeleting} all unprotected Glyphs`;
    },
    message() {
      return `Are you sure you want to ${this.refiningSacrificingOrDeleting} all unprotected Glyphs
      in your inventory? This process is irreversible!`;
    }
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
      this.isSacrificing = GlyphSacrificeHandler.canSacrifice;
    },
    handleYesClick() {
      Glyphs.deleteAllUnprotected();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-hard-reset-danger">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
