"use strict";

Vue.component("glyph-peek", {
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
  },
  template: `
    <glyph-set-preview
      v-if="isVisible"
      class="c-glyph-peek"
      :show="isVisible"
      :showName="false"
      :text="'Upcoming glyph selection:'"
      :glyphs="glyphs"
      :noLevelOverride="true"
      :showSacrifice="canSacrifice"
      :flipTooltip="true"
    />
    <span
      v-else-if="canPeek"
      class="c-glyph-peek"
    >
      Purchase the Reality study to see
      <br>
      this Reality's glyph choices
    </span>`
});
