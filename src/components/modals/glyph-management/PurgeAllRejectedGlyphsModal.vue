<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllRejectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      glyphsTotal: 0,
      glyphsDeleted: 0,
      isRefining: false,
    };
  },
  computed: {
    refiningOrSacrificing() {
      if (this.isRefining) return `Refine`;
      return `Sacrifice`;
    },
    topLabel() {
      return `You are about to ${this.refiningOrSacrificing} all rejected Glyphs`;
    },
    message() {
      return `Are you sure you want to ${this.refiningOrSacrificing} all rejected Glyphs? This will remove
      all Glyphs that would be rejected by your new Glyph Filter settings that were previously not removed.
      This process is irreversible!`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `This will remove no Glyphs.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `This will remove all your Glyphs.`;
      return `This process will remove ${this.glyphsDeleted}/${this.glyphsTotal} Glyphs.`;
    }
  },
  methods: {
    update() {
      this.glyphsTotal = Glyphs.inventory.filter(slot => slot !== null).length;
      this.glyphsDeleted = Glyphs.deleteAllRejected(false);
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      Glyphs.deleteAllRejected(true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
