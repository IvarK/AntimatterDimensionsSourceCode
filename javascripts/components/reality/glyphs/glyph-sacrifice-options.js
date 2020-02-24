"use strict";

const AutoSacAdvancedTab = {
  props: {
    glyphType: String,
  },
  data() {
    return {
      scoreThreshold: 0,
      effectScores: Object.assign({}, AutoGlyphSacrifice.types[this.glyphType].effectScores),
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphSacrifice.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "border-color": this.typeConfig.color,
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
            Minimum score
            <div class="o-questionmark" :ach-tooltip="questionmarkTooltip">?</div>
          </div>
          <div class="l-auto-sac-type-tab__help-text">
            rarity % + Σ effects
          </div>
        </div>
        <input type="number" min="0" max="999" :value="scoreThreshold"
               ref="scoreThreshold" @blur="setScoreThreshold"
               class="c-auto-sac-type-tab__input"
               :style="minScoreInputStyle"/>
      </div>
      <div v-for="effect in effects" class="l-auto-sac-type-tab__row-wrapper">
        <div class="c-auto-sac-type-tab__effect-desc l-auto-sac-type-tab__effect-desc" :style="descStyle">
          {{ typeof effect.genericDesc === "function" ? effect.genericDesc() : effect.genericDesc }}
        </div>
        <input type="number" min="0" max="999" :value="effectScores[effect.id]"
               @blur="setEffectScore(effect.id, $event)"
               class="c-auto-sac-type-tab__input"/>
      </div>
    </div>
  `
};

const AutoSacEffectTab = {
  props: {
    glyphType: String,
  },
  data() {
    return {
      effectCount: 0,
      effectChoices: Object.assign({}, AutoGlyphSacrifice.types[this.glyphType].effectChoices),
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphSacrifice.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "border-color": this.typeConfig.color,
      };
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
    },
    toggleSelection(effect) {
      this.autoSacrificeSettings.effectChoices[effect.id] = !this.autoSacrificeSettings.effectChoices[effect.id];
    },
    effectClass(effect) {
      return {
        "c-glyph-sacrifice-options__option--active": this.autoSacrificeSettings.effectChoices[effect.id],
        "c-glyph-sacrifice-options__option--inactive": !this.autoSacrificeSettings.effectChoices[effect.id],
      };
    },
  },
  template: `
    <div class="c-glyph-sacrifice-options__advanced">
      <div>
        Selected glyphs will have<br>
        at least 
        <input type="number" min="0" max="8" :value="effectCount"
               ref="effectCount" @blur="setEffectCount"
               class="c-auto-sac-effect-tab__input"/>
        effects total,<br>
        which must include all of<br>
        the following effects:
      </div>
      <div v-for="effect in effects" class="l-auto-sac-type-tab__row-wrapper">
        <div 
          :class="effectClass(effect)"
          class="c-auto-sac-type-tab__effect-desc l-auto-sac-type-tab__effect-desc" :style="descStyle">
          {{ typeof effect.genericDesc === "function" ? effect.genericDesc() : effect.genericDesc }}
        </div>
        <input type="checkbox"
          :value="effectChoices[effect.id]"
          v-model="effectChoices[effect.id]"
          @click="toggleSelection(effect)"
          class="c-auto-sac-effect-tab__checkbox"/>
      </div>
    </div>
  `
};

Vue.component("glyph-sacrifice-options", {
  components: {
    "auto-sac-effect-tab": AutoSacEffectTab,
    "auto-sac-advanced-tab": AutoSacAdvancedTab,
  },
  data() {
    return {
      unlocked: false,
      mode: AUTO_GLYPH_SAC_MODE.NONE,
      lockedTypes: GlyphTypes.locked.map(e => e.id),
      advancedType: GLYPH_TYPES[0],
      alchemyUnlocked: false,
      // Note: there are two units at play: strength is from 1..3.5+; rarity is 0..100
      rarityThresholds: GLYPH_TYPES.mapToObject(e => e, () => 0),
    };
  },
  computed: {
    modes() {
      return AUTO_GLYPH_SAC_MODE;
    },
    glyphTypes() {
      return GlyphTypes.list.filter(e => !this.lockedTypes.includes(e.id));
    },
    raritySliderProps() {
      return {
        min: 0,
        max: 100,
        width: "14rem",
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
      return "When the reality autobuyer triggers, auto sacrifice will automatically " +
        "sacrifice the glyph if it doesn't meet the specified conditions.";
    }
  },
  methods: {
    optionClass(idx) {
      return [
        idx === this.mode
          ? "c-glyph-sacrifice-options__option--active"
          : "c-glyph-sacrifice-options__option--inactive",
        "c-glyph-sacrifice-options__option",
        "l-glyph-sacrifice-options__option"
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
    update() {
      this.unlocked = EffarigUnlock.autosacrifice.isUnlocked;
      this.mode = AutoGlyphSacrifice.mode;
      for (const type of generatedTypes) {
        this.rarityThresholds[type] = AutoGlyphSacrifice.types[type].rarityThreshold;
      }
      this.lockedTypes = GlyphTypes.locked.map(e => e.id);
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
    },
    setMode(m) {
      AutoGlyphSacrifice.mode = m;
    },
    setRarityThreshold(id, value) {
      AutoGlyphSacrifice.types[id].rarityThreshold = value;
    }
  },
  template: `
  <div v-if="unlocked" class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
    <div class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help">
      <div class="o-questionmark" v-tooltip="questionmarkTooltip">?</div>
    </div>
    <div :class="optionClass(modes.NONE)" @click="setMode(modes.NONE)">
      Auto sacrifice disabled
    </div>
    <div :class="optionClass(modes.ALL)" @click="setMode(modes.ALL)">
      Auto sacrifice all
    </div>
    <div :class="optionClass(modes.RARITY_THRESHOLDS)" @click="setMode(modes.RARITY_THRESHOLDS)">
      Rarity Threshold Mode
    </div>
    <div :class="optionClass(modes.EFFECTS)" @click="setMode(modes.EFFECTS)">
      Specified Effect Mode
    </div>
    <div :class="optionClass(modes.ADVANCED)" @click="setMode(modes.ADVANCED)">
      ❃.✮:▹ Advanced mode ◃:✮.❃
    </div>
    <div v-if="alchemyUnlocked" :class="optionClass(modes.ALCHEMY)" @click="setMode(modes.ALCHEMY)">
      🜁 🜄 Alchemy mode 🜃 🜂
    </div>
    <div v-if="mode === 2" class="l-glyph-sacrifice-options__rarity-sliders c-glyph-sacrifice-options__rarity-sliders">
      <span class="c-glyph-sacrifice-options__advanced">
        Minimum Rarity:
      </span>
      <div v-for="type in glyphTypes" :key="type.id" class="l-glyph-sacrifice-options__rarity-slider-div">
        <glyph-component :glyph="{type: type.id, strength: strengthThreshold(type.id) }" v-bind="glyphIconProps"/>
        <ad-slider-component v-bind="raritySliderProps" :value="rarityThresholds[type.id]"
                             @input="setRarityThreshold(type.id, $event)"/>
      </div>
    </div>
    <div v-if="mode === 3" class="l-glyph-sacrifice-options__rarity-sliders c-glyph-sacrifice-options__rarity-sliders">
      <span v-for="type in glyphTypes" :key="type.id"
            class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
            :style="advancedTypeSelectStyle(type)" @click="advancedType=type.id">
        {{type.symbol}}
      </span><br>
      <span class="c-glyph-sacrifice-options__advanced">
        Minimum Rarity:
      </span>
      <div class="l-glyph-sacrifice-options__rarity-slider-div">
        <glyph-component :glyph="{type: advancedType, strength: strengthThreshold(advancedType) }"
          v-bind="glyphIconProps"/>
        <ad-slider-component v-bind="raritySliderProps" :value="rarityThresholds[advancedType]"
                            @input="setRarityThreshold(advancedType, $event)"/>
      </div>
      <auto-sac-effect-tab :glyph-type="advancedType"/>
    </div>
    <div v-if="mode === 4" class="l-glyph-sacrifice-options__advanced c-glyph-sacrifice-options__advanced">
      <span v-for="type in glyphTypes" :key="type.id"
            class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
            :style="advancedTypeSelectStyle(type)" @click="advancedType=type.id">
        {{type.symbol}}
      </span>
      <template v-for="type in glyphTypes">
        <auto-sac-advanced-tab v-show="type.id === advancedType" :glyph-type="type.id"/>
      </template>
    </div>
    <div v-if="mode === 5">
      <br> All sacrificed glyphs will be
      <br> refined into alchemy resources.
      <br> (New glyphs will be sacrificed.)
    </div>
  </div>
  `
});
