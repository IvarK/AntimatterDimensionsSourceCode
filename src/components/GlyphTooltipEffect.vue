<script>
export default {
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
      return GameDatabase.reality.glyphEffects[this.effect];
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
      return typeof this.effectConfig.singleDesc === "function"
        ? this.effectConfig.singleDesc()
        : this.effectConfig.singleDesc;
    },
    primaryEffectText() {
      const value = this.effectConfig.formatSingleEffect(this.value);
      return this.boostColor ? `⯅${value}⯅` : value;
    },
    secondaryEffectText() {
      const value = this.effectConfig.formatSingleSecondaryEffect(
        this.effectConfig.conversion(this.value));
      return this.boostColor ? `⯅${value}⯅` : value;
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
  },
  methods: {
    convertToHTML(string) {
      return string
        .replace("\n", "<br>")
        .replace("]", "</span>")
        .replace("[", `<span style="color:${this.additionColor}; text-shadow:#FFFFFF 0 0 0.6rem;">`);
    }
  }
};
</script>

<template>
  <div class="c-glyph-tooltip__effect">
    <span v-html="convertedParts[0]" />
    <span
      v-if="hasValue"
      :style="valueStyle"
    >
      {{ primaryEffectText }}
    </span>
    <span v-html="convertedParts[1]" />
    <span
      v-if="hasSecondaryValue"
      :style="valueStyle"
    >
      {{ secondaryEffectText }}
    </span>
    <span
      v-if="hasSecondaryValue"
      v-html="convertedParts[2]"
    />
  </div>
</template>
