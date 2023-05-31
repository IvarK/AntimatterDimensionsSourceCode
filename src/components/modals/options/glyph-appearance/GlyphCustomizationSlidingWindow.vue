<script>
export default {
  name: "GlyphCustomizationSlidingWindow",
  props: {
    type: {
      type: String,
      required: true,
    },
    isSymbol: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    glyphId: {
      type: Number,
      required: false,
      default: -1,
    }
  },
  data() {
    return {
      isActive: false,
      selected: "",
      leftmostIndex: 0,
      realityColor: "",
      // Required in order to refresh all the options if the option to force dark backgrounds is clicked
      darkKeySwap: false,
    };
  },
  computed: {
    isSingleGlyph() {
      return this.glyphId !== -1;
    },
    attrString() {
      return this.isSymbol ? "symbol" : "color";
    },
    typeObject() {
      return CosmeticGlyphTypes;
    },
    defaultOption() {
      if (this.realityColor) return this.realityColor;
      const config = this.typeObject[this.type];
      const prop = `${this.isSingleGlyph ? "current" : "default"}${this.attrString.capitalize()}`;
      return this.isSymbol
        ? config[prop].symbol
        : config[prop].border;
    },
    canScroll() {
      return this.options.length > this.windowSize;
    },
    // Maximum number of options visible at one time, used to determine scrolling bounds
    windowSize() {
      return 17;
    }
  },
  created() {
    this.updateSelected();
  },
  methods: {
    update() {
      if (this.isSingleGlyph) {
        const glyph = Glyphs.findById(this.glyphId);
        this.isActive = !glyph.cosmetic;
      } else {
        this.isActive = player.reality.glyphs.cosmetics.active;
      }
      if (this.type === "reality" && !this.isSymbol) this.realityColor = GlyphAppearanceHandler.realityColor;
      this.darkKeySwap = player.options.glyphBG;
    },
    select(option) {
      if (!this.isSingleGlyph && !this.isActive) return;
      if (this.isSingleGlyph) {
        const glyph = Glyphs.findById(this.glyphId);
        glyph[this.attrString] = option;
        if (!this.active) glyph.cosmetic = undefined;
      } else {
        player.reality.glyphs.cosmetics[`${this.attrString}Map`][this.type] = option;
      }
      this.updateSelected();
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    updateSelected() {
      if (this.isSingleGlyph) {
        const glyph = Glyphs.findById(this.glyphId);
        this.selected = glyph[this.attrString];
      } else {
        this.selected = this.isSymbol
          ? this.typeObject[this.type].currentSymbol.symbol
          : this.typeObject[this.type].currentColor.str;
      }
    },
    containerClassObject() {
      return {
        "c-all-options": true,
        "o-option--inactive": !this.isActive
      };
    },
    defaultOptionClassObject() {
      const checkOption = this.isSingleGlyph ? undefined : this.defaultOption;
      return {
        "o-symbol": this.isSymbol,
        "o-color": !this.isSymbol,
        "o-clickable": this.isActive,
        "o-option--inactive": this.isSymbol && checkOption !== this.selected,
      };
    },
    optionClassObject(option) {
      return {
        "o-symbol": this.isSymbol,
        "o-color": !this.isSymbol,
        "o-clickable": this.isActive,
        "o-option--inactive": this.isSymbol && option !== this.selected,
      };
    },
    boxStyle(color) {
      if (this.isSymbol || !color) return {};
      const colorProps = GlyphAppearanceHandler.getColorProps(color);
      return {
        background: colorProps.bg,
        color: this.invertBW(colorProps.bg),
        "box-shadow": `0 0 0.4rem 0.1rem ${colorProps.border}`,
      };
    },
    windowStyle() {
      return {
        transform: `translate(${2 - 2.5 * this.leftmostIndex}rem)`,
        "transition-duration": "0.3s",
      };
    },
    leftClass() {
      return {
        "o-arrow o-arrow--left": true,
        "o-arrow--disabled": this.leftmostIndex === 0 || !this.canScroll,
      };
    },
    rightClass() {
      return {
        "o-arrow o-arrow--right": true,
        "o-arrow--disabled": this.leftmostIndex === this.options.length - this.windowSize || !this.canScroll,
      };
    },
    slideWindow(dir) {
      if (!this.canScroll) return;
      this.leftmostIndex = Math.clamp(this.leftmostIndex + dir, 0, this.options.length - this.windowSize);
    },
    optionChar(option) {
      if (this.isSymbol) return option;
      return (option === this.selected || (!this.selected && option === this.defaultOption)) ? "✓" : "";
    },
    invertBW(color) {
      return color === "black" ? "white" : "black";
    }
  }
};
</script>

<template>
  <div>
    <div
      v-if="options.length > 0"
      :class="containerClassObject()"
    >
      <div class="o-default-option">
        <div
          :key="'default' + darkKeySwap"
          :class="defaultOptionClassObject()"
          :style="boxStyle(defaultOption)"
          @click="select(undefined)"
        >
          {{ optionChar(defaultOption) }}
        </div>
      </div>
      <div class="c-extra-options">
        <div
          :class="leftClass()"
          @click="slideWindow(-5)"
        >
          ⇐
        </div>
        <div
          :class="rightClass()"
          @click="slideWindow(5)"
        >
          ⇒
        </div>
        <div
          class="c-sliding-window"
          :style="windowStyle()"
        >
          <div
            v-for="set in options"
            :key="set[0] + set[1]"
          >
            <div class="c-single-set">
              <div
                v-for="singleOption in set"
                :key="singleOption"
                :class="optionClassObject(singleOption)"
                :style="boxStyle(singleOption)"
                @click="select(singleOption)"
              >
                {{ optionChar(singleOption) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="c-no-options"
    >
      You have no custom options for changing Glyph {{ attrString }}s.
    </div>
  </div>
</template>

<style scoped>
.c-all-options {
  display: flex;
  flex-direction: row;
  width: 49rem;
  margin: 0.5rem;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-no-options {
  width: 49rem;
  margin: 0.5rem;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-extra-options {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-width: 0.1rem;
  border-left-style: dashed;
  border-color: var(--color-text);
}

.c-sliding-window {
  display: flex;
  flex-direction: row;
}

.o-option--inactive {
  opacity: 0.3;
}

.o-arrow {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.3rem;
  z-index: 1;
  background: var(--color-good);
  color: var(--color-text);
  transition-duration: 0.3s;
  cursor: pointer;
  user-select: none;
}

.o-arrow--left {
  left: 0;
}

.o-arrow--right {
  right: 0;
  border-radius: 0 var(--var-border-radius, 0.5rem) var(--var-border-radius, 0.5rem) 0;
}

.o-arrow--disabled {
  opacity: 0.3;
  cursor: default;
}

.o-default-option {
  align-self: normal;
  font-size: 1.5rem;
  color: var(--color-text);
}

.o-clickable {
  cursor: pointer;
}

.c-single-set {
  display: flex;
  flex-direction: column;
}

.o-symbol {
  width: 2.5rem;
  text-align: center;
  font-size: 1.6rem;
  user-select: none;
}

.o-color {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.5rem;
  font-weight: bold;
  user-select: none;
}
</style>
