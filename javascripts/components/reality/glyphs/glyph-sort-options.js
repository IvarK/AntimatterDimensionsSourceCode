"use strict";

Vue.component("glyph-sort-options", {
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.basicFilter.isUnlocked;
    },
    sortByPower() {
      Glyphs.sort((a, b) => -a.level * a.strength + b.level * b.strength);
    },
    sortByScore() {
      Glyphs.sort((a, b) => -AutoGlyphProcessor.filterValue(a) + AutoGlyphProcessor.filterValue(b));
    },
    sortByEffect() {
      function reverseBitstring(eff) {
        // eslint-disable-next-line no-bitwise
        return parseInt(((1 << 30) + (eff >>> 0)).toString(2).split("").reverse().join(""), 2);
      }
      // The bitwise reversal is so that the effects with the LOWER id are valued higher in the sorting.
      // This primarily meant for effarig glyph effect sorting, which makes it prioritize timespeed pow highest.
      Glyphs.sort((a, b) => -reverseBitstring(a.effects) + reverseBitstring(b.effects));
    },
    collapseEmpty() {
      Glyphs.collapseEmptySlots();
    }
  },
  template: `
    <div>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Arranges by decreasing level×rarity"
        @click="sortByPower">
          Sort by power
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Group glyphs together based on effects"
        @click="sortByEffect">
          Sort by effect
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        v-if="showScoreFilter"
        ach-tooltip="Arranges by decreasing glyph filter score"
        @click="sortByScore">
          Sort by score
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Moves all glyphs to the earliest empty slots"
        @click="collapseEmpty">
          Collapse empty space
      </button>
    </div>
  `,
});
