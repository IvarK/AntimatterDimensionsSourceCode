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
    }
  },
  methods: {
    update() {
      this.currentGroupKeys = this.groups[this.selected].filter(key => this.getProp(key, "isActive"));
      this.baseMultList = this.currentGroupKeys.map(key => Decimal.max(this.getMult(key), 1));
      this.powList = this.currentGroupKeys.map(key => this.getPow(key));
      this.calculatePercents();
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      this.showGroup = Array.repeat(false, this.currentGroupKeys.length);
    },
    calculatePercents() {
      const totalPow = this.powList.reduce((x, y) => x * y, 1);
      const log10Mult = (this.getProp(this.resource, "fakeValue") ?? this.getMult(this.resource)).log10() / totalPow;
      this.isEmpty = log10Mult === 0;
      this.percentList = [];
      for (let index = 0; index < this.baseMultList.length; index++) {
        const multFrac = log10Mult === 0
          ? 0
          : Decimal.log10(this.baseMultList[index]) / log10Mult;
        const powFrac = totalPow === 1 ? 0 : Math.log(this.powList[index]) / Math.log(totalPow);
        this.percentList.push(multFrac / totalPow + powFrac * (1 - 1 / totalPow));
      }

      // Shortly after a prestige, these may add up to a lot more than the base amount as production catches up. This
      // is also necessary to suppress some visual weirdness for certain categories which have lots of exponents but
      // actually apply only to specific dimensions (eg. charged infinity upgrades)
      const totalPerc = this.percentList.sum();
      this.percentList = this.percentList.map(p => p / Math.max(totalPerc, 1));
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
      return {
        position: "absolute",
        top: `${100 * this.percentList.slice(0, index).sum()}%`,
        height: `${100 * this.percentList[index]}%`,
        width: "100%",
        border: this.isEmpty ? "" : "0.1rem solid var(--color-text)",
        "background-color": this.getProp(this.currentGroupKeys[index], "icon")?.color
      };
    },
    singleEntryClass(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    barSymbol(index) {
      return this.getProp(this.currentGroupKeys[index], "icon")?.text ?? null;
    },

    hasChildComp(key) {
      const dbEntry = this.treeDB[key];
      return dbEntry && dbEntry[0].filter(k => this.getProp(k, "isActive")).length > 1;
    },
    hideIcon(index) {
      if (!this.hasChildComp(this.currentGroupKeys[index])) return "c-no-icon";
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    entryString(index) {
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
        const formatFn = this.getProp(this.currentGroupKeys[index], "isBase")
          ? x => format(x, 2, 2)
          : x => formatX(x, 2, 2);
        if (Decimal.neq(this.baseMultList[index], 1)) values.push(formatFn(this.baseMultList[index]));
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
        <span
          v-if="groups.length > 1"
          class="o-primary-btn"
          @click="changeGroup"
        >
          Change Grouping
        </span>
      </div>
      <div v-if="isEmpty">
        No Active Multipliers
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
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 80rem;
  border: 0.2rem solid;
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
  color: var(--color-text);
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
  0% {}
  50% { background-color: var(--color-accent); }
  100% {}
}

.c-no-icon {
  padding: 0.9rem;
}
</style>