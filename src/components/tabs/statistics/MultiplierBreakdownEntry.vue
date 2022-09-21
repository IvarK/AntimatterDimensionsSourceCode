<script>
import { DC } from "../../../../javascripts/core/constants";

export default {
  name: "MultiplierBreakdownEntry",
  props: {
    resource: {
      type: String,
      required: true,
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
  },
  methods: {
    update() {
      this.currentGroupKeys = this.groups[this.selected].filter(key => this.getProp(key, "isActive"));
      this.baseMultList = this.currentGroupKeys.map(key => this.getProp(key, "multValue")?.clampMin(1) ?? DC.D1);
      this.powList = this.currentGroupKeys.map(key => this.getProp(key, "powValue") ?? 1);
      this.calculatePercents();
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      this.showGroup = Array.repeat(false, this.currentGroupKeys.length);
    },
    calculatePercents() {
      const totalBaseMult = this.baseMultList.reduce((x, y) => x.times(y), DC.D1);
      const totalPow = this.powList.reduce((x, y) => x * y, 1);
      this.isEmpty = totalBaseMult.eq(1);
      this.percentList = [];
      for (let index = 0; index < this.baseMultList.length; index++) {
        const multFrac = totalBaseMult.log10() === 0
          ? 0
          : Decimal.log10(this.baseMultList[index]) / totalBaseMult.log10();
        const powFrac = totalPow === 1 ? 0 : Math.log(this.powList[index]) / Math.log(totalPow);
        this.percentList.push(multFrac / totalPow + powFrac * (1 - 1 / totalPow));
      }
    },
    getProp(key, attr) {
      const args = key.split("_");
      const dbAttr = this.valueDB[args[0]][args[1]][attr];
      if (!dbAttr) return null;
      return args.length < 3
        ? dbAttr()
        : dbAttr(...args.slice(2).map(a => Number(a)));
    },
    styleObject(index) {
      return {
        position: "absolute",
        top: `${100 * this.percentList.slice(0, index).sum()}%`,
        height: `${100 * this.percentList[index]}%`,
        width: "100%",
        border: this.isEmpty ? "" : "0.1rem solid var(--color-text)",
        "background-color": this.getProp(this.currentGroupKeys[index], "color")
      };
    },
    classObject(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    hideIcon(index) {
      if (!this.treeDB[this.currentGroupKeys[index]]) return "c-no-icon";
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
      const values = [];
      const formatFn = this.getProp(this.currentGroupKeys[index], "isBase")
        ? x => format(x, 2, 2)
        : x => formatX(x, 2, 2);
      if (this.baseMultList[index].neq(1)) values.push(formatFn(this.baseMultList[index]));
      if (this.powList[index] !== 1) values.push(formatPow(this.powList[index], 2, 3));
      const valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;

      return `${percString}: ${this.getProp(this.currentGroupKeys[index], "name")} ${valueStr}`;
    }
  },
};
</script>

<template>
  <div class="c-multiplier-entry-container">
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
      />
    </div>
    <div />
    <div class="c-info-list">
      <div class="c-total-mult">
        <b v-if="getProp(resource, 'isBase')">
          {{ getProp(resource, "name") }}: {{ format(getProp(resource, "multValue")) }}
        </b>
        <b v-else>
          Total Multiplier for {{ getProp(resource, "name") }}: {{ formatX(getProp(resource, "multValue")) }}
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
        :class="classObject(index)"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div
          v-if="getProp(key, 'isActive')"
          @click="showGroup[index] = !showGroup[index]"
        >
          <span :class="hideIcon(index)" />
          {{ entryString(index) }}
        </div>
        <MultiplierBreakdownEntry
          v-if="showGroup[index] && treeDB[key]"
          :resource="key"
        />
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

.c-stacked-bars {
  position: relative;
  width: 5rem;
  background-color: var(--color-disabled);
  margin-right: 3rem;
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
  width: 85%;
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