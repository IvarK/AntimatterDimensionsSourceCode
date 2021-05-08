"use strict";

Vue.component("glyph-set-saves", {
  data() {
    return {
      hasEquipped: true,
      glyphSets: [],
      rarity: false,
      level: false,
    };
  },
  computed: {
    questionmarkTooltip() {
      return `Save copies your current Glyphs. Delete clears the set for a new save. Load searches through your
      inventory, and equips the best Glyph matching its search.
      You can only load a set when you have no Glyphs equipped.`;
    },
    noSet() {
      return `No Set Saved`;
    },
  },
  watch: {
    rarity(newValue) {
      player.options.ignoreGlyphRarity = newValue;
    },
    level(newValue) {
      player.options.ignoreGlyphLevel = newValue;
    },
  },
  methods: {
    update() {
      this.hasEquipped = Glyphs.activeList.length > 0;
      this.rarity = player.options.ignoreGlyphRarity;
      this.level = player.options.ignoreGlyphLevel;
    },
    refreshGlyphSets() {
      this.glyphSets = player.reality.glyphs.sets.map(g => Glyphs.copyForRecords(g));
    },
    saveGlyphSet(id) {
      if (!this.hasEquipped || player.reality.glyphs.sets[id].length) return;
      player.reality.glyphs.sets[id] = Glyphs.active.filter(g => g !== null);
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    loadGlyphSet(set) {
      if (this.hasEquipped || !set.length) return;
      for (let i = 0; i < set.length; i++) {
        const glyph = Glyphs.findByValues(set[i], this.level, this.rarity);
        if (!glyph) {
          GameUI.notify.error(`Could not fully load the Glyph Set due to missing Glyph!`);
          continue;
        }
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    deleteGlyphSet(id) {
      if (!player.reality.glyphs.sets[id].length) return;
      player.reality.glyphs.sets[id] = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_SET_SAVE_CHANGE, this.refreshGlyphSets);
    this.refreshGlyphSets();
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
      <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
        <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
      </div>
      When searching for Glyphs to load, check:
      <div>
        Type: Always
        <br>
        Effects: Always
        <br>
        <primary-button-on-off-custom
          class="o-primary-btn--reality-upgrade-toggle"
          v-model="level"
          on="Level: Disabled"
          off="Level: Enabled"
        />
        <br>
        <primary-button-on-off-custom
          class="o-primary-btn--reality-upgrade-toggle"
          v-model="rarity"
          on="Rarity: Disabled"
          off="Rarity: Enabled"
        />
      </div>
      <div v-for="(set, id) in glyphSets">
        <div>
          <glyph-set-preview
            class="l-glyph-set-save-spacing"
            :show=true
            :glyphs="set"
            :flipTooltip=true
            :noneText=noSet />
        </div>
        <div class="l-glyph-set-save-button-spacing">
          <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                  :class="{'c-reality-upgrade-btn--unavailable': !hasEquipped || set.length}"
                  @click="saveGlyphSet(id)"
          >Save</button>
          <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                  :class="{'c-reality-upgrade-btn--unavailable': !set.length}"
                  @click="deleteGlyphSet(id)"
          >Delete</button>
          <button class="c-reality-upgrade-btn c-glyph-set-save-button"
                  :class="{'c-reality-upgrade-btn--unavailable': hasEquipped || !set.length}"
                  @click="loadGlyphSet(set)"
          >Load</button>
        </div>
      </div>
    </div>`,
});
