<script>
import AutomatorDefineSingleEntry from "./AutomatorDefineSingleEntry";

export default {
  name: "AutomatorDefinePage",
  components: {
    AutomatorDefineSingleEntry,
  },
  data() {
    return {
      constants: [],
    };
  },
  methods: {
    update() {
      // Right after deleting a constant, the list of keys will contain the empty string. This isn't functionally
      // problematic, but leaves the "new constant" input in that spot instead of placing it at the end of the list.
      // The filter operation removes it (if it exists) and then we manually place it at the end
      this.constants = [...Object.keys(player.reality.automator.constants).filter(k => k), ""];
    }
  }
};
</script>

<template>
  <div class="l-panel-padding">
    This panel allows you to define constant values which can be used in place of numbers or Time Study import
    strings.
    <br>
    <br>
    As a usage example, defining
    <b>first 🠈 11,21,22,31,32,33</b>
    allows you to use
    <b>studies purchase first</b>
    in order to purchase all of the studies in the first three rows.
    <div
      :key="constants.length"
      class="l-definition-container"
    >
      <AutomatorDefineSingleEntry
        v-for="(constant, i) in constants"
        :key="i"
        :constant="constant"
      />
    </div>
  </div>
</template>

<style scoped>
.l-panel-padding {
  padding: 0.5rem 2rem 0 0;
}

.l-definition-container {
  display: flex;
  flex-direction: column;
  border: solid 0.1rem var(--color-automator-docs-font);
  padding: 0.5rem;
  margin-top: 1rem;
}
</style>
