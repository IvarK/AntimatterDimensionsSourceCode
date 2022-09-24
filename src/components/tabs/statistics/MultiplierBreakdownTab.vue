<script>
import MultiplierBreakdownEntry from "./MultiplierBreakdownEntry";

export default {
  name: "MultiplierBreakdownTab",
  components: {
    MultiplierBreakdownEntry
  },
  data() {
    return {
      currentOption: 0,
    };
  },
  computed: {
    options: () => ["AM", "AD", "ID", "TD", "IP", "EP", "tickspeed"],
    resourceName() {
      return GameDatabase.multiplierTabValues[this.options[this.currentOption]].total.name();
    },
    resourceKey() {
      return `${this.options[this.currentOption]}_total`;
    },
    resourceSymbols() {
      return GameDatabase.multiplierTabValues[this.options[this.currentOption]].total.overlay;
    }
  },
  methods: {
    changeResource() {
      do {
        this.currentOption = (this.currentOption + 1) % this.options.length;
        this.$recompute("resourceKey");
      } while (!GameDatabase.multiplierTabValues[this.options[this.currentOption]].total.isActive());
    },
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="c-multiplier-tab-text-line">
      Currently viewing multiplier breakdown for {{ resourceName }}
      <span
        class="o-primary-btn"
        @click="changeResource"
      >
        Change Resource
      </span>
    </div>
    <br>
    <div class="c-list-container">
      <span
        v-for="(symbol, index) in resourceSymbols"
        :key="index"
      >
        <span
          class="c-symbol-overlay"
          v-html="symbol"
        />
      </span>
      <MultiplierBreakdownEntry
        :key="resourceKey"
        :resource="resourceKey"
        :is-root="true"
      />
      <div class="c-multiplier-tab-text-line">
        Note: Entries are only expandable if they contain multiple sources which can be different values.
        For example, any effects which affect all Dimensions of any type equally will not expand into a
        list of eight identical numbers.
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-list-container {
  position: relative;
}

.c-multiplier-tab-text-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text);
  width: 80rem;
  font-weight: bold;
  font-size: 1.3rem;
}

.c-symbol-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 40rem;
  color: var(--color-text);
  text-shadow: 0 0 3rem;
  pointer-events: none;
  user-select: none;
  opacity: 0.2;
  z-index: 1;
}
</style>