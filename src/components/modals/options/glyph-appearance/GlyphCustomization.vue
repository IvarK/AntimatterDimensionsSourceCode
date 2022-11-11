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
      defaultKeySwap: false,
    };
  },
  computed: {
    functionalTypes() {
      return GlyphTypes.list.filter(t => t.canCustomize).map(t => t.id);
    },
    cosmeticTypes() {
      return CosmeticGlyphTypes.list.filter(t => t.isUnlocked).map(t => t.id);
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
      this.defaultKeySwap = true;
    },
    resetSettings() {
      player.reality.glyphs.cosmetics.symbolMap = {};
      player.reality.glyphs.cosmetics.colorMap = {};
      this.defaultKeySwap = false;
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
      v-for="type in functionalTypes"
      :key="type"
    >
      <GlyphCustomizationSingle
        :key="enabled + defaultKeySwap"
        :type="type"
        :is-functional="true"
      />
    </div>
    <div
      v-for="type in cosmeticTypes"
      :key="type"
    >
      <GlyphCustomizationSingle
        :key="enabled + defaultKeySwap"
        :type="type"
        :is-functional="false"
      />
    </div>
    Note: Certain color choices may cause very poor color contrast in other visual parts of the game.
  </div>
</template>

<style scoped>
.c-glyph-customization-group {
  width: 100%;
  margin-top: 0.5rem;
  text-align: left;
}
</style>
