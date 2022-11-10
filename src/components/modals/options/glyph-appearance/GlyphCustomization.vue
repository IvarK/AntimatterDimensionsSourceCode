<script>
import GlyphCustomizationSingle from "@/components/modals/options/glyph-appearance/GlyphCustomizationSingle";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "GlyphCustomization",
  components: {
    GlyphCustomizationSingle,
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      enabled: false,
    };
  },
  computed: {
    typeList() {
      return GlyphTypes.list.filter(t => t.canCustomize).map(t => t.id);
    }
  },
  watch: {
    enabled(newValue) {
      player.reality.glyphs.cosmetics.active = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
  methods: {
    update() {
      this.enabled = player.reality.glyphs.cosmetics.active;
    },
    resetSettings() {
      player.reality.glyphs.cosmetics.symbolMap = {};
      player.reality.glyphs.cosmetics.colorMap = {};
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    }
  }
};
</script>

<template>
  <div class="c-glyph-customization-group">
    <b>Custom Glyph Appearance</b>
    <PrimaryToggleButton
      v-model="enabled"
      class="o-primary-btn--subtab-option"
      on="Enabled"
      off="Disabled"
    />
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="resetSettings"
    >
      Reset to Default
    </PrimaryButton>
    <br>
    <div
      v-for="type in typeList"
      :key="type"
    >
      <GlyphCustomizationSingle
        :key="enabled"
        :type="type"
      />
    </div>
  </div>
</template>

<style scoped>
.c-glyph-customization-group {
  width: 100%;
  margin-top: 0.5rem;
  text-align: left;
}
</style>
