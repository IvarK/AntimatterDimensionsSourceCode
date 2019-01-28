const GlyphTooltipEffect = {
  props: {
    effect: String,
    value: [Number, Object],
    boostColor: String,
  },
  computed: {
    prefix() {
      return GameDatabase.reality.glyphEffects[this.effect].singleDescSplit[0];
    },
    suffix() {
      return GameDatabase.reality.glyphEffects[this.effect].singleDescSplit[1];
    },
    displayValue() {
      let value = GameDatabase.reality.glyphEffects[this.effect].formatEffect(this.value);
      return this.boostColor ? `⯅${value}⯅` : value;
    },
    valueStyle() {
      return this.boostColor ? {
        color: this.boostColor,
        "text-shadow": `0 0 0.4rem ${this.boostColor}`
      } : {
          color: "#76EE76",
        }
    }
  },
  template: /*html*/`
    <div class="c-glyph-tooltip__effect">{{prefix}}<span :style="valueStyle">{{displayValue}}</span>{{suffix}}</div>
  `
};

const GlyphTooltipComponent = {
  components: {
    "effect-desc": GlyphTooltipEffect,
  },
  props: {
    type: String,
    strength: Number,
    level: Number,
    effects: Object,
    sacrificeReward: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    sortedEffects() {
      let unsorted = Object.keys(this.effects).map(e => ({
        id: this.type + e,
        value: this.effects[e],
      }));
      return unsorted.sort((a, b) => GlyphEffectOrder[a.id] - GlyphEffectOrder[b.id]);
    },
    rarityInfo() {
      return getRarity(this.strength);
    },
    descriptionStyle() {
      return {
        color: this.rarityInfo.color,
        "text-shadow": `-1px 1px 1px black, 1px 1px 1px black,
                        -1px -1px 1px black, 1px -1px 1px black, 0px 0px 3px ${this.rarityInfo.color}`,
        float: "left"
      }
    },
    description() {
      return `${this.rarityInfo.name} glyph of ${this.type} (${strengthToRarity(this.strength).toFixed(1)}%)`;
    },
    levelText() {
      return `Level: ${this.level}`;
    },
    sacrificeText() {
      return `Can be sacrificed for ${this.sacrificeReward.toFixed(1)} power`;
    },
  },
  template: /*html*/`
  <div class="l-glyph-tooltip c-glyph-tooltip">
    <div class="l-glyph-tooltip__header">
      <span class="c-glyph-tooltip__description" :style="descriptionStyle">{{description}}</span>
      <span class="l-glyph-tooltip__level">{{levelText}}</span>
    </div>
    <div class="l-glyph-tooltip__effects">
      <effect-desc v-for="e in sortedEffects" :effect="e.id" :value="e.value" :key="e.id"/>
    </div>
    <div v-if="sacrificeReward > 0" class="c-glyph-tooltip__sacrifice">
      {{sacrificeText}}
    </div>
  </div>
  `
};

Vue.component("glyph-tooltip", GlyphTooltipComponent);

let glyphComponentID = 0;

Vue.component("glyph-component", {
  props: {
    glyph: Object,
    size: {
      type: String,
      default: "5rem",
    },
    glowBlur: {
      type: String,
      default: "1rem"
    },
    glowSpread: {
      type: String,
      default: "0.2rem"
    },
    textProportion: {
      type: Number,
      default: 0.5
    },
  },
  data: function () {
    return {
      componentID: ++glyphComponentID,
    }
  },
  computed: {
    hasTooltip() {
      return this.glyph.effects !== undefined;
    },
    symbol() {
      return this.glyph.symbol || GlyphTypes[this.glyph.type].symbol;
    },
    borderColor() {
      return this.glyph.color || GlyphTypes[this.glyph.type].color;
    },
    overStyle() {
      return {
        width: this.size,
        height: this.size,
        position: "absolute",
        "background-color": "#00000000",
        "box-shadow": `0px 0px ${this.glowBlur} calc(${this.glowSpread} + 0.1rem) ${this.borderColor} inset`,
      }
    },
    outerStyle() {
      return {
        width: this.size,
        height: this.size,
        "background-color": this.borderColor,
        "box-shadow": `0px 0px ${this.glowBlur} ${this.glowSpread} ${this.borderColor}`,
      }
    },
    innerStyle() {
      let color = this.glyph.color || GlyphTypes[this.glyph.type].color;
      let rarityColor = this.glyph.color ||
        GlyphRarities.find(e => this.glyph.strength >= e.minStrength).color;
      return {
        width: `calc(${this.size} - 0.2rem)`,
        height: `calc(${this.size} - 0.2rem)`,
        "font-size": `calc( ${this.size} * ${this.textProportion} )`,
        color: rarityColor,
        "text-shadow": `-0.04em 0.04em 0.08em ${rarityColor}`,
      }
    },
  },
  methods: {
    mouseEnter() {
      this.$viewModel.tabs.reality.currentGlyphTooltip = this.componentID;
    },
    mouseLeave() {
      if (this.$viewModel.tabs.reality.currentGlyphTooltip === this.componentID) {
        this.$viewModel.tabs.reality.currentGlyphTooltip = 0;
      }
    },
    mouseMove(ev) {
      let rect = ev.target.getBoundingClientRect();
      let x = ev.clientX - rect.left; //x position within the element.
      let y = ev.clientY - rect.top;
      if (this.$refs.tooltip.$el) {
        this.$refs.tooltip.$el.style.left = `${x}px`
        this.$refs.tooltip.$el.style.top = `${y}px`
      }
    }
  },
  template:  /*html*/`
  <!-- The naive approach with a border and box-shadow seems to have problems with
      weird seams/artifacts at the edges. This makes for a rather complex workaround -->
    <div :style="outerStyle" :class="['l-glyph-component']"
      v-on="hasTooltip ? { mouseenter : mouseEnter,
                           '&mousemove': $event => mouseMove($event),
                           mouseleave: mouseLeave } : {}">
      <div ref="glyph" :style="innerStyle" :class="['l-glyph-component', 'c-glyph-component']">
        {{symbol}}
        <glyph-tooltip ref="tooltip" v-bind="glyph" v-if="hasTooltip"
                       v-show="$viewModel.tabs.reality.currentGlyphTooltip === componentID"/>
      </div>
      <div :style="overStyle"></div>
    </div>
  `,
});