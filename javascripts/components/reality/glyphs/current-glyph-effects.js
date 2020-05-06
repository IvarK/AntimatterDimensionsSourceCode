"use strict";

Vue.component("current-glyph-effects", {
  components: {
    "current-effect": {
      props: {
        effect: Object,
      },
      computed: {
        effectConfig() {
          return GameDatabase.reality.glyphEffects[this.effect.id];
        },
        formatValue() {
          const baseValue = this.effect.value.value;
          const value1 = this.effectConfig.formatEffect(baseValue);
          const value2 = this.effectConfig.conversion === undefined
            ? ""
            : this.effectConfig.formatSecondaryEffect(this.effectConfig.conversion(baseValue));
          const desc = typeof this.effectConfig.totalDesc === "function"
            ? this.effectConfig.totalDesc()
            : this.effectConfig.totalDesc;
          return desc
            .replace("{value}", value1)
            .replace("{value2}", value2);
        },
        valueClass() {
          return this.effect.value.capped ? "c-current-glyph-effects__effect--capped" : "";
        }
      },
      template: `
        <div>
          <span :class="valueClass">{{formatValue}}</span>
        </div>`
    }
  },
  data() {
    return {
      effects: [],
    };
  },
  computed: {
    isSoftcapActive() {
      return this.effects.length && !this.effects.every(e => e.value.capped === false);
    },
    noEffects() {
      return !this.effects.length;
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    glyphsChanged() {
      this.effects = getActiveGlyphEffects();
    }
  },
  template: `
  <div class="c-current-glyph-effects l-current-glyph-effects">
    <div>
      <b>Currently active glyph effects:</b>
    </div>
    <br>
    <div v-if="isSoftcapActive" class="l-current-glyph-effects__capped-header">
      <span class="c-current-glyph-effects__effect--capped">Colored</span> effects have been slightly reduced
      due to a softcap
    </div>
    <div v-if="noEffects">
      None (equip glyphs to get their effects)
    </div>
    <current-effect v-for="effect in effects" :key="effect.id" :effect="effect"/>
  </div>`,
});
