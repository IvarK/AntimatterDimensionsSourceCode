"use strict";


Vue.component("glyph-tab-sidebar", {
  data() {
    return {
      type: 0,
      sidebarEnum: {},
      unlockedFilter: false,
      unlockedSets: false,
      unlockedAlchemy: false,
      unlockedAny: false,
      hasRefined: false,
    };
  },
  methods: {
    update() {
      this.type = player.reality.showSidebarPanel;
      this.sidebarEnum = GLYPH_SIDEBAR_MODE;
      this.unlockedFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.unlockedSets = EffarigUnlock.setSaves.isUnlocked;
      this.unlockedAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      // We always have inventory management available, but there's no point in showing options if it's the only one
      this.unlockedAny = this.unlockedFilter || this.unlockedSets || this.unlockedAlchemy;
      this.hasRefined = AlchemyResources.all.map(res => res.amount).some(a => a > 0);
    },
    setSidebarState(state) {
      player.reality.showSidebarPanel = state;
    },
    sidebarStyle(index) {
      return {
        "z-index": player.reality.showSidebarPanel === index ? 1 : 0,
      };
    }
  },
  template: `
    <div class="l-glyph-sidebar-option-container">
      <div v-if="unlockedFilter && unlockedSets" class="l-glyph-sidebar-tab-container">
        <button
          class="l-glyph-sidebar-button c-glyph-sidebar-button"
          :style="sidebarStyle(sidebarEnum.INVENTORY_MANAGEMENT)"
          @click="setSidebarState(sidebarEnum.INVENTORY_MANAGEMENT)"
        >
          Manage Inventory
        </button>
        <button
          class="l-glyph-sidebar-button c-glyph-sidebar-button"
          v-if="unlockedFilter"
          :style="sidebarStyle(sidebarEnum.FILTER_SETTINGS)"
          @click="setSidebarState(sidebarEnum.FILTER_SETTINGS)"
        >
          Glyph Filter
        </button>
        <button
          class="l-glyph-sidebar-button c-glyph-sidebar-button"
          v-if="unlockedSets"
          :style="sidebarStyle(sidebarEnum.SAVED_SETS)"
          @click="setSidebarState(sidebarEnum.SAVED_SETS)"
        >
          Saved Glyph Sets
        </button>
        <button
          class="l-glyph-sidebar-button c-glyph-sidebar-button"
          :class="[hasRefined ? '' : 'l-glyph-sidebar-button--attention']"
          v-if="unlockedAlchemy"
          :style="sidebarStyle(sidebarEnum.SACRIFICE_TYPE)"
          @click="setSidebarState(sidebarEnum.SACRIFICE_TYPE)"
        >
          Sacrifice Type
        </button>
      </div>
      <glyph-inventory-management-panel v-if="type === sidebarEnum.INVENTORY_MANAGEMENT" />
      <glyph-filter-panel v-else-if="type === sidebarEnum.FILTER_SETTINGS && unlockedFilter" />
      <glyph-set-save-panel v-else-if="type === sidebarEnum.SAVED_SETS && unlockedSets" />
      <glyph-rejection-panel v-else-if="type === sidebarEnum.SACRIFICE_TYPE && unlockedAlchemy" />
    </div>`
});
