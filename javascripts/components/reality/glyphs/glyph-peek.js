"use strict";

Vue.component("glyph-peek", {
  data() {
    return {
      glyphs: [],
      level: 0,
      canPeek: false,
      isVisible: false,
      canRefresh: false
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
      this.canPeek = Perk.glyphPeek1.isBought;
      this.isVisible = (Perk.glyphPeek1.isBought && TimeStudy.reality.isBought) || Perk.glyphPeek2.isBought;
      if (this.canRefresh && gainedGlyphLevel().actualLevel !== this.level) {
        this.refreshGlyphs();
      }
    },
    refreshGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), false);
      this.level = gainedGlyphLevel().actualLevel;
    },
  },
  template: `
  <glyph-set-preview v-if="isVisible"
    class="c-glyph-peek"
    :show="isVisible"
    :text="'Glyph choices for this Reality:'"
    :glyphs="glyphs"
    :noLevelOverride="true"
    :flipTooltip="true"/>
  <span v-else-if="canPeek"
    class="c-glyph-peek">
      Purchase the Reality study to see
      <br>
      this Reality's glyph choices
  </span>
  `,
});
