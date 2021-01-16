"use strict";

Vue.component("current-glyph-effects", {
  components: {
    "current-effect": {
      props: {
        effect: Object,
      },
      data() {
        return {
          notColored: true,
        };
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
        textColor() {
          if (this.notColored) return { };
          const glyphName = this.effectConfig.id === "timeshardpow"
          ? GlyphTypes.time
          : GlyphTypes[this.effectConfig.glyphTypes];
          return {
            color: glyphName.id === "cursed" ? "#5151ec" : glyphName.color,
            "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${glyphName.color}`,
            animation: glyphName.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
          };
        },
        valueClass() {
          return this.effect.value.capped ? "c-current-glyph-effects__effect--capped" : "";
        }
      },
      methods: {
        update() {
          this.notColored = player.options.glyphTextColors;
        },
      },
      template: `
        <div>
          <span :style="textColor" :class="valueClass">{{formatValue}}</span>
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
    },
    glyphSet() {
      return Glyphs.activeList;
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
    <div class="c-current-glyph-effects__header">
      Currently active glyph effects:
    </div>
    <glyph-set-name :glyphSet="glyphSet" />
    <br>
    <div v-if="isSoftcapActive" class="l-current-glyph-effects__capped-header">
      <span class="c-current-glyph-effects__effect--capped">Colored</span> effects have been slightly reduced
      due to a softcap
    </div>
    <div v-if="noEffects">
      None (equip Glyphs to get their effects)
    </div>
    <current-effect v-for="effect in effects" :key="effect.id" :effect="effect"/>
  </div>`,
});
