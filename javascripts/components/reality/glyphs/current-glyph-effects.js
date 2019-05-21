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
          return this.effectConfig.formatEffect(this.effect.value.value);
        },
        valueClass() {
          return this.effect.value.capped ? "c-current-glyph-effects__effect--capped" : "";
        }
      },
      template: `
        <div>
          {{effectConfig.totalDescSplit[0]}}
          <span :class="valueClass">{{formatValue}}</span>
          {{effectConfig.totalDescSplit[1]}}
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
    this.on$(GameEvent.GLYPHS_CHANGED, this.glyphsChanged);
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
      Currently active glyph effects:
    </div>
    <div v-if="isSoftcapActive" class="l-current-glyph-effects__capped-header">
      <span class="c-current-glyph-effects__effect--capped">Colored</span> numbers have a reduced effect
    </div>
    <div v-if="noEffects">
      None (equip glyphs to get their effects)
    </div>
    <current-effect v-for="effect in effects" :key="effect.id" :effect="effect"/>
  </div>`,
});