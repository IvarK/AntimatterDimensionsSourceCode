<script>
import { DC } from "../../../../javascripts/core/constants";

export default {
  name: "MultiplierBreakdownEntry",
  props: {
    resource: {
      type: String,
      required: true,
    },
    isRoot: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      selected: 0,
      baseMultList: new Decimal(0),
      powList: 0,
      percentList: [],
      showGroup: [],
      mouseoverIndex: -1,
      currentGroupKeys: [],
      isEmpty: false,
      dilationExponent: 1,
      isDilated: false,
      // This is used to temporarily remove the transition function from the bar styling when changing the way
      // multipliers are split up; the animation which results from not doing this looks very awkward
      lastLayoutChange: Date.now(),
    };
  },
  computed: {
    valueDB: () => GameDatabase.multiplierTabValues,
    treeDB: () => GameDatabase.multiplierTabTree,
    groups() {
      return this.treeDB[this.resource];
    },
    containerClass() {
      return {
        "c-multiplier-entry-container": true,
        "c-multiplier-entry-root-container": this.isRoot,
      };
    },
  },
  methods: {
    update() {
      this.currentGroupKeys = this.groups[this.selected].filter(key => this.getProp(key, "isActive"));
      this.baseMultList = this.currentGroupKeys.map(key => this.getMult(key));
      this.powList = this.currentGroupKeys.map(key => this.getPow(key));
      this.dilationExponent = this.getProp(this.resource, "dilationEffect") ?? 1;
      this.isDilated = this.dilationExponent !== 1;
      this.calculatePercents();
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      this.showGroup = Array.repeat(false, this.currentGroupKeys.length);
      this.lastLayoutChange = Date.now();
    },
    calculatePercents() {
      const totalPosPow = this.powList.filter(p => p > 1).reduce((x, y) => x * y, 1);
      const totalNegPow = this.powList.filter(p => p < 1).reduce((x, y) => x * y, 1);
      const log10Mult = (this.getProp(this.resource, "fakeValue") ?? this.getMult(this.resource)).log10() / totalPosPow;
      this.isEmpty = log10Mult === 0;
      this.percentList = [];
      for (let index = 0; index < this.baseMultList.length; index++) {
        const multFrac = log10Mult === 0
          ? 0
          : Decimal.log10(this.baseMultList[index]) / log10Mult;
        const powFrac = totalPosPow === 1 ? 0 : Math.log(this.powList[index]) / Math.log(totalPosPow);
        // Handle nerf powers differently from everything else in order to render them with the correct bar percentage
        if (this.powList[index] >= 1) this.percentList.push(multFrac / totalPosPow + powFrac * (1 - 1 / totalPosPow));
        else this.percentList.push(Math.log(this.powList[index]) / Math.log(totalNegPow) * (totalNegPow - 1));
      }

      // Shortly after a prestige, these may add up to a lot more than the base amount as production catches up. This
      // is also necessary to suppress some visual weirdness for certain categories which have lots of exponents but
      // actually apply only to specific dimensions (eg. charged infinity upgrades)
      const totalPerc = this.percentList.filter(p => p > 0).sum();
      this.percentList = this.percentList.map(p => (p > 0 ? p / totalPerc : Math.clampMin(p, -1)));
    },
    getProp(key, attr) {
      const args = key.split("_");
      const dbAttr = this.valueDB[args[0]][args[1]][attr];
      if (!dbAttr) return null;
      if (typeof dbAttr !== "function") return dbAttr;
      return args.length < 3
        ? dbAttr()
        // Arguments can potentially be Numbers or Strings, so we cast the ones which are Numbers
        : dbAttr(...args.slice(2).map(a => (a.match("^\\d+$") ? Number(a) : a)));
    },
    getMult(key) {
      return new Decimal(this.getProp(key, "multValue") ?? 1);
    },
    getPow(key) {
      return this.getProp(key, "powValue") ?? 1;
    },
    isVisible(key) {
      const noEffect = this.getMult(key).eq(1) && this.getPow(key) === 1;
      return this.getProp(key, "isActive") && !noEffect;
    },

    styleObject(index) {
      const netPerc = this.percentList.sum();
      const isNerf = this.percentList[index] < 0;
      const iconObj = this.getProp(this.currentGroupKeys[index], "icon");
      const barSize = perc => (perc > 0 ? perc * netPerc : -perc);
      return {
        position: "absolute",
        top: `${100 * this.percentList.slice(0, index).map(p => barSize(p)).sum()}%`,
        height: `${100 * barSize(this.percentList[index])}%`,
        width: "100%",
        "transition-duration": (Date.now() - this.lastLayoutChange < 100) ? undefined : "0.2s",
        border: this.isEmpty ? "" : "0.1rem solid var(--color-text)",
        color: iconObj?.textColor ?? "black",
        background: isNerf
          ? `repeating-linear-gradient(-45deg, var(--color-bad), ${iconObj?.color} 0.8rem)`
          : iconObj?.color,
      };
    },
    singleEntryClass(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    barSymbol(index) {
      return this.getProp(this.currentGroupKeys[index], "icon")?.symbol ?? null;
    },

    hasChildComp(key) {
      const dbEntry = this.treeDB[key];
      return dbEntry && dbEntry
        .some(group => group
          .filter(k => this.getProp(k, "isActive") && (this.getMult(k).neq(1) || this.getPow(k) !== 1)).length > 1
        );
    },
    hideIcon(index) {
      if (!this.hasChildComp(this.currentGroupKeys[index])) return "c-no-icon";
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    entryString(index) {
      if (this.percentList[index] < 0) return this.nerfString(index);

      // We want to handle very small numbers carefully to distinguish between "disabled/inactive" and
      // "too small to be relevant"
      let percString;
      if (this.percentList[index] === 0) percString = formatPercents(0);
      else if (this.percentList[index] < 0.001) percString = `<${formatPercents(0.001, 1)}`;
      else if (this.percentList[index] > 0.9995) percString = `~${formatPercents(1)}`;
      else percString = formatPercents(this.percentList[index], 1);

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const overrideStr = this.getProp(this.currentGroupKeys[index], "displayOverride");
      let valueStr;
      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        const formatFn = x => {
          const isDilated = this.getProp(this.currentGroupKeys[index], "isDilated");
          if (isDilated) {
            const undilated = this.applyDilationExp(x, 1 / this.dilationExponent);
            return `${formatX(undilated, 2, 2)} ➜ ${formatX(x, 2, 2)}`;
          }
          return this.getProp(this.currentGroupKeys[index], "isBase")
            ? format(x, 2, 2)
            : `${formatX(x, 2, 2)}`;
        };
        if (Decimal.neq(this.baseMultList[index], 1)) values.push(formatFn(this.baseMultList[index]));
        if (this.powList[index] !== 1) values.push(formatPow(this.powList[index], 2, 3));
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${this.getProp(this.currentGroupKeys[index], "name")} ${valueStr}`;
    },
    nerfString(index) {
      const percString = `${formatPercents(this.percentList[index], 1)}`;

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const overrideStr = this.getProp(this.currentGroupKeys[index], "displayOverride");
      let valueStr;
      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        if (Decimal.neq(this.baseMultList[index], 1)) {
          const formatFn = this.getProp(this.currentGroupKeys[index], "isBase")
            ? x => format(x, 2, 2)
            : x => `/${format(x.reciprocal(), 2, 2)}`;
          values.push(formatFn(this.baseMultList[index]));
        }
        if (this.powList[index] !== 1) values.push(formatPow(this.powList[index], 2, 3));
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${this.getProp(this.currentGroupKeys[index], "name")} ${valueStr}`;
    },
    totalString() {
      const name = this.getProp(this.resource, "name");
      const overrideStr = this.getProp(this.resource, "displayOverride");
      if (overrideStr) return `${name}: ${overrideStr}`;

      const val = this.getMult(this.resource);
      const baseProp = this.getProp(this.resource, "isBase");
      if (baseProp) return `${name}: ${format(val, 2, 2)}`;
      return `${name}: ${formatX(val, 2, 2)}`;
    },
    applyDilationExp(value, exp) {
      return Decimal.pow10(value.log10() ** exp);
    },
    dilationString() {
      const baseMult = this.getMult(this.resource);

      // This is tricky to handle properly; if we're not careful, sometimes the dilation gets applied twice since
      // it's already applied in the multiplier itself. In that case we need to apply an appropriate "anti-dilation"
      // to make the UI look correct. However, this cause some mismatches in individual dimension breakdowns due to
      // the dilation function not being linear (ie. multiply=>dilate gives a different result than dilate=>multiply).
      // In that case we check for isDilated one level down and combine the actual multipliers together instead.
      let beforeMult, afterMult;
      if (this.isDilated && this.getProp(this.resource, "isDilated")) {
        const dilProd = this.currentGroupKeys
          .filter(key => this.isVisible(key) && this.getProp(key, "isDilated"))
          .map(key => this.getMult(key))
          .map(val => this.applyDilationExp(val, 1 / this.dilationExponent))
          .reduce((x, y) => x.times(y), DC.D1);
        beforeMult = dilProd.neq(1) ? dilProd : this.applyDilationExp(baseMult, 1 / this.dilationExponent);
        afterMult = this.getMult(this.resource);
      } else {
        beforeMult = baseMult;
        afterMult = this.applyDilationExp(beforeMult, this.dilationExponent);
      }

      const formatFn = this.getProp(this.resource, "isBase")
        ? x => format(x, 2, 2)
        : x => formatX(x, 2, 2);
      return `Dilation Effect: Exponent${formatPow(this.dilationExponent, 2, 3)}
        (${formatFn(beforeMult, 2, 2)} ➜ ${formatFn(afterMult, 2, 2)})`;
    }
  },
};
</script>

<template>
  <div :class="containerClass">
    <div
      v-if="!isEmpty"
      class="c-stacked-bars"
    >
      <div
        v-for="(perc, index) in percentList"
        :key="100 + index"
        :style="styleObject(index)"
        :class="{ 'c-bar-highlight' : mouseoverIndex === index }"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
        @click="showGroup[index] = !showGroup[index]"
      >
        <span
          class="c-bar-overlay"
          v-html="barSymbol(index)"
        />
      </div>
    </div>
    <div />
    <div class="c-info-list">
      <div class="c-total-mult">
        <b>
          {{ totalString() }}
        </b>
        <i
          v-if="groups.length > 1"
          v-tooltip="'Change Multiplier Grouping'"
          class="o-primary-btn c-change-breakdown-btn fas fa-arrows-rotate"
          @click="changeGroup"
        />
      </div>
      <div v-if="isEmpty">
        No Active Multipliers
        <br>
        Total effect disabled or reduced to {{ formatX(1) }}.
      </div>
      <div
        v-for="(key, index) in currentGroupKeys"
        v-else
        :key="key"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div
          v-if="isVisible(key)"
          :class="singleEntryClass(index)"
        >
          <div @click="showGroup[index] = !showGroup[index]">
            <span :class="hideIcon(index)" />
            {{ entryString(index) }}
          </div>
          <MultiplierBreakdownEntry
            v-if="showGroup[index] && hasChildComp(key)"
            :resource="key"
          />
        </div>
      </div>
      <div v-if="isDilated">
        <div class="c-single-entry c-dilation-entry">
          <div>
            {{ dilationString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 90rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  padding: 0.5rem;
  font-weight: normal;
  background-color: var(--color-base);
}

.c-multiplier-entry-root-container {
  min-height: 45rem;
}

.c-stacked-bars {
  position: relative;
  width: 5rem;
  background-color: var(--color-disabled);
  margin-right: 1.5rem;
}

.c-bar-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  opacity: 0.8;
  z-index: 1;
}

.c-bar-highlight {
  animation: a-glow-bar 1s infinite;
}

@keyframes a-glow-bar {
  0% { box-shadow: inset 0 0 0.3rem 0; }
  50% {
    box-shadow: inset 0 0 0.6rem 0;
    filter: brightness(130%);
  }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.c-info-list {
  height: 100%;
  width: 90%;
  padding: 0.2rem;
}

.c-change-breakdown-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-total-mult {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.c-single-entry {
  text-align: left;
  color: var(--color-text);
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border: 0.1rem dashed;
  cursor: pointer;
  user-select: none;
}

.c-single-entry-highlight {
  border: 0.1rem solid;
  font-weight: bold;
  animation: a-glow-text 1s infinite;
}

@keyframes a-glow-text {
  50% { background-color: var(--color-accent); }
}

.c-dilation-entry {
  border: 0.2rem solid;
  font-weight: bold;
  animation: a-glow-dilation-nerf 3s infinite;
}

@keyframes a-glow-dilation-nerf {
  50% { background-color: var(--color-bad); }
}

.c-no-icon {
  padding: 0.9rem;
}
</style>