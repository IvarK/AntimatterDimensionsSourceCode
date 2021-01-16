"use strict";


Vue.component("glyph-tab-side-box", {
  data() {
    return {
      type: 0,
      unlockedFilter: false,
      unlockedSets: false,
      unlockedAlchemy: false,
      unlockedAny: false,
    };
  },
  methods: {
    update() {
      this.type = player.reality.showSidebarPanel;
      this.unlockedFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.unlockedSets = EffarigUnlock.setSaves.isUnlocked;
      this.unlockedAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      this.unlockedAny = this.unlockedFilter || this.unlockedSets || this.unlockedAlchemy;
    },
    setSidebarState(state) {
      player.reality.showSidebarPanel = state;
    }
  },
  template: `
  <div v-if="unlockedAny">
    <div class="l-glyph-side-box-position">
      <div class="l-glyph-side-box-button-position"
        v-if="unlockedFilter && unlockedSets">
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
                v-if="unlockedFilter"
                @click="setSidebarState(0)">
          Glyph Filter
        </button>
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
                v-if="unlockedSets"
                @click="setSidebarState(1)">
          Glyph Set Saves
        </button>
        <button class="l-glyph-side-box-button c-reality-upgrade-btn"
                v-if="unlockedAlchemy"
                @click="setSidebarState(2)">
          Sacrifice Type
        </button>
      </div>
    </div>
    <glyph-sacrifice-options v-if="type===0 && unlockedFilter" />
    <glyph-set-saves v-else-if="type===1 && unlockedSets" />
    <glyph-auto-pick-options v-if="type===2 && unlockedAlchemy" />
  </div>
  `
});
