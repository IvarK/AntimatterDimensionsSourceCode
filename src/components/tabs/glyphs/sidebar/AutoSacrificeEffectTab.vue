<script>
import SelectedEffectToggle from "./SelectedEffectToggle";

export default {
  name: "AutoSacrificeEffectTab",
  components: {
    SelectedEffectToggle
  },
  props: {
    glyphType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      effectCount: 0,
      effectChoices: {},
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphProcessor.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "color": this.typeConfig.color,
        "border-color": this.typeConfig.color
      };
    },
    questionmarkTooltip() {
      return `Glyph score is rarity, minus ${formatInt(200)} for every missing effect.
        Glyphs with less than the specified rarity are sacrificed.`;
    }
  },
  created() {
    this.effectChoices = Object.assign({}, AutoGlyphProcessor.types[this.glyphType].effectChoices);
  },
  methods: {
    update() {
      this.effectCount = this.autoSacrificeSettings.effectCount;
      for (const e of this.effects) {
        this.effectChoices[e.id] = this.autoSacrificeSettings.effectChoices[e.id];
      }
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectCount = Math.clamp(inputValue, 0, 8);
      }
    }
  }
};
</script>

<template>
  <div class="c-glyph-sacrifice-options__advanced">
    <div>
      Selected Glyphs will have at least
      <input
        ref="effectCount"
        type="number"
        min="0"
        max="8"
        class="c-auto-sac-effect-tab__input"
        :value="effectCount"
        @blur="setEffectCount"
      >
      effects total, which must include <i>all</i> of the following effects:
      (click to toggle effects on/off)
      <span
        class="o-questionmark"
        :ach-tooltip="questionmarkTooltip"
      >
        ?
      </span>
    </div>
    <div
      v-for="effect in effects"
      :key="effect.id"
      class="l-auto-sac-type-tab__row-wrapper"
    >
      <SelectedEffectToggle
        class="c-auto-sac-type-tab__effect-desc l-specified-effect-tab__effect-desc"
        :effect="effect"
        :glyph-type="glyphType"
        :style="descStyle"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
