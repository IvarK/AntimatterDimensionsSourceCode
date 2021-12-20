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
    displayLevel() {
      if (BASIC_GLYPH_TYPES.includes(this.type)) return this.level + this.realityGlyphBoost;
      return this.level;
    },
    effectiveLevel() {
      return this.displayLevel ? this.displayLevel : this.level;
    },
    isLevelCapped() {
      return this.displayLevel && this.displayLevel < this.level;
    },
    isLevelBoosted() {
      return this.displayLevel && this.displayLevel > this.level;
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
      // TODO Update this when we "fix" new UI Normal because #5151EC looks kinda weird
      const color = this.glyph.type === "cursed"
        ? "#5151EC"
        : GlyphTypes[this.type].color;
      return {
        color: `${color}`,
        "font-weight": "bold",
        animation: this.type === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    rarityStyle() {
      let color;
      if (this.glyph.type === "companion") color = GlyphTypes[this.type].color;
      else color = getRarity(this.glyph.strength).color;
      return {
        "color": `${color}`,
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
      const db = GameDatabase.reality.glyphEffects;
      const effects = getGlyphEffectValuesFromBitmask(this.glyph.effects, this.level, this.glyph.strength)
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
      const rawDesc = typeof dbEntry.shortDesc === "function"
        ? dbEntry.shortDesc()
        : dbEntry.shortDesc;
      const singleValue = dbEntry.formatSingleEffect
        ? dbEntry.formatSingleEffect(value)
        : dbEntry.formatEffect(value);
      const alteredValue = dbEntry.conversion
        ? dbEntry.formatSecondaryEffect(dbEntry.conversion(value))
        : "";
      return `${rawDesc}`
        .replace("{value}", singleValue)
        .replace("{value2}", alteredValue);
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
        style="margin: 0.1rem;"
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
        v-for="(effectText, index) in glyphEffectList"
        :key="index"
      >
        {{ effectText }}
      </div>
    </div>
  </div>
</template>
