<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphPeek",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      glyphs: [],
      level: 0,
      canPeek: false,
      isVisible: false,
      canSacrifice: false,
    };
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.refreshGlyphs);
    this.refreshGlyphs();
  },
  methods: {
    update() {
      this.canSacrifice = GlyphSacrificeHandler.canSacrifice;
      // Hide this before first reality since then it'll confuse the player,
      // and due to pre-selected first glyph might well be incorrect anyway.
      this.isVisible = !Pelle.isDoomed && PlayerProgress.realityUnlocked();
      this.canPeek = TimeStudy.reality.isBought;
      if (gainedGlyphLevel().actualLevel !== this.level) {
        this.refreshGlyphs();
      }
    },
    refreshGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
      for (const glyph of this.glyphs) Glyphs.applyGamespeed(glyph);
      this.level = gainedGlyphLevel().actualLevel;
    },
    showModal() {
      Modal.glyphShowcasePanel.show({
        name: "Potential Glyphs for this Reality",
        glyphSet: this.glyphs,
        closeEvent: GAME_EVENT.REALITY_RESET_AFTER,
        isGlyphSelection: true,
        showSetName: false,
      });
    }
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    class="c-glyph-peek"
  >
    <div
      v-if="canPeek"
      class="l-glyph-set-preview"
      @click="showModal"
    >
      <GlyphSetPreview
        :show-name="false"
        :text="'Upcoming Glyph selection:'"
        :glyphs="glyphs"
        :ignore-modified-level="true"
        :show-sacrifice="canSacrifice"
        :flip-tooltip="true"
        :sort="false"
      />
      (Click to bring up details)
    </div>
    <div v-else>
      Purchase the Reality study to see
      <br>
      this Reality's Glyph choices
    </div>
  </div>
</template>

<style scoped>

</style>
