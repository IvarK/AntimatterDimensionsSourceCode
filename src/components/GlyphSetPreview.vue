<script>
import GlyphComponent from "@/components/GlyphComponent";
import GlyphSetName from "@/components/GlyphSetName";

export default {
  name: "GlyphSetPreview",
  components: {
    GlyphComponent,
    GlyphSetName
  },
  props: {
    text: {
      type: String,
      required: false,
      default: ""
    },
    textHidden: {
      type: Boolean,
      required: false,
      default: false
    },
    glyphs: {
      type: Array,
      required: true
    },
    ignoreModifiedLevel: {
      type: Boolean,
      required: false,
      default: false
    },
    flipTooltip: {
      type: Boolean,
      required: false,
      default: false
    },
    isInModal: {
      type: Boolean,
      required: false,
      default: false
    },
    showName: {
      type: Boolean,
      required: false,
      default: true
    },
    forceNameColor: {
      type: Boolean,
      required: false,
      default: true
    },
    showSacrifice: {
      type: Boolean,
      required: false,
      default: false
    },
    noneText: {
      type: String,
      required: false,
      default: "(No Glyphs equipped)"
    }
  },
  data() {
    return {
      realityGlyphBoost: 0,
    };
  },
  methods: {
    update() {
      // There should only be one reality glyph; this picks one pseudo-randomly if multiple are cheated/glitched in
      const realityGlyph = this.glyphs.filter(g => g.type === "reality")[0];
      this.realityGlyphBoost = realityGlyph
        ? GameDatabase.reality.glyphEffects.realityglyphlevel.effect(realityGlyph.level)
        : 0;
    },
    showModal() {
      if (this.isInModal) return;
      Modal.glyphShowcasePanel.show({
        name: this.text,
        glyphSet: this.glyphs,
        closeOn: GAME_EVENT.GLYPH_SET_SAVE_CHANGE,
        isGlyphSelection: false,
        showSetName: true,
        displaySacrifice: this.showSacrifice,
      });
    }
  }
};
</script>

<template>
  <div>
    <span v-if="text && !textHidden">
      {{ text }}
      <br>
    </span>
    <span
      v-if="glyphs.length !== 0"
      class="l-glyph-set-preview"
      @click="showModal"
    >
      <GlyphSetName
        v-if="showName"
        :glyph-set="glyphs"
        :force-color="forceNameColor"
      />
      <GlyphComponent
        v-for="(g, idx) in glyphs"
        :key="idx"
        style="margin: 0.2rem;"
        :glyph="g"
        :show-sacrifice="showSacrifice"
        :draggable="false"
        :circular="true"
        :ignore-modified-level="ignoreModifiedLevel"
        :reality-glyph-boost="realityGlyphBoost"
        :flip-tooltip="flipTooltip"
        :is-in-modal="isInModal"
        size="2.8rem"
        :text-proportion="0.6"
        glow-blur="0.2rem"
        glow-spread="0.1rem"
        bottom-padding="0.4rem"
      />
    </span>
    <span v-else>
      {{ noneText }}
    </span>
  </div>
</template>
