<script>
import CurrentGlyphEffects from "./CurrentGlyphEffects";
import EquippedGlyphs from "./EquippedGlyphs";
import ExpandingControlBox from "@/components/ExpandingControlBox";
import GlyphInventory from "./GlyphInventory";
import GlyphLevelsAndWeights from "./GlyphLevelsAndWeights";
import GlyphPeek from "./GlyphPeek";
import GlyphTabSidebar from "./sidebar/GlyphTabSidebar";
import RealityAmplifyButton from "./RealityAmplifyButton";
import RealityReminder from "./RealityReminder";
import ResetRealityButton from "./ResetRealityButton";
import SacrificedGlyphs from "./SacrificedGlyphs";
import SingleGlyphCustomzationPanel from "./SingleGlyphCustomzationPanel";

export default {
  name: "GlyphsTab",
  components: {
    ExpandingControlBox,
    GlyphTabSidebar,
    GlyphPeek,
    RealityAmplifyButton,
    GlyphInventory,
    SacrificedGlyphs,
    CurrentGlyphEffects,
    EquippedGlyphs,
    GlyphLevelsAndWeights,
    ResetRealityButton,
    RealityReminder,
    SingleGlyphCustomzationPanel
  },
  data() {
    return {
      enslavedHint: "",
      showInstability: false,
      instabilityThreshold: 0,
      hyperInstabilityThreshold: 0,
      isInCelestialReality: false,
      canAmplify: false,
      glyphTextColors: true,
      autoRestartCelestialRuns: false,
      sacrificeUnlocked: false,
      sacrificeDisplayed: false,
      resetRealityDisplayed: false,
    };
  },
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
      this.canAmplify = Enslaved.isUnlocked && !this.isInCelestialReality;
      this.autoRestartCelestialRuns = player.options.retryCelestial;
      this.glyphTextColors = player.options.glyphTextColors;
      this.enslavedHint = "";
      this.sacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.sacrificeDisplayed = player.reality.showGlyphSacrifice;
      if (!Enslaved.isRunning) return;
      const haveBoost = Glyphs.activeWithoutCompanion.find(e => e.level < Enslaved.glyphLevelMin) !== undefined;
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
      return {
        "l-glyph-info-button": true,
        "c-glyph-info-button": true,
        "c-glyph-info-button--active": isSacrificeOption,
        "c-glyph-info-button--inactive": !isSacrificeOption
      };
    },
    setInfoState(state) {
      player.reality.showGlyphSacrifice = state;
    },
    glyphColorPosition() {
      return this.sacrificeUnlocked ? "l-glyph-color-position__low" : "l-glyph-color-position__top";
    },
    glyphInfoBorderClass() {
      return {
        "c-current-glyph-effects-with-top-border": !this.sacrificeUnlocked
      };
    },
    buttonGroupClass() {
      return {
        "l-half-width": this.canAmplify
      };
    }
  }
};
</script>

<template>
  <div>
    <div class="l-glyphs-tab">
      <div class="l-reality-button-column">
        <GlyphPeek />

        <div
          v-if="resetRealityDisplayed"
          class="l-reality-button-group"
        >
          <RealityAmplifyButton
            v-if="!isInCelestialReality"
            :class="buttonGroupClass()"
          />
          <ResetRealityButton :class="buttonGroupClass()" />
        </div>

        <div
          v-if="isInCelestialReality"
          class="l-celestial-auto-restart-checkbox"
        >
          <input
            id="autoRestart"
            v-model="autoRestartCelestialRuns"
            type="checkbox"
            :value="autoRestartCelestialRuns"
            class="o-clickable"
            @input="toggleAutoRestartCelestial()"
          >
          <label
            for="autoRestart"
            class="o-clickable"
          >
            Repeat this Celestial's Reality
          </label>
        </div>

        <br>

        <RealityReminder />

        <div v-if="showInstability">
          <br>
          Glyphs are becoming unstable.
          <br>
          Glyph levels higher than {{ formatInt(instabilityThreshold) }} are harder to reach.
          <br>
          This effect is even stronger above level {{ formatInt(hyperInstabilityThreshold) }}.
        </div>
        <SingleGlyphCustomzationPanel />
        <ExpandingControlBox
          width-source="content"
          label="Glyph Level Factors"
          container-class="c-glyph-level-factors-dropdown-header"
          class="l-glyph-level-factors"
        >
          <template #dropdown>
            <GlyphLevelsAndWeights />
          </template>
        </ExpandingControlBox>
        <GlyphTabSidebar />
      </div>
      <div class="l-player-glyphs-column">
        <div
          v-if="showEnslavedHint"
          class="o-teresa-quotes"
          v-html="enslavedHint"
        />
        <div class="l-equipped-glyphs-and-effects-container">
          <EquippedGlyphs />
          <div class="l-glyph-info-wrapper">
            <span
              class="l-glyph-color-box"
              @click="toggleGlyphTextColors"
            >
              <div :class="glyphColorPosition()">
                <label
                  :class="glyphColorState"
                >
                  <span class="fas fa-palette" />
                </label>
              </div>
            </span>
            <div
              v-if="sacrificeUnlocked"
              class="c-glyph-info-options"
            >
              <button
                :class="glyphInfoClass(!sacrificeDisplayed)"
                @click="setInfoState(false)"
              >
                Current Glyph effects
              </button>
              <button
                :class="glyphInfoClass(sacrificeDisplayed)"
                @click="setInfoState(true)"
              >
                Glyph Sacrifice totals
              </button>
            </div>
            <SacrificedGlyphs v-if="sacrificeUnlocked && sacrificeDisplayed" />
            <CurrentGlyphEffects
              v-else
              :class="glyphInfoBorderClass()"
            />
          </div>
        </div>
        <GlyphInventory />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-glyph-level-factors {
  margin: 2rem;
}

.o-clickable {
  cursor: pointer;
}

.l-celestial-auto-restart-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
}

.l-half-width {
  width: 50%;
}
</style>
