import ToggleButton from "@/components/ToggleButton";
import GlyphSetPreview from "@/components/GlyphSetPreview";

Vue.component("glyph-set-save-panel", {
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
    for (let i = 0; i < player.reality.glyphs.sets.length; i++) {
      this.names[i] = player.reality.glyphs.sets[i].name;
    }
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
  methods: {
    update() {
      this.hasEquipped = Glyphs.activeList.length > 0;
      this.effects = player.options.ignoreGlyphEffects;
      this.rarity = player.options.ignoreGlyphRarity;
      this.level = player.options.ignoreGlyphLevel;
    },
    refreshGlyphSets() {
      this.glyphSets = player.reality.glyphs.sets.map(g => Glyphs.copyForRecords(g.glyphs.glyphs));
    },
    setName(id) {
      const name = this.names[id] === "" ? "" : `: ${this.names[id]}`;
      return `Glyph Set Save #${id + 1}${name}`;
    },
    saveGlyphSet(id) {
      if (!this.hasEquipped || player.reality.glyphs.sets[id].glyphs.length) return;
      player.reality.glyphs.sets[id].glyphs = Glyphs.active.compact();
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
      if (!player.reality.glyphs.sets[id].glyphs.length) return;
      if (player.options.confirmations.deleteGlyphSetSave) Modal.glyphSetSaveDelete.show({ glyphSetId: id });
      else {
        player.reality.glyphs.sets[id].glyphs = [];
        EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
      }
    },
    nicknameBlur(event) {
      player.reality.glyphs.sets[event.target.id].name = event.target.value.slice(0, 20);
      this.names[event.target.id] = player.reality.glyphs.sets[event.target.id].name;
      this.refreshGlyphSets();
    },
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
      <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
        <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
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
          class="c-glyph-set-save-setting-button"
          v-model="effects"
          label="Effects:"
          on="Including"
          off="Exact"
        />
        <ToggleButton
          class="c-glyph-set-save-setting-button"
          v-model="level"
          label="Level:"
          on="Increased"
          off="Exact"
        />
        <ToggleButton
          class="c-glyph-set-save-setting-button"
          v-model="rarity"
          label="Rarity:"
          on="Increased"
          off="Exact"
        />
      </div>
      Your saved Glyph sets:
      <div class="c-glyph-single-set-save" v-for="(set, id) in glyphSets">
        <div style="width: 18rem">
          <GlyphSetPreview
            :text="setName(id)"
            :textHidden=true
            :glyphs="set"
            :flipTooltip=true
            :noneText=noSet
          />
        </div>
        <div class="c-glyph-single-set-save-flexbox" style="width: 22rem">
          <div ach-tooltip="Set a custom name (up to 20 characters)">
            <input
              type="text"
              size="20"
              maxlength="20"
              placeholder="Custom set name"
              class="c-glyph-sets-save-name__input"
              :value="names[id]"
              :id="id"
              @blur="nicknameBlur"
            />
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
      </div>
    </div>`
});
