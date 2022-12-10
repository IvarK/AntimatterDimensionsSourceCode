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
      return GlyphEffects[this.effect.id];
    },
    formatValue() {
      if (this.effectConfig.isDisabledByDoomed) return "";
      const baseValue = this.effect.value.value;
      const value1 = this.effectConfig.formatEffect(baseValue);
      const value2 = this.effectConfig.conversion === undefined
        ? ""
        : this.effectConfig.formatSecondaryEffect(this.effectConfig.conversion(baseValue));
      const desc = this.effectConfig.totalDesc;
      return desc
        .replace("{value}", value1)
        .replace("{value2}", value2);
    },
    textColor() {
      if (!this.isColored) return { };
      const typeObject = this.effectConfig.id === "timeshardpow"
        ? CosmeticGlyphTypes.time
        : CosmeticGlyphTypes[this.effectConfig.glyphTypes];

      let glyphColor = typeObject.currentColor.border;
      if (typeObject.id === "cursed") glyphColor = "var(--color-celestials)";

      return {
        color: glyphColor,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${typeObject.currentColor.border}`,
        animation: typeObject.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    valueClass() {
      return this.effect.value.capped ? "c-current-glyph-effects__effect--capped" : "";
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("effectConfig");
    });
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
