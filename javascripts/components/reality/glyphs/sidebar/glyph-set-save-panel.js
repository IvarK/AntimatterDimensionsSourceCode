"use strict";

Vue.component("glyph-set-save-panel", {
  data() {
    return {
      hasEquipped: true,
      glyphSets: [],
      effects: false,
      rarity: false,
      level: false,
    };
  },
  watch: {
    effects(newValue) {
      player.options.ignoreGlyphEffects = newValue;
    },
    rarity(newValue) {
      player.options.ignoreGlyphRarity = newValue;
    },
    level(newValue) {
      player.options.ignoreGlyphLevel = newValue;
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_SET_SAVE_CHANGE, this.refreshGlyphSets);
    this.refreshGlyphSets();
  },
  computed: {
    questionmarkTooltip() {
      return `Save copies your current Glyphs. Delete clears the set for a new save. Load searches through your
      inventory, and equips the best Glyph matching its search.
      You can only load a set when you have no Glyphs equipped.`;
    },
    noSet() {
      return `No set saved in this slot`;
    },
  },
  methods: {
    update() {
      this.hasEquipped = Glyphs.activeList.length > 0;
      this.effects = player.options.ignoreGlyphEffects;
      this.rarity = player.options.ignoreGlyphRarity;
      this.level = player.options.ignoreGlyphLevel;
    },
    refreshGlyphSets() {
      this.glyphSets = player.reality.glyphs.sets.map(g => Glyphs.copyForRecords(g));
    },
    setName(id) {
      return `Glyph Set Save #${id + 1}`;
    },
    saveGlyphSet(id) {
      if (!this.hasEquipped || player.reality.glyphs.sets[id].length) return;
      player.reality.glyphs.sets[id] = Glyphs.active.filter(g => g !== null);
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    loadGlyphSet(set) {
      if (this.hasEquipped || !set.length) return;
      for (let i = 0; i < set.length; i++) {
        const level = this.level;
        const strength = this.rarity;
        const effects = this.effects;
        const glyph = Glyphs.findByValues(set[i], { level, strength, effects });
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
      if (player.options.confirmations.deleteGlyphSetSave) Modal.glyphSetSaveDelete.show({ glyphSetId: id });
      else {
        player.reality.glyphs.sets[id] = [];
        EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
      }
    },
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
      <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
        <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
      </div>
      When searching for Glyphs to load, check:
      <div class="c-glyph-set-save-container">
        <!-- Clicking this intentionally does nothing, but we want consistent visual styling -->
        <button class="o-primary-btn o-primary-btn--reality-upgrade-toggle c-glyph-set-save-setting-button">
          Type: Always
        </button>
        <primary-button-on-off-custom
          class="o-primary-btn--reality-upgrade-toggle c-glyph-set-save-setting-button"
          v-model="effects"
          on="Effects: Disabled"
          off="Effects: Enabled"
        />
        <primary-button-on-off-custom
          class="o-primary-btn--reality-upgrade-toggle c-glyph-set-save-setting-button"
          v-model="level"
          on="Level: Disabled"
          off="Level: Enabled"
        />
        <primary-button-on-off-custom
          class="o-primary-btn--reality-upgrade-toggle c-glyph-set-save-setting-button"
          v-model="rarity"
          on="Rarity: Disabled"
          off="Rarity: Enabled"
        />
      </div>
      <br>
      Your saved Glyph sets:
      <div class="c-glyph-set-save-container" v-for="(set, id) in glyphSets">
        <div style="width: 16rem">
          <glyph-set-preview
            :text="setName(id)"
            :textHidden=true
            :show=true
            :glyphs="set"
            :flipTooltip=true
            :noneText=noSet
          />
        </div>
        <button
          class="c-reality-upgrade-btn c-glyph-set-save-button"
          :class="{'c-reality-upgrade-btn--unavailable': !hasEquipped || set.length}"
          @click="saveGlyphSet(id)"
        >
          Save
        </button>
        <button
          class="c-reality-upgrade-btn c-glyph-set-save-button"
          :class="{'c-reality-upgrade-btn--unavailable': hasEquipped || !set.length}"
          @click="loadGlyphSet(set)"
        >
          Load
        </button>
        <button
          class="c-reality-upgrade-btn c-glyph-set-save-button"
          :class="{'c-reality-upgrade-btn--unavailable': !set.length}"
          @click="deleteGlyphSet(id)"
        >
          Delete
        </button>
      </div>
    </div>`
});
