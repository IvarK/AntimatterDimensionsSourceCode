<script>
import GlyphComponent from "@/components/GlyphComponent";
import GlyphCustomizationSlidingWindow
  from "@/components/modals/options/glyph-appearance/GlyphCustomizationSlidingWindow";

export default {
  name: "GlyphCustomizationSingle",
  components: {
    GlyphCustomizationSlidingWindow,
    GlyphComponent
  },
  props: {
    type: {
      type: String,
      required: true,
    }
  },
  computed: {
    name() {
      return this.type.capitalize();
    },
    glyphIconProps() {
      return {
        size: "2.5rem",
        "glow-blur": "0.3rem",
        "glow-spread": "0.1rem",
        "text-proportion": 0.7
      };
    },
    fakeGlyph() {
      return {
        type: this.type,
        strength: player.records.bestReality.glyphStrength,
      };
    },
    symbols() {
      return GlyphCosmeticHandler.availableSymbols;
    },
    colors() {
      return GlyphCosmeticHandler.availableColors;
    },
  },
};
</script>

<template>
  <div class="c-glyph-customization-entry">
    <GlyphComponent
      v-bind="glyphIconProps"
      :glyph="fakeGlyph"
    />
    <span class="c-name">{{ name }}</span>
    <GlyphCustomizationSlidingWindow
      :type="type"
      :is-symbol="true"
      :options="symbols"
    />
    <GlyphCustomizationSlidingWindow
      :type="type"
      :is-symbol="false"
      :options="colors"
    />
  </div>
</template>

<style scoped>
.c-glyph-customization-entry {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.5rem;
}

.c-name {
  width: 24%;
  margin-left: 1rem;
}
</style>
