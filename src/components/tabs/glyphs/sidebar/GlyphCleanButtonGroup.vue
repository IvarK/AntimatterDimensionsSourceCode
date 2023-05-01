<script>
export default {
  name: "GlyphCleanButtonGroup",
  data() {
    return {
      glyphSacrificeUnlocked: false,
      hasPerkShop: false,
      hasFilter: false,
      inventory: [],
      isRefining: false,
      removeCount: 0,
    };
  },
  computed: {
    removeString() {
      if (this.isRefining) return "Refine";
      if (this.glyphSacrificeUnlocked) return "Sacrifice";
      return "Delete";
    },
    autoCleanTooltip() {
      return `${this.removeString} Glyphs that are worse in every way than
        enough other Glyphs${this.hasPerkShop ? " (ignores Music Glyphs)" : ""}`;
    },
    harshAutoCleanTooltip() {
      return `${this.removeString} Glyphs that are worse in every way than
        ANY other Glyph${this.hasPerkShop ? " (includes Music Glyphs)" : ""}`;
    },
    deleteRejectedTooltip() {
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? " You also have some negative Effect Filter scores; this may remove some Glyphs you normally want to keep!"
        : "";
      return this.removeCount === 0
        ? `This will not remove any Glyphs, adjust your Filter settings to remove some.`
        : `This will remove ${quantifyInt("Glyph", this.removeCount)}!${negativeWarning}`;
    }
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice && !Pelle.isDoomed;
      this.hasPerkShop = TeresaUnlocks.shop.canBeApplied;
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
      this.isRefining = AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE ||
        AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE_TO_CAP;
      this.removeCount = this.inventory
        .filter(g => g !== null && g.idx >= Glyphs.protectedSlots && !AutoGlyphProcessor.wouldKeep(g))
        .length;
    },
    autoClean() {
      if (player.options.confirmations.autoClean) {
        Modal.glyphPurge.show({ harsh: false });
      } else {
        Glyphs.autoClean(5);
      }
    },
    harshAutoClean() {
      if (player.options.confirmations.autoClean) {
        Modal.glyphPurge.show({ harsh: true });
      } else {
        Glyphs.autoClean(1);
      }
    },
    deleteAllUnprotected() {
      if (player.options.confirmations.sacrificeAll) {
        Modal.deleteAllUnprotectedGlyphs.show();
      } else {
        Glyphs.autoClean(0);
      }
    },
    deleteAllRejected() {
      if (player.options.confirmations.sacrificeAll) {
        Modal.deleteAllRejectedGlyphs.show();
      } else {
        Glyphs.deleteAllRejected(true);
      }
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    },
  }
};
</script>

<template>
  <div
    v-if="glyphSacrificeUnlocked"
    class="o-glyph-inventory-management-group"
  >
    <div class="l-glyph-sacrifice-options__header">
      Remove weaker Glyphs:
    </div>
    <button
      class="c-glyph-inventory-option"
      @click="autoClean"
    >
      Purge Glyphs
      <div class="c-glyph-inventory-option__tooltip">
        {{ autoCleanTooltip }}
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="harshAutoClean"
    >
      Harsh Purge Glyphs
      <div class="c-glyph-inventory-option__tooltip">
        {{ harshAutoCleanTooltip }}
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="deleteAllUnprotected"
    >
      {{ removeString }} all unprotected Glyphs
    </button>
    <button
      v-if="hasFilter"
      class="c-glyph-inventory-option"
      @click="deleteAllRejected"
    >
      {{ removeString }} all Glyphs rejected by filtering
      <div
        class="c-glyph-inventory-option__tooltip l-rejected-tooltip"
      >
        {{ deleteRejectedTooltip }}
      </div>
    </button>
  </div>
</template>

<style scoped>
.l-rejected-tooltip {
  width: 90%;
  left: 5%;
}
</style>
