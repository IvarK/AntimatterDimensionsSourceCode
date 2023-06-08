<script>
import AutoSacrificeAdvancedTab from "./AutoSacrificeAdvancedTab";
import AutoSacrificeEffectTab from "./AutoSacrificeEffectTab";
import GlyphComponent from "@/components/GlyphComponent";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "GlyphFilterPanel",
  components: {
    AutoSacrificeEffectTab,
    AutoSacrificeAdvancedTab,
    SliderComponent,
    GlyphComponent
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
      autoRealityForFilter: player.options.autoRealityForFilter,
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
      return `All Glyph choices are given a score and compared to a threshold based on the chosen mode. 
        The Glyph with the highest score is picked, but will still be Sacrificed if below the threshold.
        (click for more detail)`;
    },
    autoRealityTooltip() {
      return `If Auto-Reality is on, ignore all other settings and immediately Reality if no upcoming
        Glyphs would be kept`;
    },
    unlockedModes() {
      return Object.values(this.modes).filter(idx => this.isUnlocked(idx));
    }
  },
  methods: {
    update() {
      this.effectCount = player.reality.glyphs.filter.simple;
      this.mode = AutoGlyphProcessor.scoreMode;
      for (const type of generatedTypes) {
        this.rarityThresholds[type] = AutoGlyphProcessor.types[type].rarity;
      }
      this.lockedTypes = GlyphTypes.locked.map(e => e.id);
      this.alchemyUnlocked = Ra.unlocks.unlockGlyphAlchemy.canBeApplied;
    },
    optionClass(idx) {
      const icon = this.modeIcon(idx);
      return [
        "c-glyph-sacrifice-options__option",
        idx === this.mode
          ? "c-glyph-sacrifice-options__option--active"
          : "c-glyph-sacrifice-options__option--inactive",
        icon
      ];
    },
    modeIcon(idx) {
      switch (idx) {
        case this.modes.LOWEST_SACRIFICE:
          return "fas fa-burn";
        case this.modes.EFFECT_COUNT:
          return "fas fa-list-ul";
        case this.modes.RARITY_THRESHOLD:
          return "fas fa-gem";
        case this.modes.SPECIFIED_EFFECT:
          return "fas fa-tasks";
        case this.modes.EFFECT_SCORE:
          return "fas fa-list-ol";
        case this.modes.LOWEST_ALCHEMY:
          return "fas fa-atom";
        case this.modes.ALCHEMY_VALUE:
          return "fas fa-flask";
        default:
          throw Error("Unrecognized glyph filter mode");
      }
    },
    strengthThreshold(type) {
      return rarityToStrength(this.rarityThresholds[type]);
    },
    advancedTypeSelectStyle(type) {
      const color = GlyphAppearanceHandler.getBorderColor(type.id);
      return type.id === this.advancedType ? {
        color,
        "text-shadow": `0 0 0.25rem ${color}, 0 0 0.5rem ${color}, 0 0 0.75rem ${color}, 0 0 1rem ${color}`,
      } : {};
    },
    setMode(m) {
      AutoGlyphProcessor.scoreMode = m;
      player.reality.hasCheckedFilter = false;
    },
    setRarityThreshold(id, value) {
      AutoGlyphProcessor.types[id].rarity = value;
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.effectCount = Math.clamp(inputValue, 0, 8);
        player.reality.glyphs.filter.simple = this.effectCount;
      }
    },
    filterMode(index) {
      return AutoGlyphProcessor.filterModeName(index);
    },
    isUnlocked(index) {
      switch (index) {
        case this.modes.LOWEST_SACRIFICE:
        case this.modes.EFFECT_COUNT:
        case this.modes.RARITY_THRESHOLD:
        case this.modes.SPECIFIED_EFFECT:
        case this.modes.EFFECT_SCORE:
          return true;
        case this.modes.LOWEST_ALCHEMY:
        case this.modes.ALCHEMY_VALUE:
          return this.alchemyUnlocked;
        default:
          throw Error("Unrecognized glyph filter mode");
      }
    },
    // Clicking bumps the rarity over to adjacent thresholds between rarities; normal clicks move to the higher one
    // and shift-clicks move to the lower one. There is a loop-around that makes 100 go to 0 next and vice versa
    bumpRarity(type) {
      const rarityThresholds = GlyphRarities.map(r => strengthToRarity(r.minStrength));
      let newRarity;
      if (ui.view.shiftDown) {
        const lower = rarityThresholds.filter(s => s < this.rarityThresholds[type]);
        newRarity = lower.length === 0 ? 100 : lower.max();
      } else {
        // Note: As the minimum of an empty array is zero, this wraps around to 0% again if clicked at 100% rarity
        newRarity = rarityThresholds.filter(s => s > this.rarityThresholds[type]).min();
      }
      this.setRarityThreshold(type, newRarity);
    },
    showFilterHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Advanced Glyph Mechanics")[0];
      Modal.h2p.show();
    },
    getSymbol(type) {
      return CosmeticGlyphTypes[type].currentSymbol.symbol;
    },
    toggleAutoReality() {
      player.options.autoRealityForFilter = !player.options.autoRealityForFilter;
      this.autoRealityForFilter = player.options.autoRealityForFilter;
      player.reality.hasCheckedFilter = false;
    },
    exportFilterSettings() {
      const filter = player.reality.glyphs.filter;
      const serializeType = settings => [settings.rarity, settings.score, settings.effectCount,
        settings.specifiedMask, settings.effectScores.join("/")].join(",");
      const simpleData = [filter.select, filter.simple, filter.trash].join("|");
      const typeData = ALCHEMY_BASIC_GLYPH_TYPES.map(t => serializeType(filter.types[t])).join("|");
      copyToClipboard(GameSaveSerializer.encodeText(`${simpleData}|${typeData}`, "glyph filter"));
      GameUI.notify.info("Filter settings copied to clipboard");
    },
    importFilterSettings() {
      Modal.importFilter.show();
    },
  }
};
</script>

<template>
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <div class="c-glyph-sacrifice-options c-glyph-sacrifice-options-container">
      <div class="c-filter-extra-btns c-top-left">
        <i
          v-tooltip="'Export filter settings'"
          class="fas fa-file-export l-top-left-btn"
          @click="exportFilterSettings"
        />
        <i
          v-tooltip="'Import filter settings'"
          class="fas fa-file-import l-top-left-btn"
          @click="importFilterSettings"
        />
      </div>
      <div class="c-filter-extra-btns c-top-right">
        <i
          v-tooltip="autoRealityTooltip"
          class="fas fa-recycle l-top-right-btn"
          :class="{ 'o-quick-reality' : autoRealityForFilter }"
          @click="toggleAutoReality"
        />
        <i
          v-tooltip="questionmarkTooltip"
          class="fas fa-question-circle l-top-right-btn o-borderless"
          @click="showFilterHowTo"
        />
      </div>
      Current Filter Mode:
      <br>
      {{ filterMode(mode) }}
      <br>
      <div class="c-glyph-filter-mode-container">
        <div
          v-for="index in unlockedModes"
          :key="index"
          :class="optionClass(index)"
          @click="setMode(index)"
        >
          <div class="c-glyph-sacrifice-options__option__tooltip">
            {{ filterMode(index) }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="mode === modes.LOWEST_SACRIFICE"
      class="c-glyph-sacrifice-options__advanced"
    >
      <br>
      Glyph score is assigned based on type. Priority is given to Glyphs belonging to the type of which you have
      the least total Glyph Sacrifice value.
      <br>
      <br>
      This mode never keeps Glyphs, but will instead always sacrifice the Glyph it chooses.
    </div>
    <div
      v-if="mode === modes.EFFECT_COUNT"
      class=" c-glyph-sacrifice-options__advanced"
    >
      <br>
      Glyphs must have at least
      <input
        ref="effectCount"
        type="number"
        min="0"
        max="8"
        class="c-auto-sac-effect-tab__input"
        :value="effectCount"
        @blur="setEffectCount"
      >
      effects to be chosen. Rarer Glyphs are preferred in ties.
    </div>
    <div
      v-if="mode === modes.RARITY_THRESHOLD"
      class="l-glyph-sacrifice-options__rarity-sliders"
    >
      <span class="c-glyph-sacrifice-options__advanced">
        Any Glyphs with rarity below these thresholds will be sacrificed.
      </span>
      <div
        v-for="type in glyphTypes"
        :key="type.id"
        class="l-glyph-sacrifice-options__rarity-slider-div"
      >
        <span @click="bumpRarity(type.id)">
          <GlyphComponent
            :glyph="{type: type.id, strength: strengthThreshold(type.id) }"
            v-bind="glyphIconProps"
            class="o-clickable"
          />
        </span>
        <SliderComponent
          v-bind="raritySliderProps"
          :value="rarityThresholds[type.id]"
          :width="'100%'"
          @input="setRarityThreshold(type.id, $event)"
        />
      </div>
    </div>
    <div
      v-if="mode === modes.SPECIFIED_EFFECT"
      class="c-glyph-sacrifice-options__advanced"
    >
      <div>
        Glyph Type:
        <span
          v-for="type in glyphTypes"
          :key="type.id"
          v-tooltip="type.id.capitalize()"
          class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
          :style="advancedTypeSelectStyle(type)"
          @click="advancedType=type.id"
        >
          {{ getSymbol(type.id) }}
        </span>
      </div>
      <br>
      <div class="l-glyph-sacrifice-options__rarity-slider-div">
        <span @click="bumpRarity(advancedType)">
          <GlyphComponent
            :glyph="{type: advancedType, strength: strengthThreshold(advancedType) }"
            v-bind="glyphIconProps"
            class="o-clickable"
          />
        </span>
        <SliderComponent
          v-bind="raritySliderProps"
          :value="rarityThresholds[advancedType]"
          :width="'100%'"
          @input="setRarityThreshold(advancedType, $event)"
        />
      </div>
      <template v-for="type in glyphTypes">
        <AutoSacrificeEffectTab
          v-show="type.id === advancedType"
          :key="type.id"
          :glyph-type="type.id"
        />
      </template>
    </div>
    <div
      v-if="mode === modes.EFFECT_SCORE"
      class="c-glyph-sacrifice-options__advanced"
    >
      <div>
        Glyph Type:
        <span
          v-for="type in glyphTypes"
          :key="type.id"
          v-tooltip="type.id.capitalize()"
          class="l-glyph-sacrifice-options__advanced-type-select c-glyph-sacrifice-options__advanced-type-select"
          :style="advancedTypeSelectStyle(type)"
          @click="advancedType=type.id"
        >
          {{ getSymbol(type.id) }}
        </span>
      </div>
      <br>
      <template v-for="type in glyphTypes">
        <AutoSacrificeAdvancedTab
          v-show="type.id === advancedType"
          :key="type.id"
          :glyph-type="type.id"
        />
      </template>
    </div>
    <div
      v-if="mode === modes.LOWEST_ALCHEMY"
      class="c-glyph-sacrifice-options__advanced"
    >
      <br>
      Glyph score is assigned based on current Alchemy Resource totals. Priority is given to the Glyph type with
      the lowest associated alchemy resource total.
      <br>
      <br>
      This mode never keeps Glyphs.
    </div>
    <div
      v-if="mode === modes.ALCHEMY_VALUE"
      class="c-glyph-sacrifice-options__advanced"
    >
      <br>
      Glyphs will be assigned values based on <i>current</i> refinement value, accounting for the type-specific
      resource caps. Priority is given to Glyphs which are worth the most alchemy resources; Glyphs which would
      cause you to hit a cap are effectively worth less.
      <br>
      <br>
      This mode never keeps Glyphs.
    </div>
  </div>
</template>

<style scoped>
.o-clickable {
  cursor: pointer;
}

.c-filter-extra-btns {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  z-index: 2;
  font-size: 1.3rem;
}

.c-top-left {
  right: calc(100% - 6rem);
  color: var(--color-reality-dark);
}

.c-top-right {
  left: calc(100% - 5rem);
}

.l-top-left-btn {
  cursor: pointer;
  border: var(--var-border-width, 0.2rem) solid;
  width: 2.5rem;
  margin: 0.5rem 0 0 0.5rem;
  padding: 0.5rem;
}

.l-top-right-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: var(--var-border-width, 0.2rem) solid;
  width: 2rem;
  height: 2rem;
  margin: 0.5rem 0.5rem 0 0;
  padding: 0.2rem;
}

.o-borderless {
  border: none;
}

.o-quick-reality {
  background: var(--color-good);
}
</style>
