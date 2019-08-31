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
      perkVisible: false,
      shardVisible: false,
      factors: getGlyphLevelInputs(),
      weights: Object.assign({}, player.celestials.effarig.glyphWeights),
      rows: 3,
    };
  },
  created() {
    // Private data to deal with weight allocation
    this.resetSavedWeights();
    // Used to debounce this row disappearing
    this.lastInstability = 0;
  },
  computed: {
    gridStyle() {
      const columns = this.adjustVisible ? "7.5em 1em 7em 20rem 1rem" : "auto 1em 6em";
      return {
        "-ms-grid-columns": columns,
        "grid-template-columns": columns,
        "grid-auto-rows": "1fr",
        "-ms-grid-rows": "(1fr)[" + this.rows + ")",
      };
    },
    rowStyleEP() {
      return this.makeRowStyle(1);
    },
    rowStyleReplicanti() {
      return this.makeRowStyle(2);
    },
    rowStyleDT() {
      return this.makeRowStyle(3);
    },
    rowStyleEternities() {
      return this.makeRowStyle(4);
    },
    rowStylePerkShop() {
      // Perk shop will only ever show up with eternities unlocked
      return this.makeRowStyle(5);
    },
    rowStylePenalty() {
      // Perk shop will only ever show up with eternities unlocked
      return this.makeRowStyle(4 + this.eternityVisible + this.perkShopVisible);
    },
    rowStylePerk() {
      return this.makeRowStyle(4 + this.eternityVisible + this.perkShopVisible + this.penaltyVisible);
    },
    rowStyleShard() {
      return this.makeRowStyle(4 + this.eternityVisible + this.perkShopVisible + this.penaltyVisible +
        this.perkVisible);
    },
    formatPerkShop() {
      return `${(100 * (this.factors.perkShop - 1)).toFixed(1)}%`;
    },
    sliderProps() {
      return {
        min: 0,
        max: 100,
        interval: 1,
        show: true,
        "dot-width": "2.2rem",
        "dot-height": "1.6rem",
        width: "15rem",
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
    }
  },
  methods: {
    update() {
      this.adjustVisible = EffarigUnlock.adjuster.isUnlocked;
      this.eternityVisible = RealityUpgrade(18).isBought;
      const glyphFactors = getGlyphLevelInputs();
      this.perkShopVisible = glyphFactors.perkShop !== 1;
      this.perkVisible = glyphFactors.perkFactor > 0;
      this.shardVisible = Ra.has(RA_UNLOCKS.SHARD_LEVEL_BOOST) && Effarig.shardsGained !== 0;
      if (glyphFactors.scalePenalty !== 1) {
        this.penaltyVisible = true;
        this.lastInstability = Date.now();
      } else if (this.penaltyVisible) {
        if (Date.now() - this.lastInstability > 2000) this.penaltyVisible = false;
      }
      this.rows = 3 + this.eternityVisible + this.perkShopVisible + this.perkVisible + this.penaltyVisible;
      if (this.adjustVisible && this.rows < 6) {
        // Keep UI from getting crammed
        this.rows = 6;
      }
      this.factors = glyphFactors;
      _GLYPH_WEIGHT_FIELDS.forEach(e => this.weights[e] = player.celestials.effarig.glyphWeights[e]);
    },
    formatFactor(x) {
      // Not applied to + perks since it's always whole; for factors < 1, the slice makes the
      // factor be fixed point.
      return x.toPrecision(5).slice(0, 6);
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
  },
  template: `
    <div ref="grid" :style="gridStyle" class="l-glyph-levels-and-weights c-glyph-levels-and-weights">
      <!-- Put down a placeholder div to keep the adjuster from getting cramped -->
      <div v-if="adjustVisible" :style="makeRowStyle(6)"></div>
      <div :style="rowStyleEP" class="l-glyph-levels-and-weights__factor">EP</div>
      <div :style="rowStyleEP" class="l-glyph-levels-and-weights__factor-val">{{formatFactor(factors.epEffect)}}</div>
      <div :style="rowStyleReplicanti" class="l-glyph-levels-and-weights__factor">Replicanti</div>
      <div :style="rowStyleReplicanti" class="l-glyph-levels-and-weights__operator">×</div>
      <div :style="rowStyleReplicanti" class="l-glyph-levels-and-weights__factor-val">
        {{formatFactor(factors.replEffect)}}
      </div>
      <div :style="rowStyleDT" class="l-glyph-levels-and-weights__factor">DT</div>
      <div :style="rowStyleDT" class="l-glyph-levels-and-weights__operator">×</div>
      <div :style="rowStyleDT" class="l-glyph-levels-and-weights__factor-val">{{formatFactor(factors.dtEffect)}}</div>
      <template v-if="eternityVisible">
        <div :style="rowStyleEternities" class="l-glyph-levels-and-weights__factor">Eternities</div>
        <div :style="rowStyleEternities" class="l-glyph-levels-and-weights__operator">×</div>
        <div :style="rowStyleEternities" class="l-glyph-levels-and-weights__factor-val">
          {{formatFactor(factors.eterEffect)}}
        </div>
      </template>
      <template v-if="perkShopVisible">
        <div :style="rowStylePerkShop" class="l-glyph-levels-and-weights__factor">Perk shop</div>
        <div :style="rowStylePerkShop" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStylePerkShop" class="l-glyph-levels-and-weights__factor-val">{{formatPerkShop}}</div>
      </template>
      <template v-if="penaltyVisible">
        <div :style="rowStylePenalty" class="l-glyph-levels-and-weights__factor">Instability</div>
        <div :style="rowStylePenalty" class="l-glyph-levels-and-weights__operator">/</div>
        <div :style="rowStylePenalty" class="l-glyph-levels-and-weights__factor-val">
          {{formatFactor(factors.scalePenalty)}}
        </div>
      </template>
      <template v-if="perkVisible">
        <div :style="rowStylePerk" class="l-glyph-levels-and-weights__factor">Perks</div>
        <div :style="rowStylePerk" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStylePerk" class="l-glyph-levels-and-weights__factor-val">
          {{factors.perkFactor}}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </template>
      <template v-if="shardVisible">
        <div :style="rowStyleShard" class="l-glyph-levels-and-weights__factor">Shards</div>
        <div :style="rowStyleShard" class="l-glyph-levels-and-weights__operator">+</div>
        <div :style="rowStyleShard" class="l-glyph-levels-and-weights__factor-val">
          {{formatFactor(factors.shardFactor)}}
        </div>
      </template>
      <template v-if="adjustVisible">
        <div class="l-glyph-levels-and-weights__adjust-outline"></div>
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
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyleEP">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.ep"
            @input="adjustSlider('ep', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyleReplicanti">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.repl"
            @input="adjustSlider('repl', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyleDT">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.dt"
            @input="adjustSlider('dt', $event)"
          />
        </div>
        <div class="l-glyph-levels-and-weights__slider" :style="rowStyleEternities">
          <ad-slider-component
            v-bind="sliderProps"
            :value="weights.eternities"
            @input="adjustSlider('eternities', $event)"
          />
        </div>
      </template>
    </div>
  `,
  mounted() {
    // Effarig unlock sets a flag to open this dropdown
    if (this.$viewModel.tabs.reality.openGlyphWeights) {
      this.$viewModel.tabs.reality.openGlyphWeights = false;
      this.$parent.$emit("openrequest");
    }
  }
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