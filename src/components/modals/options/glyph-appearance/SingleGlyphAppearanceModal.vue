<script>
import GlyphCustomizationSingle from "@/components/modals/options/glyph-appearance/GlyphCustomizationSingle";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SingleGlyphAppearanceModal",
  components: {
    ModalWrapperOptions,
    GlyphCustomizationSingle,
    PrimaryButton
  },
  props: {
    glyphId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      // This is here to force a re-render if the appearance is set to the default values
      defaultKeySwap: false,
    };
  },
  computed: {
    glyphType() {
      return Glyphs.findById(this.glyphId).type;
    }
  },
  methods: {
    update() {
      this.defaultKeySwap = true;
    },
    reset() {
      const glyph = Glyphs.findById(this.glyphId);
      glyph.color = undefined;
      glyph.symbol = undefined;
      this.defaultKeySwap = false;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Modifying Single Glyph Appearance
    </template>
    <GlyphCustomizationSingle
      :key="defaultKeySwap"
      :type="glyphType"
      :glyph-id="glyphId"
    />
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="reset"
    >
      Reset this Glyph's appearance
    </PrimaryButton>
  </ModalWrapperOptions>
</template>

<style scoped>

</style>
