<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeGlyphModal",
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
      glyphsTotal: 0,
      glyphsDeleted: 0,
    };
  },
  computed: {
    harsh() {
      return this.modalConfig.harsh;
    },
    threshold() {
      return this.harsh ? 1 : 5;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `This will Purge no Glyphs.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `This will Purge all your Glyphs.`;
      return `${this.harsh ? `Harsh Purging` : `Purging`} will delete ${this.glyphsDeleted}/${this.glyphsTotal}
      of your Glyphs.`;
    },
    explanation() {
      if (this.harsh) return `Harsh Purging deletes Glyphs that are strictly worse than any other Glyph in your
      inventory. For example, if there is a Glyph that has all better effects than another, the worse is deleted.`;
      return `Purging deletes Glyphs that are worse than enough other Glyphs. Instead of keeping one good Glyph,
      like Harsh Purge, it keeps five.`;
    },
    topLabel() {
      return `You are about to ${this.harsh ? `Harsh Purge` : `Purge`} your Glyphs`;
    },
  },
  methods: {
    update() {
      this.glyphsTotal = Glyphs.inventory.filter(slot => slot !== null).length;
      this.glyphsDeleted = Glyphs.autoClean(this.threshold, false);
    },
    handleYesClick() {
      Glyphs.autoClean(this.threshold, true);
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
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      This could delete Glyphs in your inventory that are good enough that you might want to use them
      later. Are you sure you want to do this? This process is irreversible! Purging will Purge Glyphs based on your
      Purge mode.
      <br>
      <br>
      {{ explanation }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
