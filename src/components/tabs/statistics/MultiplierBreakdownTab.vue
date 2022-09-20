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
    <div
      class="o-primary-btn"
      @click="changeResource"
    >
      Currently viewing breakdown for {{ resourceName }}
    </div>
    <br>
    <MultiplierBreakdownEntry :resource="resourceKey" />
  </div>
</template>

<style scoped>

</style>