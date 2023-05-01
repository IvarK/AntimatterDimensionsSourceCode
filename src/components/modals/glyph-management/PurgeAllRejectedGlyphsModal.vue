<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllRejectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
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
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? ` Note that some of your Effect Filter scores are negative, which may cause you to lose some Glyphs
          you normally want to keep.`
        : "";
      return `Are you sure you want to ${this.refiningOrSacrificing} all rejected Glyphs? This will remove
        all Glyphs that would be rejected by your current Glyph Filter settings.${negativeWarning}`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `This will remove no Glyphs.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `This will remove all your Glyphs.`;
      return `This process will remove ${this.glyphsDeleted}/${this.glyphsTotal} Glyphs.`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.deleteAllRejected(false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      Glyphs.deleteAllRejected(true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrificeAll"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
