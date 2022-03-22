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
  },
  methods: {
    optionClass(idx) {
      return [
        idx === this.mode
          ? "c-glyph-auto-pick-options__option--active"
          : "c-glyph-auto-pick-options__option--inactive",
        "c-glyph-auto-pick-options__option",
        "l-glyph-auto-pick-options__option"
      ];
    },
    optionVIf(idx) {
      return idx === this.mode;
    },
    optionVIfStyle() {
      return "fas fa-check";
    },
    update() {
      this.mode = AutoGlyphProcessor.sacMode;
    },
    setMode(m) {
      AutoGlyphProcessor.sacMode = m;
    },
  }
};
</script>

<template>
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <span class="c-glyph-sacrifice-options__advanced">
      Behavior for deleted and filtered
      <br>
      Glyphs in non-Alchemy modes:
    </span>
    <br>
    <div
      :class="optionClass(modes.SACRIFICE)"
      @click="setMode(modes.SACRIFICE)"
    >
      Always sacrifice
      <i
        v-if="optionVIf(modes.SACRIFICE)"
        :class="optionVIfStyle()"
      />
    </div>
    <div
      :class="optionClass(modes.REFINE)"
      @click="setMode(modes.REFINE)"
    >
      Always refine
      <i
        v-if="optionVIf(modes.REFINE)"
        :class="optionVIfStyle()"
      />
    </div>
    <div
      :class="optionClass(modes.REFINE_TO_CAP)"
      @click="setMode(modes.REFINE_TO_CAP)"
    >
      Refine to cap, then sacrifice
      <i
        v-if="optionVIf(modes.REFINE_TO_CAP)"
        :class="optionVIfStyle()"
      />
    </div>
  </div>
</template>

<style scoped>
  .fa-check {
    background-color: var(--color-reality-light);
    color: black;
    font-size: 1rem;
    position: absolute;
    top: -1px;
    right: -1px;
    border-radius: 0 0.3rem;
    padding: 0.1rem;
  }
</style>
