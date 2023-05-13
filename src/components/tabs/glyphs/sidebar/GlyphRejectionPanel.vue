<script>
export default {
  name: "GlyphRejectionPanel",
  data() {
    return {
      mode: AUTO_GLYPH_REJECT.SACRIFICE,
    };
  },
  computed: {
    modes() {
      return AUTO_GLYPH_REJECT;
    },
    availableModes() {
      return Object.values(this.modes);
    }
  },
  methods: {
    optionClass(idx) {
      return [
        idx === this.mode
          ? "c-glyph-auto-pick-options__option--active"
          : "c-glyph-auto-pick-options__option--inactive",
        "c-glyph-auto-pick-options__option"
      ];
    },
    update() {
      this.mode = AutoGlyphProcessor.sacMode;
    },
    setMode(m) {
      AutoGlyphProcessor.sacMode = m;
    },
    modeDesc(id) {
      return AutoGlyphProcessor.trashModeDesc(id);
    }
  }
};
</script>

<template>
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <span class="c-glyph-sacrifice-options__advanced">
      Behavior for deleted and filtered Glyphs:
    </span>
    <br>
    <div class="l-glyph-auto-pick-options__container">
      <div
        v-for="modeID in availableModes"
        :key="modeID"
        :class="optionClass(modeID)"
        @click="setMode(modeID)"
      >
        {{ modeDesc(modeID) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-glyph-auto-pick-options__container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
