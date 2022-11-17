<script>
import GlyphCustomizationSlidingWindow
  from "@/components/modals/options/glyph-appearance/GlyphCustomizationSlidingWindow";

export default {
  name: "GlyphCustomizationSingle",
  components: {
    GlyphCustomizationSlidingWindow,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    name() {
      return this.type.capitalize();
    },
    symbols() {
      return GlyphAppearanceHandler.availableSymbols;
    },
    colors() {
      return GlyphAppearanceHandler.availableColors;
    },
  },
};
</script>

<template>
  <div class="c-glyph-customization-entry">
    <span class="c-name">Appearance Options for {{ name }} Glyphs</span>
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
  flex-direction: column;
}

.c-name {
  width: 100%;
  margin: 0.5rem 0.5rem 0;
}
</style>
