<script>
export default {
  name: "SelectedEffectToggle",
  props: {
    effect: {
      type: Object,
      required: true
    },
    glyphType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      noExclude: false,
      effarigSettings: {
        effarigrm: false,
        effarigglyph: false
      }
    };
  },
  computed: {
    color() {
      return GlyphAppearanceHandler.getBorderColor(this.glyphType);
    },
    description() {
      return this.effect.genericDesc;
    },
    classObject() {
      return this.isActive ? "c-auto-sac-type-tab__effect-desc--active" : "c-auto-sac-type-tab__effect-desc--inactive";
    },
    // This is hardcoded here since there is only one case ever, and that adding generic dynamic support to multiple
    // pairs/groups of effects is both out of design scope and an unacceptable performance hit to amplified realities
    exclusionTooltip() {
      if (this.noExclude) return "";

      const effarigSettings = this.effarigSettings;
      if (effarigSettings.RM && effarigSettings.glyph &&
        (this.effect.id === "effarigrm" || this.effect.id === "effarigglyph")) {
        return "RM multiplier and Glyph instability cannot occur together on the same Glyph!";
      }
      if (this.effect.id === "effarigrm" && effarigSettings.glyph) {
        return "This effect is mutually exclusive with Glyph instability!";
      }
      if (this.effect.id === "effarigglyph" && effarigSettings.RM) {
        return "This effect is mutually exclusive with RM multiplier!";
      }
      return "";
    },
    isExcluded() {
      return this.exclusionTooltip !== "";
    },
    effarigBits() {
      const effectDB = GameDatabase.reality.glyphEffects;
      return {
        RM: effectDB.effarigrm.bitmaskIndex,
        glyph: effectDB.effarigglyph.bitmaskIndex,
      };
    }
  },
  methods: {
    update() {
      this.isActive = (AutoGlyphProcessor.types[this.glyphType].specifiedMask & (1 << this.effect.bitmaskIndex)) !== 0;
      const effarigMask = AutoGlyphProcessor.types.effarig.specifiedMask;
      this.effarigSettings = {
        RM: (effarigMask & (1 << this.effarigBits.RM)) !== 0,
        glyph: (effarigMask & (1 << this.effarigBits.glyph)) !== 0
      };
      this.noExclude = Ra.unlocks.glyphEffectCount.canBeApplied;
    },
    toggleSelection() {
      AutoGlyphProcessor.types[this.glyphType].specifiedMask ^= 1 << this.effect.bitmaskIndex;
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectCount = Math.clamp(inputValue, 0, 8);
      }
    },
  }
};
</script>

<template>
  <div
    v-tooltip="exclusionTooltip"
    :class="classObject"
    @click="toggleSelection()"
  >
    <span>
      <i
        v-if="isExcluded"
        class="fas fa-exclamation l-dock l-dock-left"
      />
      {{ description }}
      <i
        v-if="isExcluded"
        class="fas fa-exclamation l-dock l-dock-right"
      />
    </span>
    <i
      v-if="isActive"
      class="fas fa-check c-selected-effect-toggle-indicator--active"
      :style="{ 'background-color': color }"
    />
  </div>
</template>

<style scoped>
.c-selected-effect-toggle-indicator--active {
  position: absolute;

  /* -0.1rem = -1px, needed because CSS renders a black border between the check and the border of the selector
  otherwise */
  top: -0.1rem;
  right: -0.1rem;
  font-size: 1rem;
  color: black;
  text-shadow: none;
  border-radius: 0 var(--var-border-radius, 0.4rem);
  padding: 0.2rem;
}

.l-dock {
  position: absolute;
  top: 50%;
  margin: 0 4rem;
  transform: translateY(-50%);
}

.l-dock-left {
  left: 0;
}

.l-dock-right {
  right: 0;
}
</style>
