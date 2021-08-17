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
      const alteredValue = dbEntry.conversion
        ? dbEntry.formatSecondaryEffect(dbEntry.conversion(value))
        : "";
      return `${rawDesc}`
        .replace("{value}", dbEntry.formatEffect(value))
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
    styleObject(glyph) {
      const effectCount = this.glyphEffectList(glyph).length;
      return {
        "grid-column": "span 3",
        "font-size": `${effectCount > 4 ? 1 : 1.3}rem`
      };
    },
  },
  template: `
    <div>
      <h3>Potential Glyphs for this Reality</h3>
      Projected Glyph Level: {{ formatInt(level) }}
      <br>
      <br>
      <div class="c-glyph-choice-container">
        <div
          v-for="(g, idx) in glyphs"
          class="c-glyph-choice"
        >
          <glyph-component
            :key="idx"
            style="margin: 0.1rem;"
            :glyph="g"
            :showSacrifice="canSacrifice"
            :draggable="false"
            :circular="true"
            :ignoreModifiedLevel="true"
            :isInModal="true"
            size="5rem"
            :textProportion="0.5"
            glowBlur="0.4rem"
            glowSpread="0.1rem"
          />
          <div>
            Rarity:
            <br>
            {{ formatPercents(getRarityValue(g.strength), 1) }}
          </div>
          <div :style="styleObject(g)">
            <div v-for="effectText in glyphEffectList(g)">
              {{ effectText }}
            </div>
          </div>
        </div>
      </div>
    </div>`
});
