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
    }
  },
  data() {
    return {
      selectedIndex: -1,
      leftmostIndex: 0,
    };
  },
  computed: {
    attrString() {
      return this.isSymbol ? "symbol" : "color";
    },
    defaultOption() {
      return GlyphTypes[this.type][`default${this.attrString.capitalize()}`];
    },
  },
  created() {
    this.selectedIndex = this.options.indexOf(GlyphTypes[this.type][this.attrString]);
  },
  methods: {
    select(option) {
      player.reality.glyphs.cosmetics[`${this.attrString}Map`][this.type] = option;
      this.selectedIndex = this.options.indexOf(GlyphTypes[this.type][this.attrString]);
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    symbolClassObject(option) {
      return {
        "o-symbol": this.isSymbol,
        "o-color": !this.isSymbol,
        "o-option--inactive": this.isSymbol && this.options.indexOf(option) !== this.selectedIndex,
      };
    },
    boxShadow(color) {
      if (this.isSymbol) return {};
      return {
        "box-shadow": `0 0 0.4rem 0.1rem ${color}`,
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
        "o-option--inactive": this.leftmostIndex === 0,
        "o-arrow--highlight": this.selectedIndex < this.leftmostIndex && this.selectedIndex !== -1,
      };
    },
    rightClass() {
      return {
        "o-arrow o-arrow--right": true,
        "o-option--inactive": this.leftmostIndex === this.options.length - 4,
        "o-arrow--highlight": this.selectedIndex >= this.leftmostIndex + 4,
      };
    },
    slideWindow(dir) {
      this.leftmostIndex = Math.clamp(this.leftmostIndex + dir, 0, this.options.length - 4);
    },
    optionChar(option) {
      if (this.isSymbol) return option;
      return this.options.indexOf(option) === this.selectedIndex ? "✓" : "";
    }
  }
};
</script>

<template>
  <div class="c-all-options">
    <div class="o-default-option">
      <div
        :key="defaultOption"
        :class="symbolClassObject(defaultOption)"
        :style="boxShadow(defaultOption)"
        @click="select(undefined)"
      >
        {{ optionChar(defaultOption) }}
      </div>
    </div>
    <div class="c-extra-options">
      <div
        :class="leftClass()"
        @click="slideWindow(-2)"
      >
        ⇐
      </div>
      <div
        :class="rightClass()"
        @click="slideWindow(2)"
      >
        ⇒
      </div>
      <div
        class="c-sliding-window"
        :style="windowStyle()"
      >
        <div
          v-for="option in options"
          :key="option"
          :class="symbolClassObject(option)"
          :style="boxShadow(option)"
          @click="select(option)"
        >
          {{ optionChar(option) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-all-options {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.5rem;
  width: 38%;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
  overflow: hidden;
}

.c-extra-options {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.c-sliding-window {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.o-option--inactive {
  color: var(--color-disabled);
  opacity: 0.5;
}

.o-arrow {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.3rem;
  z-index: 1;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  user-select: none;
}

.o-arrow--left {
  left: 0;
}

.o-arrow--right {
  right: 0;
}

.o-arrow--highlight {
  text-shadow: 0 0 0.4rem var(--color-text);
}

.o-default-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  border-width: 0.1rem;
  border-right-style: dashed;
  border-color: var(--color-text);
  color: var(--color-text);
  background: var(--color-base);
  z-index: 1;
}

.o-symbol {
  display: block;
  width: 2.5rem;
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
}

.o-color {
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  min-width: 1.5rem;
  height: 1.5rem;
  margin: 0.25rem 0.5rem;
}
</style>
