<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "GlyphDisplayOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
  },
  data() {
    return {
      newGlyphs: false,
      glyphEffectDots: false,
      forceDarkGlyphs: false
    };
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
  },
  methods: {
    update() {
      const options = player.options;
      this.newGlyphs = options.showNewGlyphIcon;
      this.glyphEffectDots = options.showHintText.glyphEffectDots;
      this.forceDarkGlyphs = options.forceDarkGlyphs;
    }
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
    </div>
  </ModalWrapperOptions>
</template>
