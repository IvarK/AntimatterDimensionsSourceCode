<script>
import AutomatorDataTransferSingleEntry from "./AutomatorDataTransferSingleEntry";

export default {
  name: "AutomatorDataTransferPage",
  components: {
    AutomatorDataTransferSingleEntry,
  },
  data() {
    return {
      canImport: true,
      scripts: 0,
    };
  },
  computed: {
    maxScriptCount: () => AutomatorData.MAX_ALLOWED_SCRIPT_COUNT,
  },
  created() {
    this.loadScripts();
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => {
      this.loadScripts();
    });
  },
  methods: {
    update() {
      this.canImport = this.scripts.length < this.maxScriptCount;
    },
    loadScripts() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
    importData() {
      if (!this.canImport) return;
      Modal.importScriptData.show();
    },
  }
};
</script>

<template>
  <div class="l-panel-padding">
    This page lets you import and export scripts with additional data attached; the encoded text will also include data
    for any Time Study presets or constants used within the script. This will allow you to more easily transfer working
    scripts between different save files, but you may have to overwrite existing data in the process due to limited
    space for study presets and constants.
    <br>
    <button
      class="o-primary-btn c-import-button l-automator__button"
      @click="importData"
    >
      Import script with additional data
    </button>
    <br>
    <div
      v-for="(script, id) in scripts"
      :key="id"
    >
      <AutomatorDataTransferSingleEntry
        class="l-entry-margin"
        :script="script"
      />
    </div>
  </div>
</template>

<style scoped>
.l-panel-padding {
  padding: 0.5rem 2rem 1rem 0;
}

.l-entry-margin {
  margin-bottom: 1rem;
}

.c-import-button {
  margin: 1rem 1rem -1rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}
</style>
