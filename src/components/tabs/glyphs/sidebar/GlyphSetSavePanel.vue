<script>
import ToggleButton from "@/components/ToggleButton";
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetSavePanel",
  components: {
    ToggleButton,
    GlyphSetPreview
  },
  data() {
    return {
      hasEquipped: true,
      glyphSets: [],
      effects: false,
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
      return `No Glyph Set saved in this slot`;
    },
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
  }
};
</script>

<template>
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
      <div
        v-tooltip="questionmarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
    </div>
    <div class="l-glyph-set-save__header">
      When searching for Glyphs to load, try to match the following. "Exact" will only count Glyphs
      with identical properties to be part of the set. The other settings will, loosely speaking, allow
      for "better" Glyphs to match as well.
    </div>
    <div class="c-glyph-set-save-container">
      <!-- Clicking this intentionally does nothing, but we want consistent visual styling -->
      <button class="c-glyph-set-save-setting-button c-glyph-set-save-setting-button--disabled">
        Type: Exact (always)
      </button>
      <ToggleButton
        v-model="effects"
        class="c-glyph-set-save-setting-button"
        label="Effects:"
        on="Including"
        off="Exact"
      />
      <ToggleButton
        v-model="level"
        class="c-glyph-set-save-setting-button"
        label="Level:"
        on="Increased"
        off="Exact"
      />
      <ToggleButton
        v-model="rarity"
        class="c-glyph-set-save-setting-button"
        label="Rarity:"
        on="Increased"
        off="Exact"
      />
    </div>
    Your saved Glyph sets:
    <div
      v-for="(set, id) in glyphSets"
      :key="id"
      class="c-glyph-single-set-save"
    >
      <div style="width: 16rem">
        <GlyphSetPreview
          :text="setName(id)"
          :text-hidden="true"
          :glyphs="set"
          :flip-tooltip="true"
          :none-text="noSet"
        />
      </div>
      <button
        class="c-glyph-set-save-button"
        :class="{'c-glyph-set-save-button--unavailable': !hasEquipped || set.length}"
        @click="saveGlyphSet(id)"
      >
        Save
      </button>
      <button
        class="c-glyph-set-save-button"
        :class="{'c-glyph-set-save-button--unavailable': hasEquipped || !set.length}"
        @click="loadGlyphSet(set)"
      >
        Load
      </button>
      <button
        class="c-glyph-set-save-button"
        :class="{'c-glyph-set-save-button--unavailable': !set.length}"
        @click="deleteGlyphSet(id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
