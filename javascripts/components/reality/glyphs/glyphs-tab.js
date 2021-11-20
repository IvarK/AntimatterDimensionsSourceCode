import "./sidebar/glyph-tab-sidebar.js";
import "./glyph-peek.js";
import "./reality-amplify-button.js";
import "./glyph-inventory.js";
import "./sacrificed-glyphs.js";
import "./current-glyph-effects.js";
import "./equipped-glyphs.js";
import "./glyph-levels-and-weights.js";
import "./reset-reality-button.js";
import "./reality-button.js";
import "../reality-reminder.js";
import ExpandingControlBox from "@/components/ExpandingControlBox";

Vue.component("glyphs-tab", {
  components: {
    ExpandingControlBox
  },
  data: () => ({
    enslavedHint: "",
    showInstability: false,
    instabilityThreshold: 0,
    hyperInstabilityThreshold: 0,
    isInCelestialReality: false,
    glyphTextColors: true,
    autoRestartCelestialRuns: false,
    sacrificeUnlocked: false,
    sacrificeDisplayed: false,
    resetRealityDisplayed: false,
  }),
  computed: {
    showEnslavedHint() {
      return this.enslavedHint !== "";
    },
    glyphColorState() {
      return {
        "o-glyph-color-checkbox": true,
        "o-glyph-color-checkbox--active": this.glyphTextColors,
        "o-glyph-color-checkbox--inactive": !this.glyphTextColors,
      };
    },
  },
  methods: {
    update() {
      this.resetRealityDisplayed = PlayerProgress.realityUnlocked();
      this.showInstability = player.records.bestReality.glyphLevel > 800;
      this.instabilityThreshold = Glyphs.instabilityThreshold;
      this.hyperInstabilityThreshold = Glyphs.hyperInstabilityThreshold;
      this.isInCelestialReality = isInCelestialReality();
      this.autoRestartCelestialRuns = player.options.retryCelestial;
      this.glyphTextColors = player.options.glyphTextColors;
      this.enslavedHint = "";
      this.sacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.sacrificeDisplayed = player.reality.showGlyphSacrifice;
      if (!Enslaved.isRunning) return;
      const haveBoost = Glyphs.activeList.find(e => e.level < Enslaved.glyphLevelMin) !== undefined;
      if (haveBoost) {
        this.enslavedHint = "done... what little... I can... with Glyphs...";
      }
    },
    toggleAutoRestartCelestial() {
      player.options.retryCelestial = !player.options.retryCelestial;
    },
    toggleGlyphTextColors() {
      player.options.glyphTextColors = !player.options.glyphTextColors;
    },
    glyphInfoClass(isSacrificeOption) {
      if (this.sacrificeDisplayed === isSacrificeOption) return "c-glyph-info-button--active";
      return "";
    },
    setInfoState(state) {
      player.reality.showGlyphSacrifice = state;
    },
    glyphColorPosition() {
      return this.sacrificeUnlocked ? "l-glyph-color-position__low" : "l-glyph-color-position__top";
    }
  },
  template: `
    <div>
      <div class="l-glyphs-tab">
        <div class="l-reality-button-column">
          <glyph-peek />

          <div class="l-reality-button-group">
            <div class="l-reality-button-group-half">
              <reset-reality-button v-if="resetRealityDisplayed" />

              <div v-if="isInCelestialReality">
                <input
                  type="checkbox"
                  id="autoRestart"
                  v-model="autoRestartCelestialRuns"
                  :value="autoRestartCelestialRuns"
                  @input="toggleAutoRestartCelestial()"
                >
                <label for="autoRestart">Repeat this Celestial's Reality</label>
              </div>
              <reality-amplify-button v-else />

            </div>
            <reality-button />
          </div>

          <reality-reminder />

          <div v-if="showInstability">
            <br>
            Glyphs are becoming unstable.
            <br>
            Glyph levels higher than {{ formatInt(instabilityThreshold) }} are harder to reach.
            <br>
            This effect is even stronger above level {{ formatInt(hyperInstabilityThreshold) }}.
          </div>
          <ExpandingControlBox
            label="Glyph Level Factors"
            container-class="c-glyph-level-factors-dropdown-header"
            style="margin: 2rem;"
          >
            <glyph-levels-and-weights slot="dropdown" />
          </ExpandingControlBox>
          <glyph-tab-sidebar />
        </div>
        <div class="l-player-glyphs-column">
          <div v-if="showEnslavedHint" class="o-teresa-quotes" v-html="enslavedHint" />
          <div class="l-equipped-glyphs-and-effects-container">
            <equipped-glyphs />
            <div class="l-glyph-info-wrapper">
              <span class="l-glyph-color-box" @click="toggleGlyphTextColors">
                <div :class="glyphColorPosition()">
                  <label
                    :class="glyphColorState"
                  >
                    <span class="fas fa-palette"></span>
                  </label>
                </div>
              </span>
              <div
                class="c-glyph-info-options"
                v-if="sacrificeUnlocked"
              >
                <div
                  class="c-glyph-info-button"
                  :class="glyphInfoClass(false)"
                  @click="setInfoState(false)"
                  style="border-right: 0.1rem solid #b8b8b8;"
                >
                  Current Glyph effects
                </div>
                <div
                  class="c-glyph-info-button"
                  :class="glyphInfoClass(true)"
                  @click="setInfoState(true)"
                >
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
