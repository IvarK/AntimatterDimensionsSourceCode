<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "AutomatorScriptTemplate",
  components: {
    ModalWrapper,
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      templateInputs: {},
      buttonTextStrings: [],
      invalidInputCount: 0,
      templateProps: null,
      currentPreset: "",
    };
  },
  computed: {
    presets: () => player.timestudy.presets,
    params: () => GameDatabase.reality.automator.templates.paramTypes,
    warnings() {
      return this.invalidInputCount === 0
        ? this.modalConfig.warnings().concat(this.templateScript?.warnings)
        : this.modalConfig.warnings();
    },
    templateScript() {
      if (this.invalidInputCount !== 0) return null;
      return new ScriptTemplate(this.templateProps, this.modalConfig.name);
    }
  },
  // Many props in this component are generated dynamically from a GameDB entry, but Vue can only give reactive
  // behavior to props that exist on declaration. We need all the dynamically generated inputs to be reactive, so we
  // specifically $set them here on initialization; additionally we give them a default value so that later function
  // calls don't error out from undefined inputs.
  created() {
    for (const input of this.modalConfig.inputs) {
      const boolProp = this.paramTypeObject(input.type).boolDisplay;
      if (boolProp) {
        this.$set(this.templateInputs, input.name, false);
        this.buttonTextStrings[input.name] = boolProp[1];
      } else {
        this.$set(this.templateInputs, input.name, "");
        this.invalidInputCount++;
      }
    }
  },
  methods: {
    paramTypeObject(name) {
      return this.params.find(p => p.name === name);
    },
    isValid(input) {
      const typeObject = this.paramTypeObject(input.type);
      return typeObject.isValidString ? typeObject.isValidString(this.templateInputs[input.name]) : true;
    },
    validityClass(input) {
      if (input.name === "treeStudies" && this.currentPreset !== "") {
        return "c-automator-template-textbox--preset";
      }
      return this.isValid(input)
        ? undefined
        : "c-automator-template-textbox--invalid";
    },
    loadPreset(name) {
      this.templateInputs.treeStudies = `PRESET ${name}`;
      this.updateTemplateProps();
    },
    loadCurrent() {
      this.templateInputs.treeStudies = GameCache.currentStudyTree.value.exportString;
      this.updateTemplateProps();
    },
    updateTemplateProps() {
      this.templateProps = {};
      this.invalidInputCount = 0;
      for (const input of this.modalConfig.inputs) {
        const typeObj = this.paramTypeObject(input.type);
        const mapFn = x => (typeObj.map ? typeObj.map(x) : x);
        this.templateProps[input.name] = mapFn(this.templateInputs[input.name]);
        if (!this.isValid(input)) this.invalidInputCount++;
      }

      // We treat treeStudies as a special prop which will set treePreset iff it matches the format "PRESET [name]"
      const presetMatch = this.templateProps.treeStudies.match(/^PRESET (.{1,4})$/u);
      const presetStr = presetMatch ? presetMatch[1] : "";
      this.currentPreset = this.presets.some(p => p.name === presetStr) ? presetStr : "";
      this.templateProps.treePreset = this.currentPreset === "" ? null : this.currentPreset;
    },
    updateButton(input) {
      this.templateInputs[input.name] = !this.templateInputs[input.name];
      const boolProp = this.paramTypeObject(input.type).boolDisplay;
      this.buttonTextStrings[input.name] = boolProp[this.templateInputs[input.name] ? 0 : 1];
      this.updateTemplateProps();
    },
    copyAndClose() {
      copyToClipboard(this.templateScript.script);
      GameUI.notify.info("Template copied to clipboard");
      this.emitClose();
    }
  }
};
</script>

<template>
  <ModalWrapper
    class="c-automator-template-container"
  >
    <template #header>
      {{ modalConfig.name }} Template
    </template>
    <div class="c-automator-template-description">
      {{ modalConfig.description }}
    </div>
    <div class="c-automator-template-inputs">
      <b>Required Information:</b>
      <br>
      Use a preset Study Tree:
      <button
        v-for="preset in presets"
        :key="preset.name"
        class="o-primary-btn"
        @click="loadPreset(preset.name)"
      >
        {{ preset.name }}
      </button>
      <button
        class="o-primary-btn"
        @click="loadCurrent"
      >
        <i>Current Tree</i>
      </button>
      <div
        v-for="input in modalConfig.inputs"
        :key="input.name"
        class="c-automator-template-entry"
      >
        {{ input.prompt }}:
        <span v-if="paramTypeObject(input.type).boolDisplay">
          <button
            class="o-primary-btn"
            @click="updateButton(input)"
          >
            {{ buttonTextStrings[input.name] }}
          </button>
        </span>
        <span v-else>
          <input
            ref="templateInputs[input.name]"
            v-model="templateInputs[input.name]"
            type="text"
            class="c-automator-template-textbox"
            :class="validityClass(input)"
            @input="updateTemplateProps"
          >
        </span>
      </div>
    </div>
    <div class="c-automator-template-warnings">
      <b>Possible things to consider:</b>
      <div v-if="warnings.length !== 0">
        <div
          v-for="warning in warnings"
          :key="warning"
          class="c-automator-template-entry"
        >
          {{ warning }}
        </div>
      </div>
      <div v-else>
        (If something seems wrong with the template inputs, it will show up here)
      </div>
      <br>
      <br>
    </div>
    <button
      v-if="invalidInputCount === 0"
      class="o-primary-btn"
      @click="copyAndClose"
    >
      Copy this template to your clipboard and close this modal
    </button>
    <button
      v-else
      class="o-primary-btn o-primary-btn--disabled"
    >
      Cannot generate template (You have {{ quantifyInt("invalid input", invalidInputCount) }})
    </button>
  </ModalWrapper>
</template>
