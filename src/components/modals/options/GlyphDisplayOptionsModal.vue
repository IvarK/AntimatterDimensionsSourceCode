<script>
import ButtonCycle from "@/components/ButtonCycle";
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export const GlyphInfoType = {
  NONE: 0,
  LEVEL: 1,
  RARITY: 2,
  SAC_VALUE: 3,
  FILTER_SCORE: 4,
  CURRENT_REFINE: 5,
  MAX_REFINE: 6,
};

export default {
  name: "GlyphDisplayOptionsModal",
  components: {
    ButtonCycle,
    ModalOptionsToggleButton,
    ModalWrapperOptions,
  },
  data() {
    return {
      newGlyphs: false,
      glyphEffectDots: false,
      forceDarkGlyphs: false,
      glyphInfoType: 0,
      showGlyphInfoByDefault: false,
    };
  },
  computed: {
    availableInfo() {
      const options = ["None", "Level", "Rarity"];
      if (GlyphSacrificeHandler.canSacrifice) options.push("Sacrifice Value");
      if (EffarigUnlock.glyphFilter.isUnlocked) options.push("Glyph Filter Score");
      if (Ra.unlocks.unlockGlyphAlchemy.canBeApplied) {
        options.push("Current Refinement Value");
        options.push("Maximum Refinement Value");
      }
      return options;
    }
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
    forceDarkGlyphs(newValue) {
      player.options.forceDarkGlyphs = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphInfoType(newValue) {
      player.options.showHintText.glyphInfoType = newValue;
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
      this.forceDarkGlyphs = options.forceDarkGlyphs;
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
        v-model="forceDarkGlyphs"
        text="Force dark Glyph background:"
      />
      <ButtonCycle
        v-model="glyphInfoType"
        text="Additional Glyph Info:"
        class="o-primary-btn o-primary-btn--option-wide"
        :labels="availableInfo"
      />
      <ModalOptionsToggleButton
        v-model="showGlyphInfoByDefault"
        :style="noEffectStyle()"
        text="Always show Glyph Info:"
      />
    </div>
  </ModalWrapperOptions>
</template>
