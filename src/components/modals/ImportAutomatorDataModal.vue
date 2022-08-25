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
    willOverwritePreset() {
      return this.importedPresets.map(p => p.id).some(id => this.currentPresets[id].name !== "");
    },
    willOverwriteConstant() {
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) {
        if (all.has(constant)) return true;
      }
      return false;
    },
    cannotImportAllConstants() {
      const all = new Set();
      for (const constant of this.currentConstants) all.add(constant);
      for (const constant of this.importedConstants) all.add(constant);
      return all.size > this.maxConstantCount;
    },
    presetButtonText() {
      return this.ignorePresets ? "Ignore Presets" : "Import Presets";
    },
    constantButtonText() {
      return this.ignoreConstants ? "Ignore Constants" : "Import Constants";
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
      <br>
      <br>
      Imported presets:
      <div
        v-for="(preset, id) in importedPresets"
        :key="id"
      >
        "{{ preset.name }}" (slot {{ preset.id }})
      </div>
      <button
        class="o-primary-btn"
        @click="ignorePresets = !ignorePresets"
      >
        {{ presetButtonText }}
      </button>
      <div
        v-if="!ignorePresets && willOverwritePreset"
        class="l-has-errors"
      >
        Warning: Some of your existing presets will be overwritten!
      </div>
      <br>
      <br>
      Imported constants:
      <div
        v-for="(constant, id) in importedConstants"
        :key="id + 10"
      >
        "{{ constant.key }}"
      </div>
      <button
        class="o-primary-btn"
        @click="ignoreConstants = !ignoreConstants"
      >
        {{ constantButtonText }}
      </button>
      <div
        v-if="!ignoreConstants && (willOverwriteConstant || cannotImportAllConstants)"
        class="l-has-errors"
      >
        Warning: <span v-if="willOverwriteConstant">Some of your existing constants will be overwritten!</span>
        <span v-if="cannotImportAllConstants">
          Some constants will not be imported due to the {{ maxConstantCount }} constant limit.
        </span>
      </div>
      <br>
      <div
        v-if="hasErrors"
        class="l-has-errors"
      >
        Warning: This script has errors which need to be fixed before it can be run!
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
</style>