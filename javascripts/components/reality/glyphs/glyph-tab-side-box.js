"use strict";


Vue.component("glyph-tab-side-box", {
  data() {
    return {
      type: 0,
      unlockedSets: false,
      unlockedAlchemy: false,
    };
  },
  methods: {
    update() {
      this.type = player.reality.showSidebarPanel;
      this.unlockedSets = true;
      this.unlockedAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
    },
    setSidebarState(state) {
      player.reality.showSidebarPanel = state;
    }
  },
  template: `
  <div>
    <div class="l-glyph-side-box-position">
      <div class="l-glyph-side-box-button-position">
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
        @click="setSidebarState(0)">
          Glyph Filter
        </button>
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
        v-if="unlockedSets"
        @click="setSidebarState(1)">
          Glyph Sets
        </button>
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
        v-if="unlockedAlchemy"
        @click="setSidebarState(2)">
          Sacrifice Type
        </button>
      </div>
    </div>
    <glyph-auto-pick-options v-if="type===2 && unlockedAlchemy" />
    <glyph-set-saves v-else-if="type===1 && unlockedSets" />
    <glyph-sacrifice-options v-else />
  </div>
  `
});
