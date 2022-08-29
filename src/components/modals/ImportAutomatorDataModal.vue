<script>
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
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) {
        if (all.has(constant.key) && player.reality.automator.constants[constant.key] !== constant.value) return true;
      }
      return false;
    },
    // Number of constants over the limit
    extraConstants() {
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) all.add(constant.key);
      return all.size - this.maxConstantCount;
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
      try {
        const parsed = AutomatorBackend.parseFullScriptData(this.input);
        if (!parsed) {
          this.isValid = false;
          return;
        }
        this.scriptName = parsed.name;
        this.scriptContent = parsed.content;
        this.importedPresets = parsed.presets;
        this.importedConstants = parsed.constants;
        this.lineCount = this.scriptContent.split("\n").length;
        this.hasErrors = AutomatorGrammar.compile(this.scriptContent).errors.length !== 0;
        this.isValid = true;
      } catch (e) {
        // Improperly encoded scripts will cause decodeText() to throw an exception
        this.isValid = false;
      }
    },
    importSave() {
      if (!this.isValid) return;
      AutomatorBackend.importFullScriptData(this.input, {
        presets: this.ignorePresets,
        constants: this.ignoreConstants
      });
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
      Import Automator Script with additional Data
    </template>
    This will create a new Automator script at the end of your list.
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
      <div v-if="importedPresets.length !== 0">
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
          {{ formatInt(overwrittenPresetCount) }} of your existing presets are
          different from those being imported and will be overwritten!
        </div>
        <br>
        <button
          class="o-primary-btn"
          @click="ignorePresets = !ignorePresets"
        >
          {{ presetButtonText }}
        </button>
      </div>
      <div v-if="importedConstants.length !== 0">
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