<script>
import { DC } from "../../../../javascripts/core/constants";

export default {
  name: "MultiplierBreakdownEntry",
  props: {
    entry: {
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
      return this.treeDB[this.entry];
    },
  },
  methods: {
    update() {
      this.currentGroupKeys = this.groups[this.selected].filter(key => this.getProp(key, "isActive"));
      this.baseMultList = this.currentGroupKeys.map(key => this.getProp(key, "multValue")?.clampMin(1) ?? 1);
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
      const dbAttr = this.valueDB[args[0]][attr];
      if (!dbAttr) return null;
      return args.length === 1
        ? dbAttr()
        : dbAttr(args.slice(1).map(a => Number(a)));
    },
    styleObject(perc) {
      return {
        height: `${100 * perc}%`,
        border: this.isEmpty ? "" : "0.1rem solid",
      };
    },
    classObject(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    hideIcon(index) {
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    entryString(index) {
      // We want to handle very small numbers carefully to distinguish between "disabled/inactive" and
      // "too small to be relevant" as well as pad with spaces so all colons line up vertically
      let percString;
      if (this.percentList[index] === 0) percString = formatPercents(0);
      else if (this.percentList[index] < 0.001) percString = `<${formatPercents(0.001, 1)}`;
      else if (this.percentList[index] > 0.9995) percString = `~${formatPercents(1)}`;
      else percString = formatPercents(this.percentList[index], 1);

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const values = [];
      if (this.baseMultList[index].neq(1)) values.push(formatX(this.baseMultList[index], 2, 2));
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
        :style="styleObject(perc)"
        :class="{ 'c-bar-highlight' : mouseoverIndex === index }"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      />
    </div>
    <div />
    <div class="c-info-list">
      <div
        v-if="groups.length > 1"
        class="o-primary-btn"
        @click="changeGroup"
      >
        Change Breakdown Group for: {{ getProp(entry, "name") }}
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
          :entry="key"
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
}

.c-stacked-bars {
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
    background-color: var(--color-accent);
  }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.c-info-list {
  height: 100%;
  width: 85%;
  padding: 0.2rem;
}

.c-single-entry {
  text-align: left;
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
</style>