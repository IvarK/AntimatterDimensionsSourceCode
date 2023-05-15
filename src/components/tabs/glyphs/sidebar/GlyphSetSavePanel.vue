<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";
import ToggleButton from "@/components/ToggleButton";

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
      names: [],
      effects: false,
      rarity: false,
      level: false,
    };
  },
  computed: {
    questionmarkTooltip() {
      return `Glyph Presets work like Time Study Loadouts, allowing you to equip a
        full set of previously-saved Glyphs`;
    },
    noSet() {
      return `No Glyph Preset saved in this slot`;
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
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.refreshGlyphSets);
    this.on$(GAME_EVENT.GLYPH_SET_SAVE_CHANGE, this.refreshGlyphSets);
    this.refreshGlyphSets();
    for (let i = 0; i < player.reality.glyphs.sets.length; i++) {
      this.names[i] = player.reality.glyphs.sets[i].name;
    }
  },
  methods: {
    update() {
      this.hasEquipped = Glyphs.activeList.length > 0;
      this.effects = player.options.ignoreGlyphEffects;
      this.rarity = player.options.ignoreGlyphRarity;
      this.level = player.options.ignoreGlyphLevel;
    },
    refreshGlyphSets() {
      this.glyphSets = player.reality.glyphs.sets.map(g => Glyphs.copyForRecords(g.glyphs));
    },
    setName(id) {
      const name = this.names[id] === "" ? "" : `: ${this.names[id]}`;
      return `Glyph Preset #${id + 1}${name}`;
    },
    // Let the player load if the currently equipped glyphs are a subset of the preset
    canLoadSet(set) {
      let toLoad = [...set];
      let currActive = [...Glyphs.active.filter(g => g)];
      for (const targetGlyph of currActive) {
        const matchingGlyph = Glyphs.findByValues(targetGlyph, toLoad, {
          level: this.level ? -1 : 0,
          strength: this.rarity ? -1 : 0,
          effects: this.effects ? -1 : 0
        });
        if (!matchingGlyph) return false;
        toLoad = toLoad.filter(g => g !== matchingGlyph);
        currActive = currActive.filter(g => g !== targetGlyph);
      }
      return toLoad.length > 0;
    },
    saveGlyphSet(id) {
      if (!this.hasEquipped || player.reality.glyphs.sets[id].glyphs.length) return;
      player.reality.glyphs.sets[id].glyphs = Glyphs.active.compact();
      this.refreshGlyphSets();
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    loadGlyphSet(set) {
      if (!this.canLoadSet(set) || !this.setLengthValid(set)) return;

      // If we already have a subset of the preset loaded, don't try to load glyphs from that subset again
      let toLoad = [...set];
      let currActive = [...Glyphs.active.filter(g => g)];
      for (const targetGlyph of currActive) {
        const matchingGlyph = Glyphs.findByValues(targetGlyph, toLoad, {
          level: this.level ? -1 : 0,
          strength: this.rarity ? -1 : 0,
          effects: this.effects ? -1 : 0
        });
        if (!matchingGlyph) continue;
        toLoad = toLoad.filter(g => g !== matchingGlyph);
        currActive = currActive.filter(g => g !== targetGlyph);
      }

      // Try to load the rest from the inventory
      let missingGlyphs = 0;
      for (const targetGlyph of toLoad) {
        const matchingGlyph = Glyphs.findByValues(targetGlyph, Glyphs.sortedInventoryList, {
          level: this.level ? 1 : 0,
          strength: this.rarity ? 1 : 0,
          effects: this.effects ? 1 : 0
        });
        if (!matchingGlyph) {
          missingGlyphs++;
          continue;
        }
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(matchingGlyph, idx);
      }
      if (missingGlyphs) {
        GameUI.notify.error(`Could not find ${missingGlyphs} ${pluralize("Glyph", missingGlyphs)} to load from
          Glyph preset.`);
      }
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    deleteGlyphSet(id) {
      if (!player.reality.glyphs.sets[id].glyphs.length) return;
      if (player.options.confirmations.deleteGlyphSetSave) Modal.glyphSetSaveDelete.show({ glyphSetId: id });
      else {
        player.reality.glyphs.sets[id].glyphs = [];
        this.refreshGlyphSets();
        EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
      }
    },
    nicknameBlur(event) {
      player.reality.glyphs.sets[event.target.id].name = event.target.value.slice(0, 20);
      this.names[event.target.id] = player.reality.glyphs.sets[event.target.id].name;
      this.refreshGlyphSets();
    },
    setLengthValid(set) {
      return set.length && set.length <= Glyphs.activeSlotCount;
    },
    glyphSetKey(set, index) {
      return `${index} ${Glyphs.hash(set)}`;
    }
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
      When loading a preset, try to match the following attributes. "Exact" will only equip Glyphs
      identical to the ones in the preset. The other settings will, loosely speaking, allow "better" Glyphs to be
      equipped in their place.
    </div>
    <div class="c-glyph-set-save-container">
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
    <div
      v-for="(set, id) in glyphSets"
      :key="id"
      class="c-glyph-single-set-save"
    >
      <div class="c-glyph-set-preview-area">
        <GlyphSetPreview
          :key="glyphSetKey(set, id)"
          :text="setName(id)"
          :text-hidden="true"
          :glyphs="set"
          :flip-tooltip="true"
          :none-text="noSet"
        />
      </div>
      <div class="c-glyph-single-set-save-flexbox">
        <div ach-tooltip="Set a custom name (up to 20 characters)">
          <input
            :id="id"
            type="text"
            size="20"
            maxlength="20"
            placeholder="Custom set name"
            class="c-glyph-sets-save-name__input"
            :value="names[id]"
            @blur="nicknameBlur"
          >
        </div>
        <div class="c-glyph-single-set-save-flexbox-buttons">
          <button
            class="c-glyph-set-save-button"
            :class="{'c-glyph-set-save-button--unavailable': !hasEquipped || set.length}"
            @click="saveGlyphSet(id)"
          >
            Save
          </button>
          <button
            class="c-glyph-set-save-button"
            :class="{'c-glyph-set-save-button--unavailable': !canLoadSet(set) || !setLengthValid(set)}"
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
    </div>
  </div>
</template>

<style scoped>
.c-glyph-set-save-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin: 1rem auto 0;
}

.c-glyph-single-set-save-flexbox {
  width: 17rem;
}

.c-glyph-set-preview-area {
  width: 18rem;
}

.l-glyph-sacrifice-options__help {
  position: absolute;
  top: 0;
  left: calc(100% - 1.8rem);
  z-index: 2;
}

.c-glyph-sacrifice-options__help {
  font-size: 1.2rem;
  color: var(--color-reality-dark);
}

.s-base--dark .c-glyph-sacrifice-options__help {
  color: var(--color-reality-light);
}
</style>
