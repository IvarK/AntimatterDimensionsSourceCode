"use strict";

Vue.component("glyph-clean-options", {
  data() {
    return {
      glyphSacrificeUnlocked: false,
      hasPerkShop: false,
      hasFilter: false,
      inventory: [],
    };
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.hasFilter = EffarigUnlock.basicFilter.isUnlocked;
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
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
    }
  },
  computed: {
    removeString() {
      return this.glyphSacrificeUnlocked ? "Sacrifice" : "Delete";
    },
    autoCleanTooltip() {
      return `${this.glyphSacrificeUnlocked ? "Sacrifice" : "Delete"} Glyphs that are worse in every way than 
        enough other Glyphs${this.hasPerkShop ? " (ignores music Glyphs)" : ""}`;
    },
    harshAutoCleanTooltip() {
      return `${this.glyphSacrificeUnlocked ? "Sacrifice" : "Delete"} Glyphs that are worse in every way than 
        ANY other Glyph${this.hasPerkShop ? " (can remove music Glyphs)" : ""}`;
    },
    deleteRejectedTooltip() {
      const removeCount = this.inventory
        .filter(g => g !== null && g.idx >= Glyphs.protectedSlots && !AutoGlyphProcessor.wouldKeep(g))
        .length;
      return removeCount === 0
        ? `This will not remove any Glyphs, adjust your filter settings to remove some.`
        : `This will remove ${formatInt(removeCount)} ${pluralize("Glyph", removeCount)}!`;
    }
  },
  template: `
    <div>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        :ach-tooltip="autoCleanTooltip"
        @click="autoClean">
          Auto clean
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        :ach-tooltip="harshAutoCleanTooltip"
        @click="harshAutoClean">
          Harsh auto clean
      </button>
      <br>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        @click="deleteAllUnprotected">
          {{ removeString }} all unprotected Glyphs
      </button>
      <br>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        v-if="hasFilter"
        :ach-tooltip="deleteRejectedTooltip"
        @click="deleteAllRejected">
          {{ removeString }} all Glyphs rejected by filtering
      </button>
    </div>
  `,
});
