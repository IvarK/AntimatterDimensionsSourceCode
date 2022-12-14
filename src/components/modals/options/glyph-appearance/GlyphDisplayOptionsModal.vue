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
      glyphEffectDots: false,
      lightGlyphs: false,
      glyphInfoType: 0,
      showGlyphInfoByDefault: false,
    };
  },
  computed: {
    infoLabel() {
      return GlyphInfo.labels[this.glyphInfoType];
    },
  },
  watch: {
    newGlyphs(newValue) {
      player.options.showNewGlyphIcon = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphEffectDots(newValue) {
      player.options.showHintText.glyphEffectDots = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    lightGlyphs(newValue) {
      player.options.lightGlyphs = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    showGlyphInfoByDefault(newValue) {
      player.options.showHintText.showGlyphInfoByDefault = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.newGlyphs = options.showNewGlyphIcon;
      this.glyphEffectDots = options.showHintText.glyphEffectDots;
      this.lightGlyphs = options.lightGlyphs;
      this.glyphInfoType = options.showHintText.glyphInfoType;
      this.showGlyphInfoByDefault = options.showHintText.showGlyphInfoByDefault;
    },
    noEffectStyle() {
      if (this.glyphInfoType !== 0) return null;
      return {
        "background-color": "var(--color-disabled)",
      };
    },
  },
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Glyph Display Options
    </template>
    <div class="c-modal-options__button-container">
      <ModalOptionsToggleButton
        v-model="newGlyphs"
        text="New Glyph identifier:"
      />
      <ModalOptionsToggleButton
        v-model="glyphEffectDots"
        text="Always show Glyph effect dots:"
      />
      <ModalOptionsToggleButton
        v-model="lightGlyphs"
        text="Light Glyph backgrounds:"
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
      <ModalOptionsToggleButton
        v-model="showGlyphInfoByDefault"
        :style="noEffectStyle()"
        text="Always show Glyph Info:"
      />
    </div>
    <GlyphCustomization />
  </ModalWrapperOptions>
</template>

<style scoped>
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
