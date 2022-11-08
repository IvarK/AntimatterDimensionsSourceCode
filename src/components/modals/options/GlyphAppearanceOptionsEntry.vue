<script>
import GlyphComponent from "@/components/GlyphComponent";

export default {
  name: "GlyphAppearanceOptionsEntry",
  components: {
    GlyphComponent
  },
  props: {
    type: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      currSymbol: "",
      currColor: "",
    };
  },
  computed: {
    name() {
      return this.type.capitalize();
    },
    glyphIconProps() {
      return {
        size: "2.5rem",
        "glow-blur": "0.3rem",
        "glow-spread": "0.1rem",
        "text-proportion": 0.7
      };
    },
    fakeGlyph() {
      return {
        type: this.type,
        strength: player.records.bestReality.glyphStrength,
      };
    },
    symbols() {
      const arr = GlyphCosmeticHandler.availableSymbols;
      arr.unshift(GlyphTypes[this.type].defaultSymbol);
      return arr;
    },
    colors() {
      const arr = GlyphCosmeticHandler.availableColors;
      arr.unshift(GlyphTypes[this.type].defaultColor);
      return arr;
    },
  },
  methods: {
    update() {
      this.currSymbol = GlyphTypes[this.type].symbol;
      this.currColor = GlyphTypes[this.type].color;
    },
    selectSymbol(symbol) {
      player.reality.glyphs.cosmetics.symbolMap[this.type] = symbol;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    selectColor(color) {
      player.reality.glyphs.cosmetics.colorMap[this.type] = color;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    symbolClassObject(symbol) {
      const isCurrent = symbol === this.currSymbol;
      return {
        "o-symbol": true,
        "o-symbol--current": isCurrent,
        "o-symbol--unselected": !isCurrent,
      };
    },
    colorBox(color) {
      return {
        background: "black",
        "min-width": "1.5rem",
        height: "1.5rem",
        margin: "0.25rem",
        "box-shadow": `0 0 0.4rem 0.1rem ${color}`,
        "text-align": "center",
      };
    }
  }
};
</script>

<template>
  <div class="c-glyph-customization-entry">
    <GlyphComponent
      v-bind="glyphIconProps"
      :glyph="fakeGlyph"
    />
    <span class="c-name">{{ name }}:</span>
    <span class="c-symbol-options">
      <span
        v-for="symbol in symbols"
        :key="symbol"
        :class="symbolClassObject(symbol)"
        @click="selectSymbol(symbol)"
      >{{ symbol }}</span>
    </span>
    <span class="c-color-options">
      <div
        v-for="color in colors"
        :key="color"
        :style="colorBox(color)"
        @click="selectColor(color)"
      >
        {{ currColor === color ? "✓" : "" }}
      </div>
    </span>
  </div>
</template>

<style scoped>
.c-glyph-customization-entry {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.5rem;
}

.c-name {
  width: 24%;
  margin-left: 1rem;
}

.c-symbol-options {
  width: 38%;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
  overflow: hidden;
}

.o-symbol {
  margin: 0 0.5rem;
  font-size: 1.6rem;
}

.o-symbol--current {
  font-weight: bold;
}

.o-symbol--unselected {
  color: var(--color-disabled);
  filter: brightness(60%);
}

.c-color-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 38%;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0 0.5rem;
  overflow: hidden;
}
</style>
