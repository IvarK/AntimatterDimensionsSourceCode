"use strict";

Vue.component("glyph-clean-button-group", {
  data() {
    return {
      glyphSacrificeUnlocked: false,
      hasPerkShop: false,
      hasFilter: false,
      inventory: [],
      isRefining: false,
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
        ANY other glyph${this.hasPerkShop ? " (includes Music Glyphs)" : ""}`;
    },
    deleteRejectedTooltip() {
      const removeCount = this.inventory
        .filter(g => g !== null && g.idx >= Glyphs.protectedSlots && !AutoGlyphProcessor.wouldKeep(g))
        .length;
      return removeCount === 0
        ? `This will not remove any Glyphs, adjust your filter settings to remove some.`
        : `This will remove ${quantifyInt("Glyph", removeCount)}!`;
    }
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
      this.isRefining = AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE ||
        AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE_TO_CAP;
    },
    autoClean() {
      Glyphs.autoClean();
    },
    harshAutoClean() {
      Glyphs.harshAutoClean();
    },
    deleteAllUnprotected() {
      Glyphs.deleteAllUnprotected();
    },
    deleteAllRejected() {
      Glyphs.deleteAllRejected();
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    },
  },
  template: `
    <div v-if="glyphSacrificeUnlocked">
      <div class="l-glyph-sacrifice-options__header">Remove weaker Glyphs:</div>
      <button
        class="c-glyph-inventory-option"
        @click="autoClean"
      >
        Purge Glyphs
        <div class="c-glyph-inventory-option__tooltip">{{ autoCleanTooltip }}</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        @click="harshAutoClean"
      >
        Harsh Purge Glyphs
        <div class="c-glyph-inventory-option__tooltip">{{ harshAutoCleanTooltip }}</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        @click="deleteAllUnprotected"
      >
        {{ removeString }} all unprotected glyphs
      </button>
      <button
        class="c-glyph-inventory-option"
        v-if="hasFilter"
        @click="deleteAllRejected"
      >
        {{ removeString }} all Glyphs rejected by filtering
        <div class="c-glyph-inventory-option__tooltip" style="width: 90%; left: 5%;">{{ deleteRejectedTooltip }}</div>
      </button>
    </div>`
});
