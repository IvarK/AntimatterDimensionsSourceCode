"use strict";

const AutoSacAdvancedTab = {
  props: {
    glyphType: String,
  },
  data() {
    return {
      scoreThreshold: 0,
      effectScores: Object.assign({}, AutoGlyphProcessor.types[this.glyphType].effectScores),
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphProcessor.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "color": this.typeConfig.color,
        "border-color": this.typeConfig.color
      };
    },
    minScoreInputStyle() {
      // Override some properties of the number input to match row style:
      return {
        "font-size": "larger",
        "border-width": "0.2rem",
      };
    },
    questionmarkTooltip() {
      return "The score of a glyph is its rarity % plus the specified amount for each effect it has";
    }
  },
  methods: {
    update() {
      this.scoreThreshold = this.autoSacrificeSettings.scoreThreshold;
      for (const e of this.effects) {
        this.effectScores[e.id] = this.autoSacrificeSettings.effectScores[e.id];
      }
    },
    setScoreThreshold(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.scoreThreshold = Math.min(999, Math.max(inputValue, 0));
      }
    },
    setEffectScore(id, event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectScores[id] = Math.min(999, Math.max(inputValue, 0));
      }
    },
  },
  template: `
    <div class="l-auto-sac-type-tab">
      <div class="l-auto-sac-type-tab__row-wrapper">
        <div>
          <div class="c-auto-sac-type-tab__header">
            Threshold score
            <div class="o-questionmark" :ach-tooltip="questionmarkTooltip">?</div>
          </div>
          <div class="l-auto-sac-type-tab__help-text">
            rarity % + Σ effects
          </div>
        </div>
        <input
          type="number"
          min="0"
          max="999"
          :value="scoreThreshold"
          ref="scoreThreshold" @blur="setScoreThreshold"
          class="c-auto-sac-type-tab__input"
          :style="minScoreInputStyle"
        />
      </div>
      <div v-for="effect in effects" class="l-auto-sac-type-tab__row-wrapper">
        <div class="c-auto-sac-type-tab__effect-desc l-auto-sac-type-tab__effect-desc" :style="descStyle">
          {{ typeof effect.genericDesc === "function" ? effect.genericDesc() : effect.genericDesc }}
        </div>
        <input
          type="number"
          min="0"
          max="999"
          :value="effectScores[effect.id]"
          @blur="setEffectScore(effect.id, $event)"
          class="c-auto-sac-type-tab__input"
        />
      </div>
    </div>`
};

const AutoSacEffectTab = {
  props: {
    glyphType: String,
  },
  data() {
    return {
      effectCount: 0,
      effectChoices: Object.assign({}, AutoGlyphProcessor.types[this.glyphType].effectChoices),
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphProcessor.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "color": this.typeConfig.color,
        "border-color": this.typeConfig.color
      };
    },
    questionmarkTooltip() {
      return `Glyph score is rarity, minus ${formatInt(200)} for every missing effect.
        Glyphs with less than the specified rarity are sacrificed.`;
    }
  },
  methods: {
    update() {
      this.effectCount = this.autoSacrificeSettings.effectCount;
      for (const e of this.effects) {
        this.effectChoices[e.id] = this.autoSacrificeSettings.effectChoices[e.id];
      }
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectCount = Math.clamp(inputValue, 0, 8);
      }
    }
  },
  template: `
    <div class="c-glyph-sacrifice-options__advanced">
      <div>
        Selected Glyphs will have<br>
        at least
        <input
          type="number"
          min="0"
          max="8"
          :value="effectCount"
          ref="effectCount" @blur="setEffectCount"
          class="c-auto-sac-effect-tab__input"
        />
        effects total,
        <br>
        which must include all of
        <br>
        the following effects:
        <span class="o-questionmark" :ach-tooltip="questionmarkTooltip">?</span>
      </div>
      <div v-for="effect in effects" class="l-auto-sac-type-tab__row-wrapper">
        <selected-effect-toggle
          class="c-auto-sac-type-tab__effect-desc l-specified-effect-tab__effect-desc"
          :effect="effect"
          :glyphType="glyphType"
          :style="descStyle"
        />
      </div>
    </div>`
};

Vue.component("selected-effect-toggle", {
  props: {
    effect: Object,
    glyphType: String
  },
  data() {
    return {
      isActive: AutoGlyphProcessor.types[this.glyphType].effectChoices[this.effect.id],
    };
  },
  computed: {
    description() {
      return typeof this.effect.genericDesc === "function"
        ? this.effect.genericDesc()
        : this.effect.genericDesc;
    },
    classObject() {
      return this.isActive ? "c-auto-sac-type-tab__effect-desc--active" : "c-auto-sac-type-tab__effect-desc--inactive";
    }
  },
  methods: {
    toggleSelection() {
      this.isActive = !AutoGlyphProcessor.types[this.glyphType].effectChoices[this.effect.id];
      AutoGlyphProcessor.types[this.glyphType].effectChoices[this.effect.id] = this.isActive;
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectCount = Math.clamp(inputValue, 0, 8);
      }
    },
  },
  template: `
    <div
      :class="classObject"
      @click="toggleSelection()"
    >
      {{ description }}
    </div>`
});

Vue.component("glyph-filter-panel", {
  components: {
    "auto-sac-effect-tab": AutoSacEffectTab,
    "auto-sac-advanced-tab": AutoSacAdvancedTab,
  },
  data() {
    return {
      mode: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
      effectCount: 0,
      lockedTypes: GlyphTypes.locked.map(e => e.id),
      advancedType: GLYPH_TYPES[0],
      alchemyUnlocked: false,
      // Note: there are two units at play: strength is from 1..3.5+; rarity is 0..100
      rarityThresholds: GLYPH_TYPES.mapToObject(e => e, () => 0),
    };
  },
  computed: {
    modes() {
      return AUTO_GLYPH_SCORE;
    },
    glyphTypes() {
      return GlyphTypes.list.filter(e => !this.lockedTypes.includes(e.id));
    },
    raritySliderProps() {
      return {
        min: 0,
        max: 100,
        width: "18rem",
        valueInDot: true,
        tooltip: "never",
        "dot-width": "2.2rem",
        "dot-height": "1.6rem",
        "dot-class": "c-glyph-sacrifice-options__rarity-slider-handle",
        "bg-class": "c-glyph-sacrifice-options__rarity-slider-bg",
        "process-class": "c-glyph-sacrifice-options__rarity-slider-process",
        style: {
          "margin-left": "1rem",
        }
      };
    },
    glyphIconProps() {
      return {
        size: "3rem",
        "glow-blur": "0.3rem",
        "glow-spread": "0.1rem",
        "text-proportion": 0.66
      };
    },
    questionmarkTooltip() {
      return "All Glyph choices are given a score based on the chosen option, and the Glyph with the highest score " +
        "is picked. If this Glyph is below a mode-specific threshold, it will be Sacrificed instead.";
    }
  },
  methods: {
    update() {
      this.effectCount = player.celestials.effarig.glyphScoreSettings.simpleEffectCount;
      this.mode = AutoGlyphProcessor.scoreMode;
      for (const type of generatedTypes) {
        this.rarityThresholds[type] = AutoGlyphProcessor.types[type].rarityThreshold;
      }
      this.lockedTypes = GlyphTypes.locked.map(e => e.id);
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
    },
    optionClass(idx) {
      let icon;
      switch (idx) {
        case this.modes.LOWEST_SACRIFICE:
          icon = "fas fa-burn";
          break;
        case this.modes.EFFECT_COUNT:
          icon = "fas fa-list-ul";
          break;
        case this.modes.RARITY_THRESHOLD:
          icon = "fas fa-gem";
          break;
        case this.modes.SPECIFIED_EFFECT:
          icon = "fas fa-tasks";
          break;
        case this.modes.ADVANCED_MODE:
          icon = "fas fa-list-ol";
          break;
        case this.modes.LOWEST_ALCHEMY:
          icon = "fas fa-atom";
          break;
        case this.modes.ALCHEMY_VALUE:
          icon = "fas fa-flask";
          break;
        default:
          throw Error("Unrecognized glyph filter mode");
      }
      return [
        idx === this.mode
          ? "c-glyph-sacrifice-options__option--active"
          : "c-glyph-sacrifice-options__option--inactive",
        icon
      ];
    },
    strengthThreshold(type) {
      return rarityToStrength(this.rarityThresholds[type]);
    },
    advancedTypeSelectStyle(type) {
      const color = type.color;
      return type.id === this.advancedType ? {
        color,
        "text-shadow": `0 0 0.25rem ${color}, 0 0 0.5rem ${color}, 0 0 0.75rem ${color}, 0 0 1rem ${color}`,
      } : {};
    },
    setMode(m) {
      AutoGlyphProcessor.scoreMode = m;
    },
    setRarityThreshold(id, value) {
      AutoGlyphProcessor.types[id].rarityThreshold = value;
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.effectCount = Math.clamp(inputValue, 0, 8);
        player.celestials.effarig.glyphScoreSettings.simpleEffectCount = this.effectCount;
      }
    },
    filterMode(index) {
      switch (index) {
        case this.modes.LOWEST_SACRIFICE:
          return "Lowest total Glyph Sacrifice";
        case this.modes.EFFECT_COUNT:
          return "Number of effects";
        case this.modes.RARITY_THRESHOLD:
          return "Rarity Threshold Mode";
        case this.modes.SPECIFIED_EFFECT:
          return "Specified effect mode";
        case this.modes.ADVANCED_MODE:
          return "Advanced mode";
        case this.modes.LOWEST_ALCHEMY:
          return "Lowest Alchemy Resource";
        case this.modes.ALCHEMY_VALUE:
          return "Refinement value";
        default:
          throw Error("Unrecognized glyph filter mode");
      }
    }
  },
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
      <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
        <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
      </div>
      <div class="c-glyph-sacrifice-options" style="padding: 0.8rem;">
        <div class="c-glyph-sacrifice-options__option--active">
          Current Filter Mode:
          <br>
          {{ filterMode(mode) }}
          <br>
        </div>
        <div class="c-glyph-filter-mode-container">
          <div
            v-for="index in modes"
            :class="optionClass(index)"
            @click="setMode(index)"
            v-tooltip="filterMode(index)"
          />
        </div>
      </div>
      <div v-if="mode === modes.LOWEST_SACRIFICE" class="c-glyph-sacrifice-options__advanced">
        <br> Glyph score is assigned based on
        <br> type; the type you have the least
        <br> total Glyph Sacrifice value of is
        <br> given the highest score.
        <br> This mode never keeps Glyphs.
      </div>
      <div v-if="mode === modes.EFFECT_COUNT" class=" c-glyph-sacrifice-options__advanced">
        <br> Glyphs must have at least
        <input
          type="number"
          min="0"
          max="8"
          :value="effectCount"
          ref="effectCount"
          @blur="setEffectCount"
          class="c-auto-sac-effect-tab__input"
        />
        <br> effects to be chosen. Rarer
        <br> Glyphs are preferred in ties.
      </div>
      <div
        v-if="mode === modes.RARITY_THRESHOLD"
        class="l-glyph-sacrifice-options__rarity-sliders"
      >
        <span class="c-glyph-sacrifice-options__advanced">
          Any Glyphs with rarity below these
          <br>
          thresholds will be sacrificed.
        </span>
        <div v-for="type in glyphTypes" :key="type.id" class="l-glyph-sacrifice-options__rarity-slider-div">
          <glyph-component :glyph="{type: type.id, strength: strengthThreshold(type.id) }" v-bind="glyphIconProps" />
          <ad-slider-component
            v-bind="raritySliderProps"
            :value="rarityThresholds[type.id]"
            @input="setRarityThreshold(type.id, $event)"
          />
        </div>
      </div>
      <div
        v-if="mode === modes.SPECIFIED_EFFECT"
        class="c-glyph-sacrifice-options__advanced"
      >
        <span
          v-for="type in glyphTypes"
          :key="type.id"
          class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
          :style="advancedTypeSelectStyle(type)"
          @click="advancedType=type.id"
        >
          {{ type.symbol }}
        </span>
        <div class="l-glyph-sacrifice-options__rarity-slider-div">
          <glyph-component
            :glyph="{type: advancedType, strength: strengthThreshold(advancedType) }"
            v-bind="glyphIconProps"
          />
          <ad-slider-component
            v-bind="raritySliderProps"
            :value="rarityThresholds[advancedType]"
            @input="setRarityThreshold(advancedType, $event)"
          />
        </div>
        <template v-for="type in glyphTypes">
          <auto-sac-effect-tab v-show="type.id === advancedType" :glyph-type="type.id" />
        </template>
        (click to toggle effects on/off)
      </div>
      <div
        v-if="mode === modes.ADVANCED_MODE"
        class="c-glyph-sacrifice-options__advanced"
      >
        <span
          v-for="type in glyphTypes"
          :key="type.id"
          class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
          :style="advancedTypeSelectStyle(type)"
          @click="advancedType=type.id"
        >
          {{ type.symbol }}
        </span>
        <template v-for="type in glyphTypes">
          <auto-sac-advanced-tab v-show="type.id === advancedType" :glyph-type="type.id" />
        </template>
      </div>
      <div v-if="mode === modes.LOWEST_ALCHEMY" class="c-glyph-sacrifice-options__advanced">
        <br> Glyph score is assigned based
        <br> on current Alchemy Resource totals.
        <br> This mode never keeps Glyphs.
      </div>
      <div v-if="mode === modes.ALCHEMY_VALUE" class="c-glyph-sacrifice-options__advanced">
        <br> Glyphs will be assigned values
        <br> based on refinement value.
        <br> This mode never keeps Glyphs.
      </div>
    </div>`
});
