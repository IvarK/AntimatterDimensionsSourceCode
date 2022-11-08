<script>
import { GlyphInfo } from "../../src/components/modals/options/SelectGlyphInfoDropdown";

import GlyphTooltip from "@/components/GlyphTooltip";

export default {
  name: "GlyphComponent",
  components: {
    GlyphTooltip
  },
  props: {
    glyph: {
      type: Object,
      required: true
    },
    isInModal: {
      type: Boolean,
      required: false,
      default: false
    },
    isNew: {
      type: Boolean,
      required: false,
      default: false
    },
    showSacrifice: {
      type: Boolean,
      required: false,
      default: false
    },
    ignoreModifiedLevel: {
      type: Boolean,
      required: false,
      default: false
    },
    realityGlyphBoost: {
      type: Number,
      required: false,
      default: 0
    },
    isInventoryGlyph: {
      type: Boolean,
      required: false,
      default: false
    },
    isActiveGlyph: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: "5rem",
    },
    glowBlur: {
      type: String,
      required: false,
      default: "1rem"
    },
    glowSpread: {
      type: String,
      required: false,
      default: "0.2rem"
    },
    bottomPadding: {
      type: String,
      required: false,
      default: "0.3rem"
    },
    textProportion: {
      type: Number,
      required: false,
      default: 0.5
    },
    circular: {
      type: Boolean,
      required: false,
      default: false,
    },
    draggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    flipTooltip: {
      type: Boolean,
      required: false,
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
      tooltipEnabled: false,
      sacrificeReward: 0,
      uncappedRefineReward: 0,
      refineReward: 0,
      displayLevel: 0,
      // We use this to not create a ton of tooltip components as soon as the glyph tab loads.
      tooltipLoaded: false,
      logTotalSacrifice: 0,
      // This exists to dynamically adjust reality glyph colors over time - this used to use a keyframe animation, but
      // applying that was causing large amounts of lag due to the number of independent and partially overlapping
      // elements it was applying it to. Of note - null transform hacks did not seem to improve performance either.
      colorTimer: 0,
    };
  },
  computed: {
    hasTooltip() {
      return Boolean(this.glyph.effects);
    },
    typeConfig() {
      return GlyphTypes[this.glyph.type];
    },
    isBlobHeart() {
      return this.$viewModel.theme === "S11" && this.glyph.type === "companion";
    },
    symbol() {
      const symbol = this.glyph.symbol;
      // \uE019 = :blobheart:
      if (this.isBlobHeart) return "\uE019";
      if (symbol) return symbol;
      return this.$viewModel.theme === "S4" ? CANCER_GLYPH_SYMBOLS[this.glyph.type] : this.typeConfig.symbol;
    },
    zIndexStyle() {
      return { "z-index": this.isInModal ? 7 : 6 };
    },
    borderColor() {
      if (this.isRealityGlyph) return this.realityGlyphColor();
      if (this.isCursedGlyph) return this.cursedColor;
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
      };
    },
    outerStyle() {
      return {
        width: this.size,
        height: this.size,
        "background-color": this.borderColor,
        "box-shadow": `0 0 ${this.glowBlur} ${this.glowSpread} ${this.borderColor}`,
        "border-radius": this.circular ? "50%" : "0",
        "-webkit-user-drag": this.draggable ? "" : "none"
      };
    },
    cursedColor() {
      return Theme.current().isDark() || player.options.forceDarkGlyphs ? "black" : "white";
    },
    cursedColorInverted() {
      return Theme.current().isDark() || player.options.forceDarkGlyphs ? "white" : "black";
    },
    innerStyle() {
      const rarityColor = this.isRealityGlyph
        ? this.realityGlyphColor()
        : (this.glyph.color || getColor(this.glyph.strength));
      const textShadow = this.isCursedGlyph
        ? `-0.04em 0.04em 0.08em ${this.cursedColor}`
        : `-0.04em 0.04em 0.08em ${rarityColor}`;
      const defaultBG = player.options.forceDarkGlyphs || Theme.current().isDark()
        ? "black"
        : "white";
      return {
        width: `calc(${this.size} - 0.2rem)`,
        height: `calc(${this.size} - 0.2rem)`,
        "font-size": `calc( ${this.size} * ${this.textProportion} )`,
        color: this.isCursedGlyph ? this.cursedColor : rarityColor,
        "text-shadow": this.isBlobHeart ? undefined : textShadow,
        "border-radius": this.circular ? "50%" : "0",
        "padding-bottom": this.bottomPadding,
        background: this.isCursedGlyph ? this.cursedColorInverted : defaultBG
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
      let directionID = this.$viewModel.tabs.reality.glyphTooltipDirection;
      if (this.flipTooltip) directionID += 1;
      switch (directionID) {
        case -1:
          return "l-glyph-tooltip--down-left";
        case 0:
          return "l-glyph-tooltip--down-right";
        case 1:
          return "l-glyph-tooltip--up-left";
        case 2:
          return "l-glyph-tooltip--up-right";
        default:
          return "";
      }
    },
    // This finds all the effects of a glyph and shifts all their IDs so that type's lowest-ID effect is 0 and all
    // other effects count up to 3 (or 6 for effarig). Used to add dots in unique positions on glyphs to show effects.
    glyphEffects() {
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
      let remainingEffects = this.glyph.effects >> minEffectID;
      for (let id = 0; remainingEffects > 0; id++) {
        if ((remainingEffects & 1) === 1) effectIDs.push(id);
        remainingEffects >>= 1;
      }
      return effectIDs;
    },
    isRealityGlyph() {
      return this.glyph.type === "reality";
    },
    isCursedGlyph() {
      return this.glyph.type === "cursed";
    },
    showGlyphEffectDots() {
      return player.options.showHintText.glyphEffectDots;
    },
    displayedInfo() {
      const blacklist = ["companion", "cursed"];
      if (!this.isInventoryGlyph || blacklist.includes(this.glyph.type)) return null;

      const options = player.options.showHintText;
      if (options.glyphInfoType === GlyphInfo.types.NONE ||
        (!options.showGlyphInfoByDefault && !this.$viewModel.shiftDown)) {
        return null;
      }

      const typeEnum = GlyphInfo.types;
      switch (options.glyphInfoType) {
        case typeEnum.LEVEL:
          this.updateDisplayLevel();
          return formatInt(this.displayLevel === 0 ? this.glyph.level : this.displayLevel);
        case typeEnum.RARITY:
          return formatRarity(strengthToRarity(Pelle.isDoomed ? Pelle.glyphStrength : this.glyph.strength));
        case typeEnum.SAC_VALUE:
          return format(this.sacrificeReward, 2, 2);
        case typeEnum.FILTER_SCORE:
          return format(AutoGlyphProcessor.filterValue(this.glyph), 1, 1);
        case typeEnum.CURRENT_REFINE:
          return `${format(this.refineReward, 2, 2)} ${this.symbol}`;
        case typeEnum.MAX_REFINE:
          return `${format(this.uncappedRefineReward, 2, 2)} ${this.symbol}`;
        default:
          throw new Error("Unrecognized Glyph info type in info text");
      }
    }
  },
  watch: {
    logTotalSacrifice() {
      this.tooltipLoaded = false;
      if (this.isCurrentTooltip) this.showTooltip();
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("innerStyle");
      this.$recompute("cursedColor");
      this.$recompute("cursedColorInverted");
      this.$recompute("showGlyphEffectDots");
      this.$recompute("displayedInfo");
    });
    this.on$("tooltip-touched", () => this.hideTooltip());
    this.on$(GAME_EVENT.TAB_CHANGED, () => this.hideTooltip());

    // There are a few situations where a tooltip could attempt to render immediately upon component creation,
    // which causes it to be placed in an odd "default" corner spot due to mouse position not being set properly.
    // This is essentially a hack that force-suppresses tooltips from being shown in strange spots due to on-load
    // events firing, but has the side effect that the mouse must leave and enter an element which was created
    // underneath it in order to make the tooltip appear
    setTimeout(() => this.tooltipEnabled = true, 10);
  },
  beforeDestroy() {
    if (this.isCurrentTooltip) this.hideTooltip();
    if (this.$viewModel.draggingUIID === this.componentID) this.$viewModel.draggingUIID = -1;
  },
  methods: {
    update() {
      this.logTotalSacrifice = GameCache.logTotalGlyphSacrifice.value;
      this.colorTimer = (this.colorTimer + 4) % 1000;
      this.sacrificeReward = GlyphSacrificeHandler.glyphSacrificeGain(this.glyph);
      this.uncappedRefineReward = ALCHEMY_BASIC_GLYPH_TYPES.includes(this.glyph.type)
        ? GlyphSacrificeHandler.glyphRawRefinementGain(this.glyph)
        : 0;
      this.refineReward = ALCHEMY_BASIC_GLYPH_TYPES.includes(this.glyph.type)
        ? GlyphSacrificeHandler.glyphRefinementGain(this.glyph)
        : 0;
      if (this.tooltipLoaded) this.updateDisplayLevel();
    },
    updateDisplayLevel() {
      if (this.ignoreModifiedLevel) {
        this.displayLevel = 0;
        return;
      }
      const levelBoost = BASIC_GLYPH_TYPES.includes(this.glyph.type) ? this.realityGlyphBoost : 0;
      let adjustedLevel = this.isActiveGlyph
        ? getAdjustedGlyphLevel(this.glyph)
        : this.glyph.level + levelBoost;
      if (Pelle.isDoomed && this.isInventoryGlyph) adjustedLevel = Math.min(adjustedLevel, Pelle.glyphMaxLevel);
      this.displayLevel = adjustedLevel;
    },
    // This produces a linearly interpolated color between the basic glyph colors, but with RGB channels copied and
    // hardcoded from the color data because that's probably preferable to a very hacky hex conversion method. The
    // order used is {infinity, dilation, power, replication, time, infinity, ... }
    realityGlyphColor() {
      // RGB values for the colors to interpolate between
      const r = [182, 100, 34, 3, 178, 182];
      const g = [127, 221, 170, 169, 65, 127];
      const b = [51, 23, 72, 244, 227, 51];

      // Integer and fractional parts for interpolation parameter
      const i = Math.floor(this.colorTimer / 200);
      const f = this.colorTimer / 200 - i;

      return `rgb(${r[i] * (1 - f) + r[i + 1] * f},
        ${g[i] * (1 - f) + g[i + 1] * f},
        ${b[i] * (1 - f) + b[i + 1] * f})`;
    },
    hideTooltip() {
      this.tooltipLoaded = false;
      this.$viewModel.tabs.reality.mouseoverGlyphInfo.type = "";
      this.$viewModel.tabs.reality.mouseoverGlyphInfo.inInventory = false;
      this.$viewModel.tabs.reality.currentGlyphTooltip = -1;
    },
    showTooltip() {
      if (!this.tooltipEnabled) return;
      Glyphs.removeNewFlag(this.glyph);
      this.tooltipLoaded = true;
      this.$viewModel.tabs.reality.mouseoverGlyphInfo.inInventory = !this.circular;
      const glyphInfo = this.$viewModel.tabs.reality.mouseoverGlyphInfo;
      glyphInfo.type = this.glyph.type;
      glyphInfo.sacrificeValue = GlyphSacrificeHandler.glyphSacrificeGain(this.glyph);
      glyphInfo.refineValue = GlyphSacrificeHandler.glyphRawRefinementGain(this.glyph);
      this.$viewModel.tabs.reality.currentGlyphTooltip = this.componentID;
      if (
        AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.SACRIFICE ||
        (AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE_TO_CAP && this.refineReward === 0)
      ) {
        this.currentAction = "sacrifice";
      } else {
        this.currentAction = "refine";
      }
      this.scoreMode = AutoGlyphProcessor.scoreMode;
    },
    moveTooltipTo(x, y) {
      // If we are just creating the tooltip now, we can't move it yet.
      if (!this.$refs.tooltip) return;
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
      if (this.isTouched || Theme.current().name === "S7") return;
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
      const dragInfo = this.$viewModel.tabs.reality.draggingGlyphInfo;
      dragInfo.id = -1;
      dragInfo.type = "";
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
      } else if (ev.clientY > window.innerHeight - boundary) {
        this.$viewModel.scrollWindow = 1 - 0.9 * (window.innerHeight - ev.clientY) / boundary;
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
    // Translates 0...3 into equally-spaced coordinates around a circle 90deg apart (0...6 and 45deg for effarig)
    effectIconPos(id) {
      // Place dots clockwise starting from the bottom left
      const angle = this.glyph.type === "effarig"
        ? (Math.PI / 4) * (id + 1)
        : (Math.PI / 2) * (id + 0.5);
      const scale = 0.3 * this.size.replace("rem", "");
      const dx = -scale * Math.sin(angle);
      const dy = scale * (Math.cos(angle) + 0.15);
      return { dx, dy };
    },
    glyphColor() {
      if (this.isCursedGlyph) return this.cursedColor;
      if (this.isRealityGlyph) return this.realityGlyphColor();
      return `${this.glyph.color || getColor(this.glyph.strength)}`;
    },
    // Note that the dot bigger for one of the mutually-exclusive effect pair (IDs of the only case are hardcoded)
    glyphEffectIcon(id) {
      if (this.glyph.type === "companion") return {};
      const pos = this.effectIconPos(id);

      return {
        position: "absolute",
        width: "0.3rem",
        height: "0.3rem",
        "border-radius": "50%",
        background: this.glyphColor(),
        transform: `translate(${pos.dx - 0.15 * 0.3}rem, ${pos.dy - 0.15 * 0.3}rem)`,
        opacity: Theme.current().name === "S9" ? 0 : 0.8
      };
    },
  }
};
</script>

<template>
  <!--
    The naive approach with a border and box-shadow seems to have problems with
    weird seams/artifacts at the edges. This makes for a rather complex workaround
  -->
  <div
    :style="outerStyle"
    :class="['l-glyph-component', {'c-glyph-component--dragging': isDragging}]"
    :draggable="draggable"
    v-on="draggable ? { dragstart: dragStart, dragend: dragEnd, drag: drag } : {}"
  >
    <div
      ref="glyph"
      :style="innerStyle"
      :class="['l-glyph-component', 'c-glyph-component']"
    >
      {{ symbol }}
      <template v-if="$viewModel.shiftDown || showGlyphEffectDots">
        <div
          v-for="x in glyphEffects"
          :key="x"
          :style="glyphEffectIcon(x)"
        />
      </template>
    </div>
    <GlyphTooltip
      v-if="hasTooltip && tooltipLoaded"
      v-show="isCurrentTooltip"
      ref="tooltip"
      v-bind="glyph"
      :class="tooltipDirectionClass"
      :style="zIndexStyle"
      :sacrifice-reward="sacrificeReward"
      :refine-reward="refineReward"
      :uncapped-refine-reward="uncappedRefineReward"
      :current-action="currentAction"
      :score-mode="scoreMode"
      :show-deletion-text="showSacrifice"
      :display-level="displayLevel"
      :component="componentID"
      :change-watcher="logTotalSacrifice"
    />
    <div
      v-if="isNew"
      class="l-new-glyph"
    >
      New!
    </div>
    <div
      v-if="displayedInfo"
      class="l-glyph-info"
    >
      {{ displayedInfo }}
    </div>
    <div
      ref="over"
      :style="overStyle"
      v-on="mouseEventHandlers"
      @click.shift.exact="$emit('shiftClicked', glyph.id)"
      @click.ctrl.shift.exact="$emit('ctrlShiftClicked', glyph.id)"
      @click.meta.shift.exact="$emit('ctrlShiftClicked', glyph.id)"
      @click.exact="$emit('clicked', glyph.id)"
    />
  </div>
</template>
