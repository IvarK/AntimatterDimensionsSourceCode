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
    options: () => ["totalAD", "totalID"],
    currentName() {
      return GameDatabase.multiplierTabValues[this.options[this.currentOption]].name();
    }
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
      Currently viewing breakdown for {{ currentName }}
    </div>
    <br>
    <MultiplierBreakdownEntry :entry="options[currentOption]" />
  </div>
</template>

<style scoped>

</style>