"use strict";

Vue.component("glyph-set-saves", {
  data() {
    return {
      hasEquipped: true,
      glyphSets: [],
    };
  },
  computed: {
    questionmarkTooltip() {
      return `Save copies your current glyphs. Delete clears the set for a new save. Load finds the glyphs in your
      inventory and equips them, but only if you have no glyphs equipped. `;
    }
  },
  methods: {
    update() {
      this.glyphSets = player.reality.glyphs.sets.map(g => Glyphs.copyForRecords(g));
      this.hasEquipped = Glyphs.activeList.length > 0;
    },
    saveGlyphSet(set, id) {
      if (!this.hasEquipped || set.length) return;
      player.reality.glyphs.sets[id] = Glyphs.active.filter(g => g !== null);
    },
    loadGlyphSet(set, id) {
      if (this.hasEquipped || !set.length) return;
      const useLevel = player.options.loadGlyphLevel;
      const useStrength = !Ra.has(RA_UNLOCKS.MAX_RARITY_AND_SHARD_SACRIFICE_BOOST) && player.options.loadGlyphStrength;
      for (let i = 0; i < set.length; i++) {
        const glyph = Glyphs.findByValues(set[i], useLevel, useStrength);
        if (!glyph) {
          GameUI.notify.error(`Could not load Glyph Set ${id} due to missing glyph!`);
          return;
        }
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
    },
    deleteGlyphSet(set, id) {
      if (!set.length) return;
      player.reality.glyphs.sets[id] = [];
    },
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
      <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
        <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
      </div>
      <div v-for="(set, id) in glyphSets">
        <div>
          <glyph-set-preview
            :show=true
            :glyphs="set"
            style="height: 5rem" />
        </div>
        <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                :class="{'c-reality-upgrade-btn--unavailable': !hasEquipped || set.length}"
                @click="saveGlyphSet(set, id)"
        >Save</button>
        <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                :class="{'c-reality-upgrade-btn--unavailable': !set.length}"
                @click="deleteGlyphSet(set, id)"
        >Delete</button>
        <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                :class="{'c-reality-upgrade-btn--unavailable': hasEquipped || !set.length}"
                @click="loadGlyphSet(set, id)"
        >Load</button>
      </div>
    </div>`,
});
