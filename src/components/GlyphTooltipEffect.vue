<script>
export default {
  name: "GlyphTooltipEffect",
  props: {
    effect: {
      type: String,
      required: true
    },
    value: {
      type: [Number, Object],
      required: true
    }
  },
  computed: {
    effectConfig() {
      return GlyphEffects[this.effect];
    },
    boostColor() {
      return (this.effectConfig.alterationType !== undefined &&
        this.effectConfig.alterationType !== ALTERATION_TYPE.ADDITION)
        ? this.effectConfig.alteredColor()
        : undefined;
    },
    additionColor() {
      return this.effectConfig.alterationType === ALTERATION_TYPE.ADDITION
        ? this.effectConfig.alteredColor()
        : undefined;
    },
    effectStringTemplate() {
      return this.effectConfig.singleDesc;
    },
    primaryEffectText() {
      const value = this.effectConfig.formatSingleEffect(this.value);
      return this.boostColor ? `⯅${value}` : value;
    },
    secondaryEffectText() {
      const value = this.effectConfig.formatSingleSecondaryEffect(
        this.effectConfig.conversion(this.value));
      return this.boostColor ? `⯅${value}` : value;
    },
    textSplits() {
      const firstSplit = this.effectStringTemplate.split("{value}");
      const secondSplit = firstSplit[1] ? firstSplit[1].split("{value2}") : "";
      if (secondSplit.length !== 1) return [firstSplit[0]].concat(secondSplit);
      return firstSplit;
    },
    hasValue() {
      return this.effectStringTemplate.includes("{value}");
    },
    hasSecondaryValue() {
      return this.textSplits[2] !== undefined;
    },
    isPelleDisabled() {
      return this.effectConfig.isDisabledByDoomed;
    },
    convertedParts() {
      const parts = [];
      for (const text of this.textSplits) parts.push(this.convertToHTML(text));
      return parts;
    },
    valueStyle() {
      return this.boostColor ? {
        color: this.boostColor,
        "text-shadow": `0 0 0.4rem ${this.boostColor}`
      } : {
        color: "#76EE76",
      };
    },
    textShadowColor() {
      return GlyphAppearanceHandler.getBaseColor(true);
    },
  },
  methods: {
    convertToHTML(string) {
      return string
        .replace("\n", "<br>")
        .replace("]", "</span>")
        .replace(
          "[", `<span style="${GlyphAppearanceHandler.isLightBG
            ? ""
            : "text-shadow: white 0 0 0.6rem;"}
            font-weight: bold;">`
        );
    }
  }
};
</script>

<template>
  <div
    class="c-glyph-tooltip__effect"
    :class="{ 'o-pelle-disabled': isPelleDisabled }"
  >
    <span v-html="convertedParts[0]" />
    <!-- Do not "fix" the spacing on these spans; moving effectText to its own line causes extra spaces to appear -->
    <span
      v-if="hasValue"
      :style="valueStyle"
    >{{ primaryEffectText }}</span>
    <span v-html="convertedParts[1]" />
    <span
      v-if="hasSecondaryValue"
      :style="valueStyle"
    >{{ secondaryEffectText }}</span>
    <span
      v-if="hasSecondaryValue"
      v-html="convertedParts[2]"
    />
  </div>
</template>
