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
      const haveEffarig = Glyphs.activeList.find(e => e.type === "effarig") !== undefined;
      const haveBoost = Glyphs.activeList.find(e => e.level < Enslaved.glyphLevelMin) !== undefined;
      if (haveBoost) {
        if (haveEffarig) {
          this.enslavedHint = "done... what little... I can... but...<br>" +
            "why did you bring... that useless thing... here...";
        } else {
          this.enslavedHint = "done... what little... I can...";
        }
      } else if (haveEffarig) {
        this.enslavedHint = "Why did you bring... that useless thing... here...";
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
