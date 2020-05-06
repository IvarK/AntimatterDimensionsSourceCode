"use strict";

const GlyphTooltipEffect = {
  props: {
    effect: String,
    value: [Number, Object],
  },
  computed: {
    effectConfig() {
      return GameDatabase.reality.glyphEffects[this.effect];
    },
    boostColor() {
      return (this.effectConfig.alterationType !== undefined &&
        this.effectConfig.alterationType !== ALTERATION_TYPE.ADDITION)
          ? this.effectConfig.alteredColor()
          : undefined;
    },
    additionColor() {
      return this.effectConfig.alterationType === ALTERATION_TYPE.ADDITION
        ? this.effectConfig.alteredColor()
        : undefined;
    },
    effectStringTemplate() {
      return typeof this.effectConfig.singleDesc === "function"
        ? this.effectConfig.singleDesc()
        : this.effectConfig.singleDesc;
    },
    primaryEffectText() {
      const value = this.effectConfig.formatSingleEffect(this.value);
      return this.boostColor ? `⯅${value}⯅` : value;
    },
    secondaryEffectText() {
      const value = this.effectConfig.formatSingleSecondaryEffect(
        this.effectConfig.conversion(this.value));
      return this.boostColor ? `⯅${value}⯅` : value;
    },
    textSplits() {
      const firstSplit = this.effectStringTemplate.split("{value}");
      const secondSplit = firstSplit[1] ? firstSplit[1].split("{value2}") : "";
      if (secondSplit.length !== 1) return [firstSplit[0]].concat(secondSplit);
      return firstSplit;
    },
    hasValue() {
      return this.effectStringTemplate.includes("{value}");
    },
    hasSecondaryValue() {
      return this.textSplits[2] !== undefined;
    },
    convertedParts() {
      const parts = [];
      for (const text of this.textSplits) parts.push(this.convertToHTML(text));
      return parts;
    },
    valueStyle() {
      return this.boostColor ? {
        color: this.boostColor,
        "text-shadow": `0 0 0.4rem ${this.boostColor}`
      } : {
          color: "#76EE76",
      };
    },
  },
  methods: {
    convertToHTML(string) {
      return string
        .replace("\n", "<br>")
        .replace("]", "</span>")
        .replace("[", `<span style="color:${this.additionColor}; text-shadow:#FFFFFF 0 0 0.6rem;">`);
    }
  },
  template: `
    <div class="c-glyph-tooltip__effect">
      <span v-html="convertedParts[0]"/>
      <span v-if="hasValue" :style="valueStyle">{{primaryEffectText}}</span>
      <span v-html="convertedParts[1]"/>
      <span v-if="hasSecondaryValue" :style="valueStyle">{{secondaryEffectText}}</span>
      <span v-if="hasSecondaryValue" v-html="convertedParts[2]"/>
    </div>
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
    effects: Number,
    id: Number,
    sacrificeReward: {
      type: Number,
      default: 0,
    },
    showDeletionText: {
      type: Boolean,
      default: true,
    },
    levelOverride: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    onTouchDevice() {
      return GameUI.touchDevice;
    },
    effectiveLevel() {
      return this.levelOverride ? this.levelOverride : this.level;
    },
    sortedEffects() {
      return getGlyphEffectValuesFromBitmask(this.effects, this.effectiveLevel, this.strength)
        .filter(effect =>
          GameDatabase.reality.glyphEffects[effect.id].isGenerated === generatedTypes.includes(this.type));
    },
    rarityInfo() {
      return getRarity(this.strength);
    },
    roundedRarity() {
      return 0.1 * Math.floor(strengthToRarity(this.strength) * 10 + 0.5);
    },
    descriptionStyle() {
      return {
        color: this.rarityInfo.color,
        "text-shadow": `-1px 1px 1px black, 1px 1px 1px black,
                        -1px -1px 1px black, 1px -1px 1px black, 0 0 3px ${this.rarityInfo.color}`,
        float: "left",
        animation: this.type === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
        "margin-top": this.type === "reality" ? "0.7rem" : undefined,
        "margin-left": this.type === "reality" ? "0.7rem" : undefined
      };
    },
    description() {
      if (this.type === "companion") return "Companion Glyph";
      if (this.type === "cursed") return "Cursed Glyph";
      const name = this.type === "reality" ? "Pure" : this.rarityInfo.name;
      const rarity = this.type === "reality" ? "" : `(${this.roundedRarity.toFixed(1)}%)`;
      return `${name} Glyph of ${this.type.charAt(0).toUpperCase()}${this.type.slice(1)} ${rarity}`;
    },
    isLevelCapped() {
      return this.levelOverride && this.levelOverride < this.level;
    },
    isLevelBoosted() {
      return this.levelOverride && this.levelOverride > this.level;
    },
    levelText() {
      if (this.type === "companion") return "";
      // eslint-disable-next-line no-nested-ternary
      const arrow = this.isLevelCapped ? "▼" : (this.isLevelBoosted ? "⯅" : "");
      return `Level: ${arrow}${formatInt(this.effectiveLevel)}${arrow}`;
    },
    levelStyle() {
      // eslint-disable-next-line no-nested-ternary
      const color = this.isLevelCapped ? "#FF1111" : (this.isLevelBoosted ? "#44FF44" : "");
      return { color };
    },
    sacrificeText() {
      if (this.type === "companion") return "";
      if (this.type === "cursed") return "Gives nothing when sacrificed or refined";
      if (GlyphSacrificeHandler.isRefining && this.type !== "reality") {
        if (!AlchemyResource[this.type].isUnlocked) return "Cannot be refined (resource not unlocked)";
        const refinementText = `${format(this.sacrificeReward, 2, 2)} ${GLYPH_SYMBOLS[this.type]}`;
        const limitText = this.sacrificeReward === 0
          ? ` (limit reached)`
          : ``;
        return this.onTouchDevice
          ? `Refine for ${refinementText}${limitText}`
          : `Can be refined for ${refinementText}${limitText}`;
      }
      const powerText = `${format(this.sacrificeReward, 2, 2)} power`;
      const showFilterScoreModes = [AUTO_GLYPH_SCORE.RARITY, AUTO_GLYPH_SCORE.RARITY_THRESHOLDS,
        AUTO_GLYPH_SCORE.SPECIFIED_EFFECT, AUTO_GLYPH_SCORE.ADVANCED_MODE];
      const filterScoreText = showFilterScoreModes.includes(AutoGlyphProcessor.scoreMode)
        ? `\nGlyph Score: ${format(AutoGlyphProcessor.filterValue(this.$parent.glyph), 1, 1)}`
        : "";
      return this.onTouchDevice
        ? `Sacrifice for ${powerText}${filterScoreText}`
        : `Can be sacrificed for ${powerText}${filterScoreText}`;
    },
    eventHandlers() {
      return GameUI.touchDevice ? {
        touchstart: this.touchStart,
        dragstart: this.dragStart,
        dragEnd: this.dragEnd,
      } : {};
    },
    pointerEventStyle() {
      // With computer mice, it's nice to just totally disable mouse events on the tooltip,
      // which reduces the chances for stupidity
      return this.onTouchDevice ? {} : { "pointer-events": "none" };
    }
  },
  methods: {
    touchStart() {
      // We _don't_ preventDefault here because we want the event to turn into a local
      // dragstart that we can intercept
      this.$parent.$emit("tooltip-touched");
    },
    dragStart(ev) {
      // Prevent dragging by tooltip on mobile
      ev.preventDefault();
      ev.stopPropagation();
    },
    dragEnd(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    removeGlyph() {
      GlyphSacrificeHandler.removeGlyph(Glyphs.findById(this.id), false);
    },
  },
  mounted() {
    // By attaching the tooltip to the body element, we make sure it ends up on top of anything
    // else, with no z order shenanigans
    document.body.appendChild(this.$el);
  },
  destroyed() {
    document.body.removeChild(this.$el);
  },
  template: `
  <div class="l-glyph-tooltip c-glyph-tooltip"
       :style="pointerEventStyle"
       v-on="eventHandlers">
    <div class="l-glyph-tooltip__header">
      <span class="c-glyph-tooltip__description"
            :style="descriptionStyle">{{description}}</span>
      <span class="l-glyph-tooltip__level" :style="levelStyle">{{levelText}}</span>
    </div>
    <div class="l-glyph-tooltip__effects">
      <effect-desc v-for="e in sortedEffects"
                   :key="e.id"
                   :effect="e.id"
                   :value="e.value"/>
    </div>
    <div v-if="showDeletionText"
         :class="['c-glyph-tooltip__sacrifice', {'c-glyph-tooltip__sacrifice--touchable': onTouchDevice}]"
         v-on="onTouchDevice ? { click: removeGlyph } : {}">
      {{sacrificeText}}
    </div>
  </div>
  `,
};

Vue.component("glyph-component", {
  components: {
    "glyph-tooltip": GlyphTooltipComponent,
  },
  props: {
    glyph: Object,
    showSacrifice: {
      type: Boolean,
      default: false,
    },
    noLevelOverride: {
      type: Boolean,
      default: false,
    },
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
    circular: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      componentID: UIID.next(),
      isDragging: false,
      // This flag is used to prevent the tooltip from being shown in some touch event sequences
      suppressTooltip: false,
      isTouched: false,
      sacrificeReward: 0,
      levelOverride: 0,
      isRealityGlyph: false,
      glyphEffects: [],
      // We use this to not create a ton of tooltip components as soon as the glyph tab loads.
      tooltipLoaded: false,
    };
  },
  computed: {
    hasTooltip() {
      return Boolean(this.glyph.effects);
    },
    typeConfig() {
      return GlyphTypes[this.glyph.type];
    },
    symbol() {
      const symbol = this.glyph.symbol;
      if (symbol) {
        return symbol.startsWith("key") ? specialGlyphSymbols[symbol] : symbol;
      }
      return this.$viewModel.theme === "S4" ? CANCER_GLYPH_SYMBOLS[this.glyph.type] : this.typeConfig.symbol;
    },
    borderColor() {
      return this.glyph.color || this.typeConfig.color;
    },
    overStyle() {
      return {
        width: this.size,
        height: this.size,
        position: "absolute",
        "background-color": "rgba(0, 0, 0, 0)",
        "box-shadow": `0 0 ${this.glowBlur} calc(${this.glowSpread} + 0.1rem) ${this.borderColor} inset`,
        "border-radius": this.circular ? "50%" : "0",
        animation: this.isRealityGlyph ? "a-reality-glyph-over-cycle 10s infinite" : undefined,
      };
    },
    outerStyle() {
      return {
        width: this.size,
        height: this.size,
        "background-color": this.borderColor,
        "box-shadow": `0 0 ${this.glowBlur} ${this.glowSpread} ${this.borderColor}`,
        "border-radius": this.circular ? "50%" : "0",
        animation: this.isRealityGlyph ? "a-reality-glyph-outer-cycle 10s infinite" : undefined,
      };
    },
    innerStyle() {
      const rarityColor = this.glyph.color || getRarity(this.glyph.strength).color;
      return {
        width: `calc(${this.size} - 0.2rem)`,
        height: `calc(${this.size} - 0.2rem)`,
        "font-size": `calc( ${this.size} * ${this.textProportion} )`,
        color: rarityColor,
        "text-shadow": `-0.04em 0.04em 0.08em ${rarityColor}`,
        "border-radius": this.circular ? "50%" : "0",
        animation: this.isRealityGlyph ? "a-reality-glyph-icon-cycle 10s infinite" : undefined,
      };
    },
    mouseEventHandlers() {
      const handlers = this.hasTooltip ? {
        mouseenter: this.mouseEnter,
        "&mousemove": this.mouseMove,
        mouseleave: this.mouseLeave,
        mousedown: this.mouseDown,
        touchstart: this.touchStart,
        touchend: this.touchEnd
      } : {};
      if (this.hasTooltip || this.draggable) {
        handlers.touchmove = this.touchMove;
      }
      return handlers;
    },
    isCurrentTooltip() {
      return this.$viewModel.tabs.reality.currentGlyphTooltip === this.componentID;
    },
    tooltipDirectionClass() {
      return this.$viewModel.tabs.reality.glyphTooltipDirection === 1
        ? "l-glyph-tooltip--up-left" : "l-glyph-tooltip--down-left";
    },
  },
  created() {
    this.$on("tooltip-touched", () => this.hideTooltip());
  },
  beforeDestroy() {
    if (this.isCurrentTooltip) this.hideTooltip();
    if (this.$viewModel.draggingUIID === this.componentID) this.$viewModel.draggingUIID = -1;
  },
  methods: {
    update() {
      this.isRealityGlyph = this.glyph.type === "reality";
      this.glyphEffects = this.extractGlyphEffects();
      this.showGlyphEffectDots = player.options.showHintText.glyphEffectDots;
    },
    // This finds all the effects of a glyph and shifts all their IDs so that type's lowest-ID effect is 0 and all
    // other effects count up to 3 (or 6 for effarig). Used to add dots in unique positions on glyphs to show effects.
    extractGlyphEffects() {
      let minEffectID = 0;
      switch (this.glyph.type) {
        case "time":
        case "cursed":
        case "companion":
          minEffectID = 0;
          break;
        case "dilation":
        case "reality":
          minEffectID = 4;
          break;
        case "replication":
          minEffectID = 8;
          break;
        case "infinity":
          minEffectID = 12;
          break;
        case "power":
          minEffectID = 16;
          break;
        case "effarig":
          minEffectID = 20;
          break;
        default:
          throw new Error(`Unrecognized glyph type "${this.glyph.type}" in glyph effect icons`);
      }
      const effectIDs = [];
      // eslint-disable-next-line no-bitwise
      let remainingEffects = this.glyph.effects >> minEffectID;
      for (let id = 0; remainingEffects > 0; id++) {
        // eslint-disable-next-line no-bitwise
        if ((remainingEffects & 1) === 1) effectIDs.push(id);
        // eslint-disable-next-line no-bitwise
        remainingEffects >>= 1;
      }
      return effectIDs;
    },
    hideTooltip() {
      this.$viewModel.tabs.reality.currentGlyphTooltip = -1;
    },
    showTooltip() {
      this.tooltipLoaded = true;
      this.$viewModel.tabs.reality.currentGlyphTooltip = this.componentID;
      this.sacrificeReward = GlyphSacrificeHandler.isRefining &&
        ALCHEMY_BASIC_GLYPH_TYPES.includes(this.glyph.type)
        ? GlyphSacrificeHandler.glyphRefinementGain(this.glyph)
        : GlyphSacrificeHandler.glyphSacrificeGain(this.glyph);
      this.levelOverride = this.noLevelOverride ? 0 : getAdjustedGlyphLevel(this.glyph);
    },
    moveTooltipTo(x, y) {
      // If we are just creating the tooltip now, we can't move it yet.
      if (!this.$refs.tooltip) {
        this.$nextTick(() => this.moveTooltipTo(x, y));
        return;
      }
      const tooltipEl = this.$refs.tooltip.$el;
      if (tooltipEl) {
        const rect = document.body.getBoundingClientRect();
        tooltipEl.style.left = `${x - rect.left}px`;
        tooltipEl.style.top = `${y - rect.top}px`;
        if (this.$viewModel.tabs.reality.glyphTooltipDirection === 1) {
          // In case of a really short screen, don't flicker back and forth
          if (y - tooltipEl.offsetHeight <= 0 && y + tooltipEl.offsetHeight < rect.height) {
            this.$viewModel.tabs.reality.glyphTooltipDirection = -1;
          }
        } else if (y + tooltipEl.offsetHeight >= rect.height) {
          this.$viewModel.tabs.reality.glyphTooltipDirection = 1;
        }
      }
    },
    mouseEnter(ev) {
      if (this.$viewModel.draggingUIID !== -1) return;
      this.moveTooltipTo(ev.clientX, ev.clientY);
      this.showTooltip();
    },
    mouseLeave() {
      if (this.isCurrentTooltip) {
        this.hideTooltip();
      }
    },
    mouseDown() {
      if (this.isTouched) return;
      this.hideTooltip();
    },
    mouseMove(ev) {
      if (this.isTouched) return;
      this.moveTooltipTo(ev.clientX, ev.clientY);
    },
    dragStart(ev) {
      this.hideTooltip();
      this.isDragging = true;
      this.suppressTooltip = true;
      ev.dataTransfer.setData(GLYPH_MIME_TYPE, this.glyph.id.toString());
      ev.dataTransfer.dropEffect = "move";
      const rect = this.$refs.over.getBoundingClientRect();
      ev.dataTransfer.setDragImage(this.$refs.over, ev.clientX - rect.left, ev.clientY - rect.top);
      this.$viewModel.draggingUIID = this.componentID;
      const dragInfo = this.$viewModel.tabs.reality.draggingGlyphInfo;
      dragInfo.id = this.glyph.id;
      dragInfo.type = this.glyph.type;
      dragInfo.sacrificeValue = GlyphSacrificeHandler.glyphSacrificeGain(this.glyph);
    },
    dragEnd() {
      this.isDragging = false;
      this.suppressTooltip = false;
      this.$viewModel.scrollWindow = 0;
      if (this.$viewModel.draggingUIID === this.componentID) this.$viewModel.draggingUIID = -1;
    },
    drag(ev) {
      // It looks like dragging off the bottom of the window sometimes fires these
      // odd events
      if (ev.screenX === 0 && ev.screenY === 0) {
        this.$viewModel.scrollWindow = 0;
        return;
      }
      const boundary = 100;
      if (ev.clientY < boundary) {
        this.$viewModel.scrollWindow = -1 + 0.9 * ev.clientY / boundary;
      } else if (ev.clientY > $(window).height() - boundary) {
        this.$viewModel.scrollWindow = 1 - 0.9 * ($(window).height() - ev.clientY) / boundary;
      } else {
        this.$viewModel.scrollWindow = 0;
      }
    },
    touchStart() {
      this.isTouched = true;
    },
    touchEnd(e) {
      if (this.isCurrentTooltip) {
        e.preventDefault();
        this.hideTooltip();
      } else if (!this.suppressTooltip) {
        e.preventDefault();
        this.showTooltip();
        this.moveTooltipTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
      this.suppressTooltip = false;
      this.isTouched = false;
    },
    touchMove(e) {
      const t = e.changedTouches[0];
      const r = this.$refs.over.getBoundingClientRect();
      if (t.clientX < r.left || t.clientY < r.top || t.clientX > r.left + r.width || t.clientY > r.top + r.height) {
        this.suppressTooltip = true;
      }
      if (this.isDragging) {
        // DragDropTouch doesn't seem to send drag events.
        this.drag(t);
      }
    },
    glyphEffectIcon(id) {
      if (this.glyph.type === "companion") return {};
      // Place dots clockwise starting from the bottom left
      const angle = this.glyph.type === "effarig"
        ? (Math.PI / 4) * (id + 1)
        : (Math.PI / 2) * (id + 0.5);
      const scale = 0.3 * this.size.replace("rem", "");
      const dx = -scale * Math.sin(angle);
      const dy = scale * (Math.cos(angle) + 0.15);
      return {
        position: "absolute",
        width: "0.3rem",
        height: "0.3rem",
        "border-radius": "50%",
        background: `${this.glyph.color || getRarity(this.glyph.strength).color}`,
        transform: `translate(${dx}rem, ${dy}rem)`,
        animation: this.glyph.type === "reality" ? "a-reality-glyph-dot-cycle 10s infinite" : "none",
        opacity: Theme.current().name === "S9" ? 0 : 0.8
      };
    }
  },
  template: `
  <!-- The naive approach with a border and box-shadow seems to have problems with
      weird seams/artifacts at the edges. This makes for a rather complex workaround -->
    <div :style="outerStyle"
         :class="['l-glyph-component', {'c-glyph-component--dragging': isDragging}]"
         :draggable="draggable"
         v-on="draggable ? { dragstart: dragStart,
                             dragend: dragEnd,
                             drag: drag } : {}">
      <div ref="glyph"
           :style="innerStyle"
           :class="['l-glyph-component', 'c-glyph-component']">
        {{symbol}}
        <div v-if="$viewModel.shiftDown || showGlyphEffectDots" v-for="x in glyphEffects"
          :style="glyphEffectIcon(x)"/>
        <glyph-tooltip v-if="hasTooltip && tooltipLoaded"
                       v-show="isCurrentTooltip"
                       ref="tooltip"
                       v-bind="glyph"
                       :class="tooltipDirectionClass"
                       :sacrificeReward="sacrificeReward"
                       :showDeletionText="showSacrifice"
                       :levelOverride="levelOverride"
                       :component="componentID"/>
      </div>
      <div ref="over"
           :style="overStyle"
           v-on="mouseEventHandlers"
           @click.shift.exact="$emit('shiftClicked', glyph.id)"
           @click.ctrl.shift.exact="$emit('ctrlShiftClicked', glyph.id)"
           @click.meta.shift.exact="$emit('ctrlShiftClicked', glyph.id)"
           @click.exact="$emit('clicked', glyph.id)"/>
    </div>
  `,
});
