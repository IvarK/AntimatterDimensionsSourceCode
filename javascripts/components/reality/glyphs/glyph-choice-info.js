"use strict";

Vue.component("modal-glyph-choice-info", {
  data() {
    return {
      glyphs: [],
      level: 0,
      canPeek: false,
      isVisible: false,
      canRefresh: false,
      canSacrifice: false,
    };
  },
  created() {
    // This refreshes the glyphs shown after every reality, and also doesn't
    // allow it to refresh if you're choosing glyphs (at that point,
    // your choices are your choices). This is technically incorrect since
    // while you're choosing glyphs the level might increase, and this code
    // stops it from increasing in the glyphs shown here, but with
    // the glyph choice popup open, you can't see the tooltips, so there's
    // no way for the player to notice that.
    this.on$(GAME_EVENT.GLYPH_CHOICES_GENERATED, () => {
      this.canRefresh = false;
    });
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.refreshGlyphs);
    this.refreshGlyphs();
  },
  methods: {
    update() {
      this.canSacrifice = GlyphSacrificeHandler.canSacrifice;
      // Hide this before first reality since then it'll confuse the player,
      // and due to pre-selected first glyph might well be incorrect anyway.
      this.isVisible = PlayerProgress.realityUnlocked() && TimeStudy.reality.isBought;
      this.canPeek = PlayerProgress.realityUnlocked();
      if (this.canRefresh && gainedGlyphLevel().actualLevel !== this.level) {
        this.refreshGlyphs();
      }
    },
    capitalize(str) {
      return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    },
    refreshGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
      this.level = gainedGlyphLevel().actualLevel;
    },
    getRarityValue(str) {
      return strengthToRarity(str) / 100;
    },
    formatEffectString(dbEntry, value) {
      const rawDesc = typeof dbEntry.shortDesc === "function"
        ? dbEntry.shortDesc()
        : dbEntry.shortDesc;
      const singleValue = dbEntry.formatSingleEffect
        ? dbEntry.formatSingleEffect(value)
        : dbEntry.formatEffect(value);
      const alteredValue = dbEntry.conversion
        ? dbEntry.formatSecondaryEffect(dbEntry.conversion(value))
        : "";
      return `${rawDesc}`
        .replace("{value}", singleValue)
        .replace("{value2}", alteredValue);
    },
    glyphEffectList(glyph) {
      const db = GameDatabase.reality.glyphEffects;
      const effects = getGlyphEffectValuesFromBitmask(glyph.effects, this.level, glyph.strength);
      const effectStrings = effects
        .map(e => this.formatEffectString(db[e.id], e.value));
      // Filter out undefined results since shortDesc only exists for generated effects
      return effectStrings.filter(s => s !== "undefined");
    },
    typeStyle(glyph) {
      return {
        "color": `${GlyphTypes[glyph.type].color}`,
        "font-weight": "bold"
      };
    },
    rarityStyle(glyph) {
      return {
        "color": `${getRarity(glyph.strength).color}`,
        "font-weight": "bold"
      };
    },
    effectStyle(glyph) {
      return {
        "font-size": `${glyph.type === "effarig" ? 1 : 1.2}rem`,
      };
    },
  },
  template: `
    <div style="background-color: inherit;">
      <modal-close-button @click="emitClose" />
      <h3>Potential Glyphs for this Reality</h3>
      Projected Glyph Level: {{ formatInt(level) }}
      <br>
      <br>
      <div class="c-glyph-choice-container">
        <div
          v-for="(g, idx) in glyphs"
          class="c-glyph-choice-single-glyph"
        >
          <div class="c-glyph-choice-icon">
            <div :style="typeStyle(g)">
              {{ capitalize(g.type) }}
            </div>
            <glyph-component
              :key="idx"
              style="margin: 0.1rem;"
              :glyph="g"
              :showSacrifice="canSacrifice"
              :draggable="false"
              :circular="true"
              :ignoreModifiedLevel="true"
              :isInModal="true"
              size="4rem"
              :textProportion="0.5"
              glowBlur="0.4rem"
              glowSpread="0.1rem"
            />
            <div :style="rarityStyle(g)">
              {{ formatPercents(getRarityValue(g.strength), 1) }}
            </div>
          </div>
          <div
            class="c-glyph-choice-effect-list"
            :style="effectStyle(g)"
          >
            <div v-for="effectText in glyphEffectList(g)">
              {{ effectText }}
            </div>
          </div>
        </div>
      </div>
    </div>`
});
