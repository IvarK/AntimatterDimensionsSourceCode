"use strict";

Vue.component("glyphs-tab", {
  computed: {
    // Until we vue-ify the rest of reality, this is a local workaround:
    showTab() {
      return this.$viewModel.tabs.current === "reality-tab" &&
        this.$viewModel.tabs.reality.subtab === "glyphstab";
    }
  },
  template:
  `<div v-if="showTab"
        class="l-glyphs-tab">
    <div class="l-reality-button-column">
      <reality-button />
      <reality-amplify-button />
      <expanding-control-box
          label="Glyph level factors"
          container-class="c-glyph-level-factors-dropdown-header">
        <glyph-levels-and-weights slot="dropdown" />
      </expanding-control-box>
      <glyph-sacrifice-options />
      <glyph-auto-pick-options />
      <sacrificed-glyphs />
    </div>
    <div class="l-player-glyphs-column">
      <div class="l-equipped-glyphs-wrapper">
        <equipped-glyphs />
        <current-glyph-effects />
      </div>
      <glyph-inventory />
    </div>
  </div>`
});