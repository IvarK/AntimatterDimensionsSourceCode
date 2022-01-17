<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RefineGlyphModal",
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
      resourceAmount: 0,
      resourceUnlocked: false,
      gain: 0,
      after: 0,
      cap: 0,
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.modalConfig.idx);
    },
    resource() {
      return GlyphSacrificeHandler.glyphAlchemyResource(this.glyph);
    },
    resourceName() {
      return this.resource.name;
    },
  },
  methods: {
    update() {
      const resource = this.resource;
      this.resourceAmount = resource.amount;
      this.resourceUnlocked = resource.isUnlocked;
      this.gain = GlyphSacrificeHandler.glyphRefinementGain(this.glyph);
      this.cap = GlyphSacrificeHandler.glyphEffectiveCap(this.glyph);

      this.after = this.resourceAmount + this.gain;

      const newGlyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      if (this.glyph !== newGlyph) {
        this.emitClose();
        Modal.message.show("The selected Glyph changed position or was otherwise changed!");
      }
    },
    handleYesClick() {
      GlyphSacrificeHandler.refineGlyph(this.glyph);
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
      You are about to refine a Glyph
    </template>
    <div
      v-if="resourceUnlocked"
      class="c-modal-message__text"
    >
      Refining a Glyph will remove the Glyph from your inventory, and in return,
      you will increase your {{ resourceName }} Alchemy resource from
      {{ format(resourceAmount, 2, 2) }} to {{ format(after, 2, 2) }}.
      This Glyph can raise your {{ resourceName }} resource to at most {{ format(cap, 2, 2) }}.
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      You cannot gain any {{ resourceName }} Alchemy resource because you have not
      unlocked this Glyph's resource yet. You can still refine it anyway, but nothing
      will happen. Consider sacrificing the Glyph instead.
    </div>
  </ModalWrapperChoice>
</template>
