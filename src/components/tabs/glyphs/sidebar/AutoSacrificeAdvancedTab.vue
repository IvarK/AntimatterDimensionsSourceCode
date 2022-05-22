<script>
export default {
  name: "AutoSacrificeAdvancedTab",
  props: {
    glyphType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scoreThreshold: 0,
      effectScores: {},
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
    minScoreInputStyle() {
      // Override some properties of the number input to match row style:
      return {
        "font-size": "larger",
        "border-width": "var(--var-border-width, 0.2rem)",
      };
    },
    questionmarkTooltip() {
      return "The score of a glyph is its rarity % plus the specified amount for each effect it has";
    }
  },
  created() {
    this.effectScores = Object.assign({}, AutoGlyphProcessor.types[this.glyphType].effectScores);
  },
  methods: {
    update() {
      this.scoreThreshold = this.autoSacrificeSettings.scoreThreshold;
      for (const e of this.effects) {
        this.effectScores[e.id] = this.autoSacrificeSettings.effectScores[e.id];
      }
    },
    setScoreThreshold(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.scoreThreshold = Math.min(999, Math.max(inputValue, 0));
      }
    },
    setEffectScore(id, event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectScores[id] = Math.min(999, Math.max(inputValue, 0));
      }
    },
  }
};
</script>

<template>
  <div class="l-auto-sac-type-tab">
    <div class="l-auto-sac-type-tab__row-wrapper">
      <div>
        <b>Threshold score</b> (rarity % + effects)
        <div
          :ach-tooltip="questionmarkTooltip"
          class="o-questionmark"
        >
          ?
        </div>
      </div>
      <input
        ref="scoreThreshold"
        type="number"
        min="0"
        max="999"
        class="c-auto-sac-type-tab__input"
        :value="scoreThreshold"
        :style="minScoreInputStyle"
        @blur="setScoreThreshold"
      >
    </div>
    <div
      v-for="effect in effects"
      :key="effect.id"
      class="l-auto-sac-type-tab__row-wrapper"
    >
      <div
        class="c-auto-sac-type-tab__effect-desc l-auto-sac-type-tab__effect-desc"
        :style="descStyle"
      >
        {{ effect.genericDesc }}
      </div>
      <input
        type="number"
        min="0"
        max="999"
        class="c-auto-sac-type-tab__input"
        :value="effectScores[effect.id]"
        @blur="setEffectScore(effect.id, $event)"
      >
    </div>
  </div>
</template>

<style scoped>

</style>
