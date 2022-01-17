<script>
import GlyphSetName from "@/components/GlyphSetName";
import ModalWrapper from "@/components/modals/ModalWrapper";
import GlyphShowcasePanelEntry from "@/components/modals/GlyphShowcasePanelEntry";

export default {
  name: "GlyphShowcasePanelModal",
  components: {
    GlyphSetName,
    ModalWrapper,
    GlyphShowcasePanelEntry,
  },
  props: {
    modalConfig: {
      type: Object,
      required: true,
      name: String,
      glyphSet: Array,
      closeOn: String,
      isGlyphSelection: Boolean,
      showSetName: Boolean,
      displaySacrifice: Boolean,
    }
  },
  data() {
    return {
      glyphs: [],
      gainedLevel: 0,
      canSacrifice: false,
      realityGlyphBoost: 0,
    };
  },
  computed: {
    isGlyphSelection() {
      return this.modalConfig.isGlyphSelection;
    },
    maxGlyphEffects() {
      let maxEffects = 1;
      for (const glyph of this.glyphs) {
        maxEffects = Math.max(getGlyphEffectsFromBitmask(glyph.effects).filter(e => e.isGenerated).length, maxEffects);
      }
      return maxEffects;
    },
  },
  created() {
    this.on$(this.modalConfig.closeOn, this.emitClose);
  },
  methods: {
    update() {
      this.glyphs = this.isGlyphSelection
        ? GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false })
        : this.modalConfig.glyphSet.filter(x => x);
      this.gainedLevel = gainedGlyphLevel().actualLevel;
      // There should only be one reality glyph; this picks one pseudo-randomly if multiple are cheated/glitched in
      const realityGlyph = this.glyphs.filter(g => g.type === "reality")[0];
      this.realityGlyphBoost = realityGlyph
        ? GameDatabase.reality.glyphEffects.realityglyphlevel.effect(realityGlyph.level)
        : 0;
    },
  },
};
</script>

<template>
  <ModalWrapper
    @close="emitClose"
  >
    <template #header>
      {{ modalConfig.name }}
    </template>
    <div v-if="isGlyphSelection">
      Projected Glyph Level: {{ formatInt(gainedLevel) }}
    </div>
    <GlyphSetName
      v-if="modalConfig.showSetName"
      :glyph-set="glyphs"
      :force-color="true"
    />
    <div class="c-glyph-choice-container">
      <GlyphShowcasePanelEntry
        v-for="(glyph, idx) in glyphs"
        :key="idx"
        class="c-glyph-choice-single-glyph"
        :idx="idx"
        :glyph="glyph"
        :show-level="!isGlyphSelection"
        :reality-glyph-boost="realityGlyphBoost"
        :max-glyph-effects="maxGlyphEffects"
        :show-sacrifice="modalConfig.displaySacrifice"
      />
    </div>
  </ModalWrapper>
</template>
