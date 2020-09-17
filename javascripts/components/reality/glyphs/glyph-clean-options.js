"use strict";

Vue.component("glyph-clean-options", {
  data() {
    return {
      glyphSacrificeUnlocked: false,
      hasPerkShop: false,
      hasFilter: false,
      inventory: [],
      isRefining: false,
    };
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.hasFilter = EffarigUnlock.basicFilter.isUnlocked;
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
      this.isRefining = AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.ALWAYS_REFINE ||
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
  computed: {
    removeString() {
      if (this.isRefining) return "Refine";
      if (this.glyphSacrificeUnlocked) return "Sacrifice";
      return "Delete";
    },
    autoCleanTooltip() {
      return `${this.removeString} glyphs that are worse in every way than
        enough other glyphs${this.hasPerkShop ? " (ignores music glyphs)" : ""}`;
    },
    harshAutoCleanTooltip() {
      return `${this.removeString} glyphs that are worse in every way than
        ANY other glyph${this.hasPerkShop ? " (can remove music glyphs)" : ""}`;
    },
    deleteRejectedTooltip() {
      const removeCount = this.inventory
        .filter(g => g !== null && g.idx >= Glyphs.protectedSlots && !AutoGlyphProcessor.wouldKeep(g))
        .length;
      return removeCount === 0
        ? `This will not remove any glyphs, adjust your filter settings to remove some.`
        : `This will remove ${formatInt(removeCount)} ${pluralize("glyph", removeCount)}!`;
    }
  },
  template: `
    <div v-if="glyphSacrificeUnlocked">
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        :ach-tooltip="autoCleanTooltip"
        @click="autoClean">
          Purge Glyphs
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        :ach-tooltip="harshAutoCleanTooltip"
        @click="harshAutoClean">
          Harsh Purge Glyphs
      </button>
      <br>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        @click="deleteAllUnprotected">
          {{ removeString }} all unprotected glyphs
      </button>
      <br>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        v-if="hasFilter"
        :ach-tooltip="deleteRejectedTooltip"
        @click="deleteAllRejected">
          {{ removeString }} all glyphs rejected by filtering
      </button>
    </div>
  `,
});
