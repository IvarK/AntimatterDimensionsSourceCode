<script>
import { hasCompilationErrors } from "@/core/automator";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ImportAutomatorDataModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      input: "",
      isValid: false,
      hasExtraData: false,
      scriptName: "",
      lineCount: 0,
      scriptContent: "",
      hasErrors: false,
      importedPresets: [],
      importedConstants: [],
      ignorePresets: false,
      ignoreConstants: false,
    };
  },
  computed: {
    hasPresets() {
      return (this.importedPresets?.length ?? 0) !== 0;
    },
    hasConstants() {
      return (this.importedConstants?.length ?? 0) !== 0;
    },
    isImportingExtraData() {
      // These two checks differ because we suppress the preset import warning when importing into an empty
      // slot, but we use this prop for information on importing rather than overwriting
      const hasNewConstants = this.willOverwriteConstant || this.constantCountAfterImport > this.currentConstants;
      const isImportingPresets = this.importedPresets ? !this.ignorePresets : false;
      const isImportingConstants = this.importedConstants
        ? !this.ignoreConstants && hasNewConstants
        : false;
      return this.isValid && this.hasExtraData && (isImportingPresets || isImportingConstants);
    },
    currentPresets: () => player.timestudy.presets,
    currentConstants: () => Object.keys(player.reality.automator.constants),
    maxConstantCount() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_COUNT;
    },
    // Number of studies with different contents which will be overwritten
    overwrittenPresetCount() {
      let mismatchedPresets = 0;
      for (const toImport of this.importedPresets) {
        const existingPreset = this.currentPresets[toImport.id];
        const isEmpty = existingPreset.name === "" && existingPreset.studies === "";
        if (!isEmpty && (existingPreset.name !== toImport.name || existingPreset.studies !== toImport.studies)) {
          mismatchedPresets++;
        }
      }
      return mismatchedPresets;
    },
    willOverwriteConstant() {
      if (!this.hasExtraData) return false;
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) {
        if (all.has(constant.key) && player.reality.automator.constants[constant.key] !== constant.value) return true;
      }
      return false;
    },
    constantCountAfterImport() {
      if (!this.hasExtraData) return this.currentConstants.length;
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) all.add(constant.key);
      return all.size;
    },
    extraConstants() {
      return this.constantCountAfterImport - this.maxConstantCount;
    },
    presetButtonText() {
      return this.ignorePresets ? "Will Ignore Presets" : "Will Import Presets";
    },
    constantButtonText() {
      return this.ignoreConstants ? "Will Ignore Constants" : "Will Import Constants";
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    update() {
      // We need to sequentially parse full data and then single script data in order to handle both in the same modal.
      // Parsing order doesn't matter due to the fact that export formatting means it's only ever one or the other.
      let parsed = AutomatorBackend.parseFullScriptData(this.input);
      if (parsed) this.hasExtraData = true;
      else {
        parsed = AutomatorBackend.parseScriptContents(this.input);
        this.hasExtraData = false;
      }
      if (!parsed) {
        this.isValid = false;
        return;
      }

      // Some of these may be undefined for single script importing (ie. no additional data attached) or for scripts
      // with errors. These cases are checked elsewhere
      this.scriptName = parsed.name;
      this.scriptContent = parsed.content;
      this.importedPresets = parsed.presets;
      this.importedConstants = parsed.constants;
      this.lineCount = this.scriptContent.split("\n").length;
      this.hasErrors = hasCompilationErrors(this.scriptContent);
      this.isValid = true;
    },
    importSave() {
      if (!this.isValid) return;
      if (this.hasExtraData) {
        AutomatorBackend.importFullScriptData(this.input, {
          presets: this.ignorePresets,
          constants: this.ignoreConstants
        });
      } else {
        AutomatorBackend.importScriptContents(this.input);
      }
      this.emitClose();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!isValid"
    :show-confirm="isValid"
    @confirm="importSave"
  >
    <template #header>
      Import Automator Script Data
    </template>
    This will create a new Automator script at the end of your list.
    <span v-if="isImportingExtraData">This will also import additional data related to the script.</span>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div v-if="isValid">
      Script name: {{ scriptName }}
      <br>
      Line count: {{ lineCount }}
      <div v-if="hasPresets">
        <br>
        Study Presets:
        <span
          v-for="(preset, id) in importedPresets"
          :key="id"
          class="c-import-data-name"
        >
          <span v-if="preset.name">"{{ preset.name }}" (slot {{ preset.id + 1 }})</span>
          <span v-else>Preset slot #{{ preset.id + 1 }}</span>
        </span>
        <div
          v-if="!ignorePresets && overwrittenPresetCount > 0"
          class="l-has-errors"
        >
          {{ formatInt(overwrittenPresetCount) }} of your existing presets
          will be overwritten by imported presets!
        </div>
        <br>
        <button
          class="o-primary-btn"
          @click="ignorePresets = !ignorePresets"
        >
          {{ presetButtonText }}
        </button>
      </div>
      <div v-if="hasConstants">
        <br>
        Constants:
        <span
          v-for="(constant, id) in importedConstants"
          :key="id + 10"
          class="c-import-data-name"
        >
          "{{ constant.key }}"
        </span>
        <div
          v-if="!ignoreConstants && (willOverwriteConstant || extraConstants > 0)"
          class="l-has-errors"
        >
          <span v-if="willOverwriteConstant">Some of your existing constants will be overwritten!</span>
          <br v-if="willOverwriteConstant && extraConstants > 0">
          <span v-if="extraConstants > 0">
            {{ quantifyInt("constant", extraConstants) }} will not be imported due to the
            {{ maxConstantCount }} constant limit.
          </span>
        </div>
        <br>
        <button
          class="o-primary-btn"
          @click="ignoreConstants = !ignoreConstants"
        >
          {{ constantButtonText }}
        </button>
      </div>
      <br>
      <div
        v-if="hasErrors"
        class="l-has-errors"
      >
        This script has errors which need to be fixed before it can be run!
      </div>
      <div v-if="hasErrors && isImportingExtraData">
        <i>Some errors may be fixed with the additional data being imported.</i>
      </div>
    </div>
    <div v-else-if="input.length !== 0">
      Invalid Automator data string
    </div>
    <template #confirm-text>
      Import
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-has-errors {
  color: red;
}

.c-import-data-name {
  padding: 0 1rem;
}
</style>
