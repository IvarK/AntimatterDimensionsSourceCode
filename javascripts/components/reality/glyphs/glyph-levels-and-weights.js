"use strict";

// The things inside player.celestials.effarig.glyphWeights
const _GLYPH_WEIGHT_FIELDS = ["ep", "repl", "dt", "eternities"];

Vue.component("glyph-levels-and-weights", {
  data() {
    return {
      adjustVisible: false,
      eternityVisible: false,
      perkShopVisible: false,
      penaltyVisible: false,
      rowVisible: false,
      achievementVisible: false,
      shardVisible: false,
      singularityVisible: false,
      showAutoAdjustWeights: false,
      isAutoAdjustWeightsOn: false,
      factors: getGlyphLevelInputs(),
      weights: Object.assign({}, player.celestials.effarig.glyphWeights),
      rows: 3,
    };
  },
  watch: {
    isAutoAdjustWeightsOn(newValue) {
      player.celestials.effarig.autoAdjustGlyphWeights = newValue;
    }
  },
  created() {
    // Private data to deal with weight allocation
    this.resetSavedWeights();
    // Used to debounce this row disappearing
    this.lastInstability = 0;
    if (Glyphs.factorsOpen) this.$parent.$emit("openrequest");
  },
  mounted() {
    // Effarig unlock sets a flag to open this dropdown
    if (this.$viewModel.tabs.reality.openGlyphWeights) {
      this.$viewModel.tabs.reality.openGlyphWeights = false;
      this.$parent.$emit("openrequest");
    }
  },
  destroyed() {
    // Matches substring since there are states for opening in progress, all of which have "open" as a substring
    Glyphs.factorsOpen = this.$parent.state.name.match("OPEN") !== null;
  },
  computed: {
    gridStyle() {
      // Column specifications: {factor_name, math_operator, factor_value, weight_adjustment, padding}
      const columns = this.adjustVisible ? "32% 3% 15% 48% 2%" : "65% 5% 30%";
      return {
        width: "100%",
        "-ms-grid-columns": columns,
        "grid-template-columns": columns,
        "grid-auto-rows": "1fr",
      };
    },
    adjustOutlineStyle() {
      const rows = 5 + (this.showAutoAdjustWeights ? 1 : 0);
      return `grid-row: 1 / ${rows + 1}; -ms-grid-row: 1; -ms-grid-row-span: ${rows};`;
    },
    formatPerkShop() {
      return formatPercents(this.factors.perkShop - 1, 1);
    },
    sliderProps() {
      return {
        min: 0,
        max: 100,
        interval: 1,
        show: true,
        "dot-width": "2.2rem",
        "dot-height": "1.6rem",
        width: "13.5rem",
        tooltip: false,
        "value-in-dot": true,
        "plus-minus-buttons": true,
        "dot-class": "c-glyph-levels-and-weights__slider-handle",
        "bg-class": "c-glyph-levels-and-weights__slider-bg",
        "process-class": "c-glyph-levels-and-weights__slider-process",
        direction: "horizontal",
      };
    },
    totalWeights() {
      return this.weights.ep + this.weights.repl + this.weights.dt + this.weights.eternities;
    },
    // The order that elements gets pushed in this method determines the display order
    visibleRows() {
      const rows = ["ep", "replicanti", "dt"];
      if (this.eternityVisible) rows.push("eternities");
      if (this.perkShopVisible) rows.push("perk shop");
      if (this.shardVisible) rows.push("shards");
      if (this.singularityVisible) rows.push("singularities");
      if (this.penaltyVisible) rows.push("instability");
      if (this.rowVisible) rows.push("upgrade rows");
      if (this.achievementVisible) rows.push("achievements");
      rows.push("level");
      rows.push("info");
      return rows;
    },
  },
  methods: {
    update() {
      this.adjustVisible = EffarigUnlock.adjuster.isUnlocked;
      this.eternityVisible = RealityUpgrade(18).isBought;
      const glyphFactors = getGlyphLevelInputs();
      this.perkShopVisible = glyphFactors.perkShop !== 1;
      this.rowVisible = glyphFactors.rowFactor > 0;
      this.achievementVisible = glyphFactors.achievementFactor > 0;
      this.shardVisible = Ra.has(RA_UNLOCKS.SHARD_LEVEL_BOOST) && Effarig.shardsGained !== 0;
      this.singularityVisible = SingularityMilestone.glyphLevelFromSingularities.isUnlocked;
      if (glyphFactors.scalePenalty !== 1) {
        this.penaltyVisible = true;
        this.lastInstability = Date.now();
      } else if (this.penaltyVisible) {
        if (Date.now() - this.lastInstability > 2000) this.penaltyVisible = false;
      }
      this.rows = this.visibleRows.length;
      if (this.adjustVisible && this.rows < 6) {
        // Keep UI from getting crammed
        this.rows = 6;
      }
      this.factors = glyphFactors;
      let same = true;
      _GLYPH_WEIGHT_FIELDS.forEach(e => {
        if (this.weights[e] !== player.celestials.effarig.glyphWeights[e]) same = false;
        this.weights[e] = player.celestials.effarig.glyphWeights[e];
      });
      if (!same) {
        // In this case, some other code reset the weights, probably (hopefully)
        // the achievement reward that automatically adjusts weights.
        this.resetSavedWeights();
      }
      this.showAutoAdjustWeights = Achievement(165).isUnlocked;
      this.isAutoAdjustWeightsOn = player.celestials.effarig.autoAdjustGlyphWeights;
    },
    rowStyle(factor) {
      const row = this.visibleRows.findIndex(r => r === factor) + 1;
      // A bit of a hack, if we can't find the resource then factor is actually a number for the padding div
      if (row === 0) return this.makeRowStyle(factor);
      return this.makeRowStyle(row);
    },
    formatFactor(x) {
      // Not applied to + perks since it's always whole; for factors < 1, the slice makes the
      // factor be fixed point.
      return Notations.current.isPainful || x > 1000
        ? format(x, 2, 2)
        : x.toPrecision(5).slice(0, 6);
    },
    formatLevel(x) {
      return x > 1000
        ? formatInt(Math.floor(x))
        : format(x, 2, 4);
    },
    makeRowStyle(r) {
      return {
        "grid-row": r,
        "-ms-grid-row": r,
      };
    },
    resetWeights() {
      _GLYPH_WEIGHT_FIELDS.forEach(e => player.celestials.effarig.glyphWeights[e] = 25);
      this.resetSavedWeights();
    },
    adjustSlider(which, value) {
      if (this.weights[which] === value) return;
      if (which !== this.lastAdjusted) {
        this.resetSavedWeights();
        // If we make the saved weight for the current adjustment be 0, there's less math to do later
        this.savedWeights[which] = 0;
        this.lastAdjusted = which;
      }
      const oldSum = this.weights.ep + this.weights.repl + this.weights.dt + this.weights.eternities;
      const oldValue = this.weights[which];
      const restSum = oldSum - oldValue;
      if (restSum + value > 100) {
        // We attempt to reduce other weights proportionally. But, we want to keep everything as
        // integer values. So, a single increment will change just one other weight. In order for
        // the sum to be 100:   100 == value + restSum * k   --->  k == (100-value)/restSum
        // Except we use the saved values instead of the current ones:
        const savedRestSum =
          this.savedWeights.ep +
          this.savedWeights.repl +
          this.savedWeights.dt +
          this.savedWeights.eternities;
        const reduceRatio = (100 - value) / savedRestSum;
        const newWeights = [];
        _GLYPH_WEIGHT_FIELDS.forEach(x => {
          if (x !== which) {
            newWeights.push(this.savedWeights[x] * reduceRatio);
          }
        });
        roundPreservingSum(newWeights);
        _GLYPH_WEIGHT_FIELDS.forEach(x => {
          if (x !== which) {
            player.celestials.effarig.glyphWeights[x] = newWeights.shift();
          }
        });
      }
      player.celestials.effarig.glyphWeights[which] = value;
    },
    resetSavedWeights() {
      this.savedWeights = Object.assign({}, player.celestials.effarig.glyphWeights);
      this.lastAdjusted = null;
    },
    factorString(source) {
      const name = this.adjustVisible ? source.name.substring(0, 4) : source.name;
      return `${format(source.coeff, 2, 4)}×${name}^${format(source.exp, 2, 3)}`;
    }
  },
  template: `
    <div ref="grid" :style="gridStyle" class="l-glyph-levels-and-weights c-glyph-levels-and-weights">
      <!-- Put down a placeholder div to keep the adjuster from getting cramped -->
      <div v-if="adjustVisible" :style="makeRowStyle(6)" />
      <div :style="rowStyle('ep')" class="l-glyph-levels-and-weights__factor">
        {{ factorString(factors.ep) }}
      </div>
      <div :style="rowStyle('ep')" class="l-glyph-levels-and-weights__factor-val">
        {{ formatFactor(factors.ep.value) }}
      </div>
      <div :style="rowStyle('replicanti')" class="l-glyph-levels-and-weights__factor">
        {{ factorString(factors.repl) }}
      </div>
      <div :style="rowStyle('replicanti')" class="l-glyph-levels-and-weights__operator">×</div>
      <div :style="rowStyle('replicanti')" class="l-glyph-levels-and-weights__factor-val">
        {{ formatFactor(factors.repl.value) }}
      </div>
      <div :style="rowStyle('dt')" class="l-glyph-levels-and-weights__factor">
        {{ factorString(factors.dt) }}
      </div>
      <div :style="rowStyle('dt')" class="l-glyph-levels-and-weights__operator">×</div>
      <div :style="rowStyle('dt')" class="l-glyph-levels-and-weights__factor-val">
        {{ formatFactor(factors.dt.value) }}
      </div>
      <template v-if="eternityVisible">
        <div :style="rowStyle('eternities')" class="l-glyph-levels-and-weights__factor">
          {{ factorString(factors.eter) }}
        </div>
        <div :style="rowStyle('eternities')" class="l-glyph-levels-and-weights__operator">×</div>
        <div :style="rowStyle('eternities')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatFactor(factors.eter.value) }}
        </div>
      </template>
      <template v-if="perkShopVisible">
        <div :style="rowStyle('perk shop')" class="l-glyph-levels-and-weights__factor">
          Perk shop
        </div>
        <div :style="rowStyle('perk shop')" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStyle('perk shop')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatPerkShop }}
        </div>
      </template>
      <template v-if="shardVisible">
        <div :style="rowStyle('shards')" class="l-glyph-levels-and-weights__factor">
          {{ formatInt(100) }}×Shards^{{ formatInt(2) }}
        </div>
        <div :style="rowStyle('shards')" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStyle('shards')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatFactor(factors.shardFactor) }}
        </div>
      </template>
      <template v-if="singularityVisible">
        <div :style="rowStyle('singularities')" class="l-glyph-levels-and-weights__factor">
          Singularities
        </div>
        <div :style="rowStyle('singularities')" class="l-glyph-levels-and-weights__operator">×</div>
        <div :style="rowStyle('singularities')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatFactor(factors.singularityEffect) }}
        </div>
      </template>
      <template v-if="penaltyVisible">
        <div :style="rowStyle('instability')" class="l-glyph-levels-and-weights__factor">Instability</div>
        <div :style="rowStyle('instability')" class="l-glyph-levels-and-weights__operator">/</div>
        <div :style="rowStyle('instability')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatFactor(factors.scalePenalty) }}
        </div>
      </template>
      <template v-if="rowVisible">
        <div :style="rowStyle('upgrade rows')" class="l-glyph-levels-and-weights__factor">
          Upgrade Rows
        </div>
        <div :style="rowStyle('upgrade rows')" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStyle('upgrade rows')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatInt(factors.rowFactor) }}
        </div>
      </template>
      <template v-if="achievementVisible">
        <div :style="rowStyle('achievements')" class="l-glyph-levels-and-weights__factor">
          Achievements
        </div>
        <div :style="rowStyle('achievements')" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStyle('achievements')" class="l-glyph-levels-and-weights__factor-val">
          {{ formatInt(factors.achievementFactor) }}
        </div>
      </template>
      <div :style="rowStyle('level')" class="l-glyph-levels-and-weights__factor">
        Final Level
      </div>
      <div :style="rowStyle('level')" class="l-glyph-levels-and-weights__factor-val">
        {{ formatLevel(factors.actualLevel) }}
      </div>
      <div
        :style="rowStyle('info')"
        style="{ grid-column-start: 1; grid-column-end: 5; }"
        class="l-glyph-levels-and-weights__factor"
      >
        Note: All resources here are log10 of their actual values
      </div>
      <template v-if="adjustVisible">
        <div :style="adjustOutlineStyle" class="l-glyph-levels-and-weights__adjust-outline"></div>
        <div class="l-glyph-levels-and-weights__adjust-label">
          Adjust weights
          <div class="l-glyph-levels-and-weights__reset-btn-outer">
            <div
              class="l-glyph-levels-and-weights__reset-btn c-glyph-levels-and-weights__reset-btn"
              @click="resetWeights"
            >
              Reset
            </div>
          </div>
        </div>
        <div class="l-glyph-levels-and-weights__adjust-auto">
          <primary-button-on-off
            v-if="showAutoAdjustWeights"
            v-model="isAutoAdjustWeightsOn"
            class="l-glyph-levels-and-weights__auto-btn c-glyph-levels-and-weights__auto-btn"
            text="Auto adjustment:"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyle('ep')">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.ep"
            :width="'100%'"
            @input="adjustSlider('ep', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyle('replicanti')">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.repl"
            :width="'100%'"
            @input="adjustSlider('repl', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyle('dt')">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.dt"
            :width="'100%'"
            @input="adjustSlider('dt', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyle('eternities')">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.eternities"
            :width="'100%'"
            @input="adjustSlider('eternities', $event)"
          />
        </div>
      </template>
    </div>`
});

// This function takes an array of data (3 elements), which add up to an integer, but
// may not be whole numbers themselves, and tries to round them so that the sum is the same
// and so that the difference from the original is small. It does this by finding the one
// that's closest to an integer, rounding it, and then distributing that error to the others.
function roundPreservingSum(data) {
  for (let idx = 0; idx < data.length; ++idx) {
    // Find the thing that's not an integer but is closest to an integer:
    let closest = -1;
    let closestDistance = 1000;
    let nonIntegers = 0;
    for (let s = 0; s < data.length; ++s) {
      const dist = Math.abs(data[s] - Math.round(data[s]));
      if (dist !== 0) {
        ++nonIntegers;
        if (dist < closestDistance) {
          closest = s;
          closestDistance = dist;
        }
      }
    }
    // Everything is an integer
    if (closest === -1) break;
    let err = data[closest] - Math.round(data[closest]);
    data[closest] = Math.round(data[closest]);
    if (nonIntegers === 1) {
      // Shouldn't happen, but a divide by 0 would be bad
      break;
    }
    err /= (nonIntegers - 1);
    for (let s = 0; s < data.length; ++s) {
      if (data[s] !== Math.round(data[s])) {
        // Closest is covered by this
        data[s] += err;
      }
    }
  }
}
