"use strict";

// The things inside player.celestials.teresa.glyphWeights
const _GLYPH_WEIGHT_FIELDS = ["ep", "repl", "dt", "eternities"];

Vue.component("glyph-levels-and-weights", {
  data: function() {
    return {
      adjustVisible: false,
      eternityVisible: false,
      perkShopVisible: false,
      penaltyVisible: false,
      perkVisible: false,
      factors: getGlyphLevelInputs(),
      weights: player.celestials.teresa.glyphWeights, //Object.assign({}, player.celestials.teresa.glyphWeights),
      rows: 3,
    }
  },
  created() { // private data to deal with weight allocation
    this.resetSavedWeights();
    this.lastInstability = 0; // used to debounce this row disappearing
  },
  computed: {
    gridStyle() {
      let columns = this.adjustVisible ? "8em 2em 7em 3em 20rem 1rem" : "auto 1em 6em";
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
    rowStylePerkShop() { // perk shop will only ever show up with eternities unlocked
      return this.makeRowStyle(5);
    },
    rowStylePenalty() { // perk shop will only ever show up with eternities unlocked
      return this.makeRowStyle(4 + this.eternityVisible + this.perkShopVisible);
    },
    rowStylePerk() {
      return this.makeRowStyle(4 + this.eternityVisible + this.perkShopVisible + this.penaltyVisible);
    },
    formatPerkShop() {
      return (100 * (this.factors.perkShop - 1)).toFixed(1) + "%";
    },
    sliderProps() {
      return {
        min: 0,
        max: 100,
        interval: 1,
        show: true,
        "dot-width": "2.2rem",
        "dot-height": "1.6rem",
        width: "16rem",
        tooltip: false,
        "value-in-dot": true,
        "plus-minus-buttons": true,
        "dot-class": "glyph-level-weight-slider-handle",
        "bg-class": "glyph-level-weight-slider-bg",
        "process-class": "glyph-level-weight-slider-process",
        direction: "horizontal",
      };
    },
    totalWeights() {
      return this.weights.ep + this.weights.repl + this.weights.dt + this.weights.eternities;
    }
  },
  methods: {
    update() {
      this.adjustVisible = Teresa.has(TERESA_UNLOCKS.ADJUSTER);
      this.eternityVisible =  player.reality.upg.includes(18);
      let glyphFactors = getGlyphLevelInputs();
      this.perkShopVisible = glyphFactors.perkShop != 1;
      this.perkVisible = glyphFactors.perkFactor > 0;
      if (glyphFactors.scalePenalty != 1) {
        this.penaltyVisible = true;
        this.lastInstability = Date.now();
      } else if (this.penaltyVisible) {
        if (Date.now() - this.lastInstability > 2000) this.penaltyVisible = false;
      }
      this.rows = 3 + this.eternityVisible + this.perkShopVisible + this.perkVisible + this.penaltyVisible;
      if (this.adjustVisible && this.rows < 6) { // Keep UI from getting crammed
        this.rows = 6;
      }
      this.factors = glyphFactors;
      //["ep", "repl", "dt", "eternities"].map((x) => this.weights[x] = player.celestials.teresa.glyphWeights[x]);
    },
    formatFactor(x) { // not applied to + perks since it's always whole
      return x.toFixed(3);
    },
    makeRowStyle(r) {
      return {
        "grid-row": r,
        "-ms-grid-row": r,
      };
    },
    resetWeights() {
      this.weights.ep = 25;
      this.weights.repl = 25;
      this.weights.dt = 25;
      this.weights.eternities = 25;
      this.resetSavedWeights();
    },
    adjustSlider(which, value) {
      if (this.weights[which] == value) return;
      if (which !== this.lastAdjusted) {
        this.resetSavedWeights();
        // If we make the saved weight for the current adjustment be 0, there's less math to do later
        this.savedWeights[which] = 0;
        this.lastAdjusted = which;
      }
      let oldSum = this.weights.ep + this.weights.repl + this.weights.dt + this.weights.eternities;
      let oldValue = this.weights[which];
      let restSum = oldSum - oldValue;
      if (restSum + value > 100) {
        // We attempt to reduce other weights proportionally. But, we want to keep everything as
        // integer values. So, a single increment will change just one other weight. In order for
        // the sum to be 100:   100 == value + restSum * k   --->  k == (100-value)/restSum
        // Except we use the saved values instead of the current ones:
        let savedRestSum = this.savedWeights.ep + this.savedWeights.repl + this.savedWeights.dt + this.savedWeights.eternities;
        let reduceRatio = (100 - value) / savedRestSum;
        let newWeights = [];
        _GLYPH_WEIGHT_FIELDS.map((x) => {
          if (x != which) {
            newWeights.push(this.savedWeights[x] * reduceRatio);
          }
        });
        roundPreservingSum(newWeights)
        _GLYPH_WEIGHT_FIELDS.map((x) => {
          if (x != which) {
            this.weights[x] = newWeights.shift();
          }
        });
      }
      this.$set(this.weights, which, value);
    },
    resetSavedWeights() {
      this.savedWeights = Object.assign({}, player.celestials.teresa.glyphWeights);
      this.lastAdjusted = null;
    },
  },
  template: `
    <div ref="grid" :style="gridStyle" class="glyph-level-info-grid">
      <!-- Put down a placeholder div to keep the adjuster from getting cramped -->
      <div v-if="adjustVisible" :style="makeRowStyle(6)"></div>
      <div :style="rowStyleEP" class="glyph-level-factor">EP</div>
      <div :style="rowStyleEP" class="glyph-level-factor-val">{{formatFactor(factors.epEffect)}}</div>
      <div :style="rowStyleReplicanti" class="glyph-level-factor">Replicanti</div>
      <div :style="rowStyleReplicanti" class="glyph-level-operator">×</div>
      <div :style="rowStyleReplicanti" class="glyph-level-factor-val">{{formatFactor(factors.replEffect)}}</div>
      <div :style="rowStyleDT" class="glyph-level-factor">DT</div>
      <div :style="rowStyleDT" class="glyph-level-operator">×</div>
      <div :style="rowStyleDT" class="glyph-level-factor-val">{{formatFactor(factors.dtEffect)}}</div>
      <div v-if="eternityVisible" :style="rowStyleEternities" class="glyph-level-factor">Eternities</div>
      <div v-if="eternityVisible" :style="rowStyleEternities" class="glyph-level-operator">×</div>
      <div v-if="eternityVisible" :style="rowStyleEternities" class="glyph-level-factor-val">{{formatFactor(factors.eterEffect)}}</div>
      <div v-if="perkShopVisible" :style="rowStylePerkShop" class="glyph-level-factor">Perk shop</div>
      <div v-if="perkShopVisible" :style="rowStylePerkShop" class="glyph-level-operator">+</div>
      <div v-if="perkShopVisible" :style="rowStylePerkShop" class="glyph-level-factor-val">{{formatPerkShop}}</div>
      <div v-if="penaltyVisible" :style="rowStylePenalty" class="glyph-level-factor">Instability</div>
      <div v-if="penaltyVisible" :style="rowStylePenalty" class="glyph-level-operator">/</div>
      <div v-if="penaltyVisible" :style="rowStylePenalty" class="glyph-level-factor-val">{{formatFactor(factors.scalePenalty)}}</div>
      <div v-if="perkVisible" :style="rowStylePerk" class="glyph-level-factor">Perks</div>
      <div v-if="perkVisible" :style="rowStylePerk" class="glyph-level-operator">+</div>
      <div v-if="perkVisible" :style="rowStylePerk" class="glyph-level-factor-val">{{factors.perkFactor}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div v-if="adjustVisible" class="glyph-level-weight-adjust-label">Adjust weights</div>
      <div v-if="adjustVisible" class="glyph-level-weight-adjust-outline"></div>
      <div v-if="adjustVisible" class="glyph-level-weight-slider" :style="rowStyleEP">
        <ad-slider-component v-bind="sliderProps" :value="weights.ep" @input="adjustSlider('ep', $event)" ></ad-slider-component>
      </div>
      <div v-if="adjustVisible" class="glyph-level-weight-slider" :style="rowStyleReplicanti">
        <ad-slider-component v-bind="sliderProps" :value="weights.repl" @input="adjustSlider('repl', $event)"></ad-slider-component>
      </div>
      <div v-if="adjustVisible" class="glyph-level-weight-slider" :style="rowStyleDT">
        <ad-slider-component v-bind="sliderProps" :value="weights.dt" @input="adjustSlider('dt', $event)"></ad-slider-component>
      </div>
      <div v-if="adjustVisible" class="glyph-level-weight-slider" :style="rowStyleEternities">
        <ad-slider-component v-bind="sliderProps" :value="weights.eternities" @input="adjustSlider('eternities', $event)"></ad-slider-component>
      </div>
      <div v-if="adjustVisible" class="glyph-level-weight-reset-btn-outer">
        <div class="glyph-level-weight-reset-btn" @click="resetWeights">Reset
        </div>
      </div>
    </div>
  `,
  mounted() {
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
      let dist = Math.abs(data[s] - Math.round(data[s]));
      if (dist != 0) {
        ++nonIntegers;
        if (dist < closestDistance) {
          closest = s;
          closestDistance = dist;
        }
      }
    }
    if (closest == -1) break; // everything is an integer
    let err = data[closest] - Math.round(data[closest]);
    data[closest] = Math.round(data[closest]);
    if (nonIntegers == 1) {
      break; // shouldn't happen, but a divide by 0 would be bad
    }
    err /= (nonIntegers - 1);
    for (let s = 0; s < data.length; ++s) {
      if (data[s] != Math.round(data[s])) { // closest is covered by this
        data[s] += err;
      }
    }
  }
}