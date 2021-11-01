"use strict";


Vue.component("glyph-tab-sidebar", {
  data() {
    return {
      type: 0,
      sidebarEnum: {},
      unlockedFilter: false,
      unlockedSets: false,
      unlockedAlchemy: false,
      hasMoreOptions: false,
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
      this.hasMoreOptions = this.unlockedFilter || this.unlockedSets || this.unlockedAlchemy;
      this.hasRefined = AlchemyResources.all.map(res => res.amount).some(a => a > 0);
    },
    setSidebarState(state) {
      player.reality.showSidebarPanel = state;
    },
    sidebarClass(index) {
      return {
        "l-glyph-sidebar-button": true,
        "c-glyph-sidebar-button": true,
        "c-glyph-sidebar-button--active": index === player.reality.showSidebarPanel,
        "l-glyph-sidebar-button--attention": index === this.sidebarEnum.SACRIFICE_TYPE && !this.hasRefined
      };
    }
  },
  template: `
    <div class="l-glyph-sidebar-option-container">
      <div v-if="hasMoreOptions" class="l-glyph-sidebar-tab-container">
        <button
          :class="sidebarClass(sidebarEnum.INVENTORY_MANAGEMENT)"
          @click="setSidebarState(sidebarEnum.INVENTORY_MANAGEMENT)"
        >
          Manage Inventory
        </button>
        <button
          :class="sidebarClass(sidebarEnum.FILTER_SETTINGS)"
          v-if="unlockedFilter"
          @click="setSidebarState(sidebarEnum.FILTER_SETTINGS)"
        >
          Glyph Filter
        </button>
        <button
          :class="sidebarClass(sidebarEnum.SAVED_SETS)"
          v-if="unlockedSets"
          @click="setSidebarState(sidebarEnum.SAVED_SETS)"
        >
          Saved Glyph Sets
        </button>
        <button
          :class="sidebarClass(sidebarEnum.SACRIFICE_TYPE)"
          v-if="unlockedAlchemy"
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
