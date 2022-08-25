<script>
import AutomatorDataTransferSingleEntry from "./AutomatorDataTransferSingleEntry";

export default {
  name: "AutomatorDataTransferPage",
  components: {
    AutomatorDataTransferSingleEntry,
  },
  data() {
    return {
    };
  },
  computed: {
    scripts: () => Object.values(player.reality.automator.scripts),
  },
  methods: {
  }
};
</script>

<template>
  <div class="l-panel-padding">
    This page lets you import and export scripts with additional data attached; the encoded text will also include data
    for any Time Study presets or constants used within the script. This will allow you to more easily transfer working
    scripts between different save files, but you may have to overwrite existing data in the process.
    <br>
    Import button goes here
    <br>
    <div
      v-for="(script, id) in scripts"
      :key="id"
    >
      <AutomatorDataTransferSingleEntry :script="script" />
    </div>
  </div>
</template>

<style scoped>
.l-panel-padding {
  padding: 0.5rem 2rem 1rem 0;
}
</style>
