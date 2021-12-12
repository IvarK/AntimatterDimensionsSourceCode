import "./glyph-set-name.js";
import GlyphComponent from "@/components/GlyphComponent";

Vue.component("glyph-set-preview", {
  components: {
    GlyphComponent
  },
  props: {
    show: Boolean,
    text: String,
    textHidden: Boolean,
    glyphs: Array,
    ignoreModifiedLevel: Boolean,
    flipTooltip: Boolean,
    isInModal: Boolean,
    showName: {
      type: Boolean,
      default: true,
    },
    forceNameColor: {
      type: Boolean,
      default: true,
    },
    showSacrifice: {
      type: Boolean,
      default: false
    },
    noneText: {
      type: String,
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
  },
  template: `
    <div v-if="show">
      <span v-if="text && !textHidden">
        {{ text }}
        <br>
      </span>
      <span v-if="glyphs.length !== 0" @click="showModal">
        <glyph-set-name
          v-if="showName"
          :glyphSet="glyphs"
          :forceColor="forceNameColor"
        />
        <GlyphComponent
          v-for="(g, idx) in glyphs"
          :key="idx"
          style="margin: 0.2rem;"
          :glyph="g"
          :showSacrifice="showSacrifice"
          :draggable="false"
          :circular="true"
          :ignoreModifiedLevel="ignoreModifiedLevel"
          :realityGlyphBoost="realityGlyphBoost"
          :flipTooltip="flipTooltip"
          :isInModal="isInModal"
          size="2.8rem"
          :textProportion="0.6"
          glowBlur="0.2rem"
          glowSpread="0.1rem"
          bottomPadding="0.4rem"
        />
      </span>
      <span v-else>
        {{ noneText }}
      </span>
    </div>`
});
