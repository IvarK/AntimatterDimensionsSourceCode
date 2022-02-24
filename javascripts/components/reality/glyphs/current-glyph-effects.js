import GlyphSetName from "@/components/GlyphSetName";

Vue.component("current-glyph-effects", {
  components: {
    "current-effect": {
      props: {
        effect: Object,
      },
      data() {
        return {
          isColored: true,
        };
      },
      computed: {
        effectConfig() {
          return GameDatabase.reality.glyphEffects[this.effect.id];
        },
        formatValue() {
          if (Pelle.isDoomed && !Pelle.enabledGlyphEffects.includes(this.effect.id)) return "";
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
          if (!this.isColored) return { };
          const glyphName = this.effectConfig.id === "timeshardpow"
            ? GlyphTypes.time
            : GlyphTypes[this.effectConfig.glyphTypes];

          let glyphColor = glyphName.color;
          if (glyphName.id === "cursed") glyphColor = "#5151ec";
          if (this.effect.value.capped) glyphColor = "";

          return {
            color: glyphColor,
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
          this.isColored = player.options.glyphTextColors;
        },
      },
      template: `
        <div>
          <span :style="textColor" :class="valueClass">{{ formatValue }}</span>
        </div>`
    },
    GlyphSetName
  },
  data() {
    return {
      effects: [],
      hasEffarig: false,
      hasReality: false,
      logGlyphSacrifice: 0,
      pelleChaosEffect: {},
    };
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  computed: {
    isSoftcapActive() {
      return this.effects.length && !this.effects.every(e => e.value.capped === false);
    },
    uniqueGlyphText() {
      if (!this.hasEffarig && !this.hasReality) return "";
      const uniqueGlyphs = [];
      if (this.hasEffarig) uniqueGlyphs.push(`<span style="color: ${GlyphTypes.effarig.color};">Effarig</span>`);
      if (this.hasReality) uniqueGlyphs.push(
        `<span style="animation: a-reality-glyph-description-cycle 10s infinite;">Reality</span>`);
      return `You cannot have more than one ${uniqueGlyphs.join(" or ")}
        Glyph equipped${uniqueGlyphs.length > 1 ? " each." : "."}`;
    },
    noEffects() {
      return !this.effects.length;
    },
    glyphSet() {
      return Glyphs.activeList;
    },
    pelleGlyphText() {
      return Pelle.isDoomed
        ? `Glyph Rarity is set to ${formatPercents(strengthToRarity(Pelle.glyphStrength))}
          and Level is capped at ${formatInt(Pelle.glyphMaxLevel)}`
        : "";
    },
    showChaosText() {
      return this.pelleChaosEffect.isUnlocked && !this.noEffects;
    },
    chaosEffect() {
      return `${this.pelleChaosEffect.description
        .replace("{value}", formatX(this.pelleChaosEffect[Pelle.activeGlyphType], 2))}`;
    },
  },
  watch: {
    logGlyphSacrifice() {
      this.glyphsChanged();
    }
  },
  methods: {
    update() {
      this.hasEffarig = Glyphs.active.some(g => g && g.type === "effarig");
      this.hasReality = Glyphs.active.some(g => g && g.type === "reality");
      this.logGlyphSacrifice = BASIC_GLYPH_TYPES
        .reduce((tot, type) => tot + Math.log10(player.reality.glyphs.sac[type]), 0);
      this.pelleChaosEffect = Pelle.specialGlyphEffect;
    },
    glyphsChanged() {
      this.effects = getActiveGlyphEffects();
    },
  },
  template: `
    <div class="c-current-glyph-effects l-current-glyph-effects">
      <div class="pelle-current-glyph-effects">
        {{ pelleGlyphText }}
      </div>
      <div class="c-current-glyph-effects__header">
        Currently active glyph effects:
      </div>
      <GlyphSetName :glyphSet="glyphSet" />
      <br v-if="isSoftcapActive || hasEffarig || hasReality">
      <span v-html="uniqueGlyphText" />
      <div v-if="isSoftcapActive" class="l-current-glyph-effects__capped-header">
        <span class="c-current-glyph-effects__effect--capped">Colored</span> effects have been slightly reduced
        due to a softcap
      </div>
      <br>
      <div v-if="noEffects">
        None (equip Glyphs to get their effects)
      </div>
      <current-effect v-for="effect in effects" :key="effect.id + logGlyphSacrifice" :effect="effect" />
      <div
        v-if="showChaosText"
        class="pelle-current-glyph-effects"
      >
        {{ chaosEffect }}
      </div>
    </div>`
});
