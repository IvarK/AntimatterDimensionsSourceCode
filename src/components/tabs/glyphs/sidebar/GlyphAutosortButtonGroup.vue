<script>
import ButtonCycle from "@/components/ButtonCycle";
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphAutosortButtonGroup",
  components: {
    ToggleButton,
    ButtonCycle
  },
  data() {
    return {
      autoSort: 0,
      showScoreFilter: false,
      autoCollapse: false,
      showAutoAutoClean: false,
      autoAutoClean: false,
      applyFilterToPurge: false,
    };
  },
  computed: {
    sortModes() {
      // These are the keys for AUTO_SORT_MODE, with SCORE only added conditionally if unlocked
      const availableSortModes = ["NONE", "LEVEL", "POWER", "EFFECT"];
      if (this.showScoreFilter) availableSortModes.push("SCORE");
      return availableSortModes;
    },
    questionMarkTooltip() {
      return `The automatic settings below will apply after every Reality`;
    },
    keepTooltip() {
      return "If set to ON, Glyphs which your filter accepts will never be auto-purged even if they are worse";
    }
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
    },
    applyFilterToPurge(newValue) {
      player.reality.applyFilterToPurge = newValue;
    },
  },
  methods: {
    update() {
      this.autoSort = player.reality.autoSort;
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.autoCollapse = player.reality.autoCollapse;
      this.showAutoAutoClean = VUnlocks.autoAutoClean.canBeApplied;
      this.autoAutoClean = player.reality.autoAutoClean;
      this.applyFilterToPurge = player.reality.applyFilterToPurge;
    },
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      <div
        v-tooltip="questionMarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
      Auto Glyph Arrangement:
    </div>
    <ButtonCycle
      v-model="autoSort"
      class="c-glyph-inventory-option"
      text="Auto-sort Mode:"
      :labels="sortModes"
    />
    <ToggleButton
      v-model="autoCollapse"
      class="c-glyph-inventory-option"
      label="Auto-collapse space:"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="autoAutoClean"
      class="c-glyph-inventory-option"
      label="Auto-purge on Realities:"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="applyFilterToPurge"
      class="c-glyph-inventory-option"
      label="Never Auto-purge Glyphs accepted by filter:"
      tooltip-class="c-glyph-inventory-option__tooltip"
      :tooltip-content="keepTooltip"
    />
  </div>
</template>

<style scoped>

</style>
