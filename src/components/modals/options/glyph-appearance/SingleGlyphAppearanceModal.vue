<script>
import GlyphCustomizationSingleType from "@/components/modals/options/glyph-appearance/GlyphCustomizationSingleType";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SingleGlyphAppearanceModal",
  components: {
    ModalWrapperOptions,
    GlyphCustomizationSingleType,
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
    },
    cosmeticTypes() {
      return CosmeticGlyphTypes.list.filter(t => t.isCosmetic && t.isUnlocked).map(t => t.id);
    }
  },
  created() {
    EventHub.logic.on(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.defaultKeySwap = false;
    });
  },
  methods: {
    update() {
      this.defaultKeySwap = true;
    },
    setType(type) {
      const glyph = Glyphs.findById(this.glyphId);
      glyph.color = undefined;
      glyph.symbol = undefined;
      glyph.cosmetic = type;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    cosmeticTypeClass(type) {
      const glyph = Glyphs.findById(this.glyphId);
      return {
        "o-primary-btn--subtab-option": true,
        "o-active-type": type === glyph.cosmetic
      };
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Modifying Single Glyph Appearance
    </template>
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="setType(undefined)"
    >
      Reset this Glyph's appearance
    </PrimaryButton>
    <GlyphCustomizationSingleType
      :key="defaultKeySwap"
      :type="glyphType"
      :glyph-id="glyphId"
    />
    <div
      v-if="cosmeticTypes"
      class="c-special-type"
    >
      Apply Special Cosmetic Type:
      <PrimaryButton
        v-for="type in cosmeticTypes"
        :key="type"
        :class="cosmeticTypeClass(type)"
        @click="setType(type)"
      >
        {{ type.capitalize() }}
      </PrimaryButton>
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.c-special-type {
  display: flex;
  flex-direction: row;
  left: 0;
  align-items: center;
}

.o-active-type {
  background-color: var(--color-good);
}
</style>
