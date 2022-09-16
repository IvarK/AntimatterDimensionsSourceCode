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

      const totalBaseMult = this.baseMultList.reduce((x, y) => x.times(y), DC.D1);
      const totalPow = this.powList.reduce((x, y) => x * y, 1);

      this.percentList = [];
      for (let index = 0; index < this.baseMultList.length; index++) {
        const multFrac = Decimal.log10(this.baseMultList[index]) / totalBaseMult.log10();
        const powFrac = totalPow === 1 ? 0 : Math.log(this.powList[index]) / Math.log(totalPow);
        this.percentList.push(multFrac / totalPow + powFrac * (1 - 1 / totalPow));
      }
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      this.showGroup = Array.repeat(false, this.currentGroupKeys.length);
    },
    getProp(key, attr) {
      const args = key.split("_");
      if (!this.valueDB[args[0]][attr]) return null;
      return args.length === 1
        ? this.valueDB[key][attr]()
        : this.valueDB[args[0]][attr](Number(args[1]));
    },
    styleObject(perc) {
      return {
        height: `${100 * perc}%`,
        border: "0.1rem solid",
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
  },
};
</script>

<template>
  <div class="c-multiplier-entry-container">
    <div class="c-stacked-bars">
      <div
        v-for="(perc, index) in percentList"
        :key="100 + index"
        :style="styleObject(perc)"
        :class="{ 'c-bar-highlight' : mouseoverIndex === index }"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      />
    </div>
    <div class="c-info-list">
      <div
        v-if="groups.length > 1"
        class="o-primary-btn"
        @click="changeGroup"
      >
        Change Breakdown Group for: {{ getProp(entry, "name") }}
      </div>
      <div
        v-for="(key, index) in currentGroupKeys"
        :key="key"
        :class="classObject(index)"
        @click="showGroup[index] = !showGroup[index]"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div v-if="getProp(key, 'isActive')">
          <span :class="hideIcon(index)" />
          {{ getProp(key, "name") }}:
          {{ formatX(getProp(key, "multValue"), 2, 2) }}
          ({{ formatPercents(percentList[index], 1) }})
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
  display: grid;
  grid-template-columns: 1fr 5fr;
  border: 0.2rem solid;
  padding: 0.5rem;
}

.c-stacked-bars {
  width: 5rem;
  height: 100%;
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
  padding: 0.2rem;
}

.c-single-entry {
  padding: 0.2rem;
  margin: 0.2rem;
  border: 0.1rem dashed;
  cursor: pointer;
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