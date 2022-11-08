<script>
import GlyphAppearanceOptionsEntry from "@/components/modals/options/GlyphAppearanceOptionsEntry";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "GlyphAppearanceOptionsGroup",
  components: {
    GlyphAppearanceOptionsEntry,
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
      // Note: This disallows customization of anything that isn't obtainable through realities
      return GlyphTypes.list.filter(t => t.isUnlocked).map(t => t.id);
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
    <b>Glyph Appearance Customization</b>
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
      Reset Appearance
    </PrimaryButton>
    <br>
    <div
      v-for="type in typeList"
      :key="type"
    >
      <GlyphAppearanceOptionsEntry :type="type" />
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
