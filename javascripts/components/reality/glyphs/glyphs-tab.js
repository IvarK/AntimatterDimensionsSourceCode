"use strict";

Vue.component("glyphs-tab", {
  data: () => ({
    enslavedHint: "",
  }),
  computed: {
    showEnslavedHint() {
      return this.enslavedHint !== "";
    }
  },
  methods: {
    update() {
      this.enslavedHint = "";
      if (!Enslaved.isRunning) return;
      const haveBoost = Glyphs.activeList.find(e => e.level < Enslaved.glyphLevelMin) !== undefined;
      if (haveBoost) {
        this.enslavedHint = "done... what little... I can...";
      }
    }
  },
  template:
  `<div class="l-glyphs-tab">
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
      <div v-if="showEnslavedHint" class="o-teresa-quotes" v-html="enslavedHint" />
      <div class="l-equipped-glyphs-wrapper">
        <equipped-glyphs />
        <current-glyph-effects />
      </div>
      <glyph-inventory />
    </div>
  </div>`
});
