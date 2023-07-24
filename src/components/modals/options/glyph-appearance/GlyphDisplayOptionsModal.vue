<script>
import SelectGlyphInfoDropdown, { GlyphInfo } from ".././SelectGlyphInfoDropdown";

import ExpandingControlBox from "@/components/ExpandingControlBox";
import GlyphCustomization from "@/components/modals/options/glyph-appearance/GlyphCustomization";
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "GlyphDisplayOptionsModal",
  components: {
    ExpandingControlBox,
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    SelectGlyphInfoDropdown,
    GlyphCustomization,
  },
  data() {
    return {
      newGlyphs: false,
      showUnequippedGlyphIcon: false,
      glyphEffectDots: false,
      glyphBG: 0,
      glyphInfoType: 0,
      showGlyphInfoByDefault: false,
      glyphBorders: false,
      highContrastRarity: false,
      swapGlyphColors: false,
    };
  },
  computed: {
    infoLabel() {
      return GlyphInfo.labels[this.glyphInfoType];
    },
    glyphBGStr() {
      switch (this.glyphBG) {
        case GLYPH_BG_SETTING.AUTO:
          return "Auto";
        case GLYPH_BG_SETTING.LIGHT:
          return "Light";
        case GLYPH_BG_SETTING.DARK:
          return "Dark";
        default:
          throw new Error("Unrecognized Glyph BG setting");
      }
    }
  },
  watch: {
    newGlyphs(newValue) {
      player.options.showNewGlyphIcon = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    showUnequippedGlyphIcon(newValue) {
      player.options.showUnequippedGlyphIcon = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphEffectDots(newValue) {
      player.options.showHintText.glyphEffectDots = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    showGlyphInfoByDefault(newValue) {
      player.options.showHintText.showGlyphInfoByDefault = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphBorders(newValue) {
      player.options.glyphBorders = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    highContrastRarity(newValue) {
      player.options.highContrastRarity = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    swapGlyphColors(newValue) {
      player.options.swapGlyphColors = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.newGlyphs = options.showNewGlyphIcon;
      this.showUnequippedGlyphIcon = options.showUnequippedGlyphIcon;
      this.glyphEffectDots = options.showHintText.glyphEffectDots;
      this.glyphBG = player.options.glyphBG;
      this.glyphInfoType = options.showHintText.glyphInfoType;
      this.showGlyphInfoByDefault = options.showHintText.showGlyphInfoByDefault;
      this.glyphBorders = options.glyphBorders;
      this.highContrastRarity = options.highContrastRarity;
      this.swapGlyphColors = options.swapGlyphColors;
    },
    noEffectStyle() {
      if (this.glyphInfoType !== 0) return null;
      return {
        "background-color": "var(--color-disabled)",
      };
    },
    cycleBG() {
      player.options.glyphBG = (player.options.glyphBG + 1) % Object.keys(GLYPH_BG_SETTING).length;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__glyph">
    <template #header>
      Glyph Display Options
    </template>
    <div class="c-glyph-visual-options c-modal--short">
      <div class="c-modal-options__button-container">
        <ModalOptionsToggleButton
          v-model="newGlyphs"
          text="New Glyph identifier:"
        />
        <ModalOptionsToggleButton
          v-model="showUnequippedGlyphIcon"
          text="Unequipped Glyph identifier:"
        />
        <ModalOptionsToggleButton
          v-model="glyphEffectDots"
          text="Always show Glyph effect dots:"
        />
        <ModalOptionsToggleButton
          v-model="glyphBorders"
          text="Fancy Glyph borders:"
        />
        <button
          class="o-primary-btn o-primary-btn--modal-option"
          @click="cycleBG()"
        >
          Glyph BG color: {{ glyphBGStr }}
        </button>
        <ModalOptionsToggleButton
          v-model="showGlyphInfoByDefault"
          :style="noEffectStyle()"
          text="Always show Glyph Info:"
        />
        <ModalOptionsToggleButton
          v-model="highContrastRarity"
          text="High-contrast rarity colors:"
        />
        <ModalOptionsToggleButton
          v-model="swapGlyphColors"
          text="Swap border and symbol colors:"
        />
        <ExpandingControlBox
          class="o-primary-btn c-dropdown-btn"
        >
          <template #header>
            <div class="c-dropdown-header">
              ▼ Additional Glyph Info: ▼
              <br>
              {{ infoLabel }}
            </div>
          </template>
          <template #dropdown>
            <SelectGlyphInfoDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <GlyphCustomization />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.c-modal-options__glyph {
  width: 55rem;
}

.c-glyph-visual-options {
  width: 55rem;
  overflow-x: hidden;
  padding-right: 1rem;
}

.c-dropdown-btn {
  width: 24rem;
  margin: 0.3rem;
  padding: 0;
}

.c-dropdown-header {
  padding: 0.9rem;
  height: 6.5rem;
  user-select: none;
}
</style>
