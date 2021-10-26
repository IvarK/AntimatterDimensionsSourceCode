"use strict";

Vue.component("glyph-sort-button-group", {
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
        class="c-glyph-inventory-option c-reality-upgrade-btn"
        @click="sortByPower"
      >
        Sort by power
        <div class="c-glyph-inventory-option__tooltip">Arranges by decreasing level×rarity</div>
      </button>
      <button
        class="c-glyph-inventory-option c-reality-upgrade-btn"
        @click="sortByEffect"
      >
        Sort by effect
        <div class="c-glyph-inventory-option__tooltip">Groups Glyphs together based on effects</div>
      </button>
      <button
        class="c-glyph-inventory-option c-reality-upgrade-btn"
        v-if="showScoreFilter"
        @click="sortByScore"
      >
        Sort by score
        <div class="c-glyph-inventory-option__tooltip">Arranges by decreasing Glyph filter score</div>
      </button>
      <button
        class="c-glyph-inventory-option c-reality-upgrade-btn"
        @click="collapseEmpty"
      >
        Collapse empty space
        <div class="c-glyph-inventory-option__tooltip">Moves all Glyphs to the earliest empty slots</div>
      </button>
    </div>`
});
