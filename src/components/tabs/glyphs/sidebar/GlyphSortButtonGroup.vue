<script>
export default {
  name: "GlyphSortButtonGroup",
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
    },
    sortByLevel() {
      Glyphs.sortByLevel();
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
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      Sort Glyphs:
    </div>
    <button
      class="c-glyph-inventory-option"
      @click="sortByLevel"
    >
      Sort by level
      <div class="c-glyph-inventory-option__tooltip">
        Arranges by decreasing Glyph level
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByPower"
    >
      Sort by power
      <div class="c-glyph-inventory-option__tooltip">
        Arranges by decreasing level×rarity
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByEffect"
    >
      Sort by effect
      <div class="c-glyph-inventory-option__tooltip">
        Groups Glyphs together based on effects
      </div>
    </button>
    <button
      v-if="showScoreFilter"
      class="c-glyph-inventory-option"
      @click="sortByScore"
    >
      Sort by score
      <div class="c-glyph-inventory-option__tooltip">
        Arranges by decreasing Glyph filter score
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="collapseEmpty"
    >
      Collapse empty space
      <div class="c-glyph-inventory-option__tooltip">
        Moves all Glyphs to the earliest empty slots
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
