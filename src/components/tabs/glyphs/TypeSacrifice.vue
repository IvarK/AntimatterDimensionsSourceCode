<script>
export default {
  name: "TypeSacrifice",
  props: {
    type: {
      type: String,
      required: true
    },
    hasDragover: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      amount: 0,
      effectValue: 0,
      isColored: true,
      willSacrifice: false,
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.type];
    },
    sacConfig() {
      return GlyphSacrifice[this.type].config;
    },
    style() {
      if (!this.isColored) return { };
      const color = GlyphAppearanceHandler.getBorderColor(this.type);
      const animateReality = this.typeConfig.id === "reality" && !player.reality.glyphs.cosmetics.colorMap.reality;
      return {
        color,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${color}`,
        animation: animateReality ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    symbol() {
      return CosmeticGlyphTypes[this.type].currentSymbol.symbol;
    },
    formatAmount() {
      return format(this.amount, 2, 2);
    },
    description() {
      return this.sacConfig.description(this.effectValue);
    },
    newDescription() {
      return this.sacConfig.description(this.sacConfig.effect(this.currentSacrifice.sacrificeValue));
    },
    currentSacrifice() {
      const viewModel = this.$viewModel.tabs.reality;
      return viewModel.mouseoverGlyphInfo.type === ""
        ? viewModel.draggingGlyphInfo
        : viewModel.mouseoverGlyphInfo;
    },
    showNewSacrifice() {
      const matchType = this.currentSacrifice.type === this.type;
      const validSac = this.willSacrifice && this.currentSacrifice.inInventory;
      const keybindActive = ui.view.shiftDown;
      return matchType && (this.hasDragover || (keybindActive && validSac));
    },
    formatNewAmount() {
      return format(this.currentSacrifice.sacrificeValue, 2, 2);
    },
    formatTotalAmount() {
      return format(this.amount + this.currentSacrifice.sacrificeValue, 2, 2);
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("style");
    });
  },
  methods: {
    update() {
      this.amount = player.reality.glyphs.sac[this.type];
      this.effectValue = GlyphSacrifice[this.type].effectValue;
      this.isColored = player.options.glyphTextColors;
      this.willSacrifice = AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.SACRIFICE ||
        (AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE_TO_CAP &&
          this.currentSacrifice.refineValue === 0);
    }
  }
};
</script>

<template>
  <div
    v-if="amount > 0"
    :style="style"
  >
    <div>
      <div class="l-sacrificed-glyphs__type-symbol c-sacrificed-glyphs__type-symbol">
        {{ symbol }}
      </div>
      <div class="l-sacrificed-glyphs__type-amount c-sacrificed-glyphs__type-amount">
        {{ formatAmount }}
        <span
          v-if="showNewSacrifice"
          class="c-sacrificed-glyphs__type-new-amount"
        >
          + {{ formatNewAmount }} ➜ {{ formatTotalAmount }}
        </span>
      </div>
    </div>
    <span
      v-if="showNewSacrifice"
      class="c-sacrificed-glyphs__type-new-amount"
    >
      {{ newDescription }}
    </span>
    <span v-else>
      {{ description }}
    </span>
  </div>
</template>

<style scoped>
.c-sacrificed-glyphs__type-symbol {
  margin-right: 0.7rem;
}
</style>
