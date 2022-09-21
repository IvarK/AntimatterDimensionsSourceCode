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
    options: () => ["AD", "ID", "TD"],
    resourceName() {
      return GameDatabase.multiplierTabValues[this.options[this.currentOption]].total.name();
    },
    resourceKey() {
      return `${this.options[this.currentOption]}_total`;
    },
  },
  methods: {
    changeResource() {
      this.currentOption = (this.currentOption + 1) % this.options.length;
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
    <MultiplierBreakdownEntry :resource="resourceKey" />
    <div class="c-multiplier-tab-text-line">
      Note: Entries are only expandable if they contain multiple sources which can be different values.
      For example, any effects which affect all Dimensions of any type equally will not expand into a
      list of eight identical numbers.
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-tab-text-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text);
  width: 65rem;
  font-weight: bold;
  font-size: 1.3rem;
}
</style>