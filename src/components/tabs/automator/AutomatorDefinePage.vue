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
  computed: {
    maxConstantCount() {
      return 30;
    },
  },
  methods: {
    update() {
      const existingValues = Object.keys(player.reality.automator.constants);
      this.constants = existingValues.length < this.maxConstantCount ? [...existingValues, ""] : [...existingValues];
    }
  }
};
</script>

<template>
  <div class="l-panel-padding">
    This panel allows you to define case-sensitive constant values which can be used in place of numbers or Time Study
    import strings. These definitions are shared across all of your scripts and are limited to a maximum of
    {{ maxConstantCount }} defined constants.
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
