"use strict";

Vue.component("glyph-sort-options", {
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
    },
    sortByPower() {
      Glyphs.sortByPower();
    },
    sortByScore() {
      Glyphs.sortByScore();
    },
    sortByEffect() {
      Glyphs.sortByEffect();
    },
    collapseEmpty() {
      Glyphs.collapseEmptySlots();
    }
  },
  template: `
    <div>
      Sort Glyphs:
      <br>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Arranges by decreasing level×rarity"
        @click="sortByPower"
      >
        Sort by power
      </button>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Groups Glyphs together based on effects"
        @click="sortByEffect"
      >
        Sort by effect
      </button>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        v-if="showScoreFilter"
        ach-tooltip="Arranges by decreasing Glyph filter score"
        @click="sortByScore"
      >
        Sort by score
      </button>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Moves all Glyphs to the earliest empty slots"
        @click="collapseEmpty"
      >
        Collapse empty space
      </button>
    </div>`
});
