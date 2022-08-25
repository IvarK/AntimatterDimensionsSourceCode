<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ImportAutomatorScriptModal",
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
    };
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    update() {
      try {
        const parsed = AutomatorBackend.parseScriptContents(this.input);
        if (!parsed) {
          this.isValid = false;
          return;
        }
        this.scriptName = parsed.name;
        this.scriptContent = parsed.content;
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
      AutomatorBackend.importScriptContents(this.input);
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
      Import Automator Script
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
      <div
        v-if="hasErrors"
        class="l-has-errors"
      >
        Warning: This script has errors which need to be fixed before it can be run!
      </div>
    </div>
    <div v-else-if="input.length !== 0">
      Invalid Automator script string
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