"use strict";

Vue.component("glyphs-tab", {
  data: () => ({
    enslavedHint: "",
    showInstability: false,
    instabilityThreshold: 0,
    hyperInstabilityThreshold: 0,
    isInCelestialReality: false,
    autoRestartCelestialRuns: false,
    hasAlchemy: false,
    sacrificeUnlocked: false,
    sacrificeDisplayed: false,
    resetRealityDisplayed: false,
  }),
  computed: {
    showEnslavedHint() {
      return this.enslavedHint !== "";
    }
  },
  methods: {
    update() {
      this.resetRealityDisplayed = player.realities > 0;
      this.showInstability = player.bestGlyphLevel > 800;
      this.instabilityThreshold = Glyphs.instabilityThreshold;
      this.hyperInstabilityThreshold = Glyphs.hyperInstabilityThreshold;
      this.isInCelestialReality = Object.entries(player.celestials).map(x => x[1].run).includes(true);
      this.autoRestartCelestialRuns = player.options.retryCelestial;
      this.enslavedHint = "";
      this.hasAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      this.sacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.sacrificeDisplayed = player.reality.showGlyphSacrifice;
      if (!Enslaved.isRunning) return;
      const haveBoost = Glyphs.activeList.find(e => e.level < Enslaved.glyphLevelMin) !== undefined;
      if (haveBoost) {
        this.enslavedHint = "done... what little... I can... with glyphs...";
      }
    },
    toggleAutoRestartCelestial() {
      player.options.retryCelestial = !player.options.retryCelestial;
    },
    glyphInfoClass(isSacrificeOption) {
      if (this.sacrificeDisplayed === isSacrificeOption) return "c-glyph-info-button--active";
      return "";
    },
    setInfoState(state) {
      player.reality.showGlyphSacrifice = state;
    }
  },
  template:
  `<div>
    <glyph-header />
    <div class="l-glyphs-tab">
      <div class="l-reality-button-column">
        <glyph-peek />
        <br/>
        <reality-button />
        <reset-reality-button v-if = "resetRealityDisplayed" />
        <div v-if="isInCelestialReality">
          <input type="checkbox"
            id="autoRestart"
            v-model="autoRestartCelestialRuns"
            :value="autoRestartCelestialRuns"
            @input="toggleAutoRestartCelestial()">
          <label for="autoRestart">Repeat this Celestial's Reality</label>
        </div>
        <reality-amplify-button />
        <div v-if="showInstability">
          Glyphs are becoming unstable.
          <br>
          Glyph levels higher than {{formatInt(instabilityThreshold)}} are harder to reach.
          <br>
          This effect is even stronger above level {{formatInt(hyperInstabilityThreshold)}}.
        </div>
        <expanding-control-box
            label="Glyph level factors"
            container-class="c-glyph-level-factors-dropdown-header">
          <glyph-levels-and-weights slot="dropdown" />
        </expanding-control-box>
        <br>
        <glyph-clean-options />
        <glyph-sacrifice-options />
        <glyph-auto-pick-options v-if="hasAlchemy" />
      </div>
      <div class="l-player-glyphs-column">
        <div v-if="showEnslavedHint" class="o-teresa-quotes" v-html="enslavedHint" />
        <div class="l-equipped-glyphs-wrapper">
          <equipped-glyphs />
          <div class="l-glyph-info-wrapper">
            <div class="c-glyph-info-options"
              v-if="sacrificeUnlocked">
                <div class="c-glyph-info-button"
                  :class="glyphInfoClass(false)"
                  @click="setInfoState(false)"
                  style="border-right: 0.1rem solid #b8b8b8;">
                    Current glyph effects
                </div>
                <div class="c-glyph-info-button"
                  :class="glyphInfoClass(true)"
                  @click="setInfoState(true)">
                    Glyph Sacrifice totals
                </div>
            </div>
            <sacrificed-glyphs v-if="sacrificeUnlocked && sacrificeDisplayed" />
            <current-glyph-effects v-else />
          </div>
        </div>
        <glyph-inventory />
      </div>
    </div>
  </div>`
});
