"use strict";

Vue.component("glyph-autosort-button-group", {
  data() {
    return {
      autoSort: 0,
      showScoreFilter: false,
      autoCollapse: false,
      showAutoAutoClean: false,
      autoAutoClean: false,
    };
  },
  watch: {
    autoSort(newValue) {
      player.reality.autoSort = newValue;
    },
    autoCollapse(newValue) {
      player.reality.autoCollapse = newValue;
    },
    autoAutoClean(newValue) {
      player.reality.autoAutoClean = newValue;
    }
  },
  computed: {
    sortModes() {
      const availableSortModes = ["NONE", "POWER", "EFFECT"];
      if (this.showScoreFilter) availableSortModes.push("SCORE");
      return availableSortModes;
    },
    questionmarkTooltip() {
      return `The automatic settings below will apply after every Reality`;
    }
  },
  methods: {
    update() {
      this.autoSort = player.reality.autoSort;
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.autoCollapse = player.reality.autoCollapse;
      this.showAutoAutoClean = V.has(V_UNLOCKS.AUTO_AUTOCLEAN);
      this.autoAutoClean = player.reality.autoAutoClean;
    },
  },
  template: `
    <div>
      <div class="l-glyph-sacrifice-options__header">
        <div class="o-questionmark" :ach-tooltip="questionmarkTooltip">?</div>
        Automatic Glyph Arrangement:
      </div>
      <button-cycle
        v-model="autoSort"
        class="c-glyph-inventory-option"
        text="Auto-sort Mode:"
        :labels="sortModes"
      />
      <button-on-off
        v-model="autoCollapse"
        class="c-glyph-inventory-option"
        text="Auto-collapse space:"
      />
      <button-on-off
        v-if="showAutoAutoClean"
        v-model="autoAutoClean"
        class="c-glyph-inventory-option"
        text="Auto Purge on Realities:"
      />
    </div>`
});
