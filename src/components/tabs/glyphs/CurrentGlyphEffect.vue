<script>
export default {
  name: "CurrentGlyphEffect",
  props: {
    isColored: {
      type: Boolean,
      default: true
    },
    effect: {
      type: Object,
      required: true
    }
  },
  computed: {
    effectConfig() {
      return GameDatabase.reality.glyphEffects[this.effect.id];
    },
    formatValue() {
      if (Pelle.isDoomed && !Pelle.enabledGlyphEffects.includes(this.effect.id)) return "";
      const baseValue = this.effect.value.value;
      const value1 = this.effectConfig.formatEffect(baseValue);
      const value2 = this.effectConfig.conversion === undefined
        ? ""
        : this.effectConfig.formatSecondaryEffect(this.effectConfig.conversion(baseValue));
      const desc = typeof this.effectConfig.totalDesc === "function"
        ? this.effectConfig.totalDesc()
        : this.effectConfig.totalDesc;
      return desc
        .replace("{value}", value1)
        .replace("{value2}", value2);
    },
    textColor() {
      if (!this.isColored) return { };
      const glyphName = this.effectConfig.id === "timeshardpow"
        ? GlyphTypes.time
        : GlyphTypes[this.effectConfig.glyphTypes];

      let glyphColor = glyphName.color;
      if (glyphName.id === "cursed") glyphColor = "#5151ec";

      return {
        color: glyphColor,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${glyphName.color}`,
        animation: glyphName.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    valueClass() {
      return this.effect.value.capped ? "c-current-glyph-effects__effect--capped" : "";
    }
  }
};
</script>

<template>
  <div>
    <span
      :style="textColor"
      :class="valueClass"
    >
      {{ formatValue }}
    </span>
  </div>
</template>

<style scoped>

</style>
