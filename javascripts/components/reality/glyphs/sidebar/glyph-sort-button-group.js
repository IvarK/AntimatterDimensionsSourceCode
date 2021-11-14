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
      <div class="l-glyph-sacrifice-options__header">Sort Glyphs:</div>
      <button
        class="c-glyph-inventory-option"
        @click="sortByPower"
      >
        Sort by power
        <div class="c-glyph-inventory-option__tooltip">Arranges by decreasing level×rarity</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        @click="sortByEffect"
      >
        Sort by effect
        <div class="c-glyph-inventory-option__tooltip">Groups Glyphs together based on effects</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        v-if="showScoreFilter"
        @click="sortByScore"
      >
        Sort by score
        <div class="c-glyph-inventory-option__tooltip">Arranges by decreasing Glyph filter score</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        @click="collapseEmpty"
      >
        Collapse empty space
        <div class="c-glyph-inventory-option__tooltip">Moves all Glyphs to the earliest empty slots</div>
      </button>
    </div>`
});
