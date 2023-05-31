<script>
import GlyphComponent from "@/components/GlyphComponent";

export default {
  name: "GlyphShowcasePanelEntry",
  components: {
    GlyphComponent
  },
  props: {
    idx: {
      type: Number,
      required: true
    },
    glyph: {
      type: Object,
      required: true
    },
    showLevel: {
      type: Boolean,
      required: true
    },
    realityGlyphBoost: {
      type: Number,
      default: 0
    },
    maxGlyphEffects: {
      type: Number,
      required: true
    },
    showSacrifice: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      canSacrifice: false,
    };
  },
  computed: {
    type() {
      return this.glyph.type;
    },
    typeCapitalized() {
      return this.type.capitalize();
    },
    level() {
      return this.glyph.level;
    },
    effectiveLevel() {
      return getAdjustedGlyphLevel(this.glyph, this.realityGlyphBoost, true);
    },
    isLevelCapped() {
      return this.effectiveLevel && this.effectiveLevel < this.level;
    },
    isLevelBoosted() {
      return this.effectiveLevel && this.effectiveLevel > this.level;
    },
    levelText() {
      if (this.type === "companion") return "";
      // eslint-disable-next-line no-nested-ternary
      const arrow = this.isLevelCapped
        ? "<i class='fas fa-sort-down'></i>"
        : (this.isLevelBoosted ? "<i class='fas fa-sort-up'></i>" : "");
      // eslint-disable-next-line no-nested-ternary
      const color = this.isLevelCapped
        ? "#ff4444"
        : (this.isLevelBoosted ? "#44FF44" : "var(--color-text);");
      return `<span style="color: ${color}">
                  ${arrow}${formatInt(this.effectiveLevel)}${arrow}
                  </span>`;
    },
    typeStyle() {
      // Special case for cursed glyphs because its black default has poor contrast on some themes
      return {
        color: GlyphAppearanceHandler.getBorderColor(this.type),
        "font-weight": "bold",
        "text-shadow": this.type === "cursed" ? "0.05rem 0.05rem var(--color-text)" : undefined,
        animation: this.type === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    rarityStyle() {
      // Rarity is handled differently here than usual because this is in contrast with the theme BG, not the glyph BG
      const color = CosmeticGlyphTypes[this.glyph.type].ignoreRarityColor
        ? GlyphAppearanceHandler.getBorderColor(this.type)
        : getRarity(this.glyph.strength)[Theme.current().isDark() ? "darkColor" : "lightColor"];
      return {
        color,
        "font-weight": "bold"
      };
    },
    effectStyle() {
      return {
        "font-size": `${this.type === "effarig" ? 1 : 1.2}rem`,
        "height": this.glyphEffectListHeight(this.maxGlyphEffects)
      };
    },
    glyphEffectList() {
      const db = GlyphEffects;
      const effects =
      getGlyphEffectValuesFromBitmask(this.glyph.effects, this.effectiveLevel, this.glyph.strength, this.type)
        .filter(e => db[e.id].isGenerated === generatedTypes.includes(this.type));
      const effectStrings = effects
        .map(e => this.formatEffectString(db[e.id], e.value));
      // Filter out undefined results since shortDesc only exists for generated effects
      return effectStrings.filter(s => s !== "undefined");
    },
    rarityPercent() {
      if (this.glyph.type === "companion" || this.glyph.type === "cursed") return "";
      return formatRarity(strengthToRarity(this.glyph.strength));
    },
  },
  methods: {
    update() {
      this.canSacrifice = GlyphSacrificeHandler.canSacrifice;
    },
    glyphEffectListHeight(effects) {
      const heights = [
        "3rem",
        "6rem",
        "8rem",
        "11rem"
      ];
      return heights[effects - 1];
    },
    formatEffectString(dbEntry, value) {
      const rawDesc = dbEntry.shortDesc;
      const singleValue = dbEntry.formatSingleEffect
        ? dbEntry.formatSingleEffect(value)
        : dbEntry.formatEffect(value);
      const alteredValue = dbEntry.conversion
        ? dbEntry.formatSecondaryEffect(dbEntry.conversion(value))
        : "";
      return {
        text: `${rawDesc}`
          .replace("{value}", singleValue)
          .replace("{value2}", alteredValue),
        isPelleDisabled: dbEntry.isDisabledByDoomed
      };
    },
    clickGlyph(glyph) {
      if (Glyphs.isMusicGlyph(glyph)) {
        new Audio(`audio/note${GLYPH_TYPES.indexOf(glyph.type) + 1}.mp3`).play();
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="c-glyph-choice-icon">
      <span :style="typeStyle">{{ typeCapitalized }}</span>
      <div
        v-if="showLevel"
        v-html="levelText"
      />
      <GlyphComponent
        :key="idx"
        class="c-glyph-component-container"
        :glyph="glyph"
        :show-sacrifice="showSacrifice && canSacrifice"
        :draggable="false"
        :circular="true"
        :ignore-modified-level="false"
        :reality-glyph-boost="realityGlyphBoost"
        :is-in-modal="true"
        size="4rem"
        :text-proportion="0.5"
        glow-blur="0.4rem"
        glow-spread="0.1rem"
        @clicked="clickGlyph(glyph)"
      />
      <div :style="rarityStyle">
        {{ rarityPercent }}
      </div>
    </div>
    <div
      class="c-glyph-choice-effect-list"
      :style="effectStyle"
    >
      <div
        v-for="(effectObj, index) in glyphEffectList"
        :key="index"
        :class="{ 'o-pelle-disabled': effectObj.isPelleDisabled }"
      >
        {{ effectObj.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-glyph-component-container {
  margin: 0.1rem;
}
</style>
