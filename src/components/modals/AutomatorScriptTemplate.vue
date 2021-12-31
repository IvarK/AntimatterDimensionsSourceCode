<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "AutomatorScriptTemplate",
  components: {
    ModalCloseButton,
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      templateInputs: [],
      buttonTextStrings: [],
      invalidInputCount: 0,
      templateScript: null,
    };
  },
  computed: {
    params: () => GameDatabase.reality.automator.templates.paramTypes,
    templates: () => GameDatabase.reality.automator.templates.scripts,
    warnings() {
      return this.invalidInputCount === 0
        ? this.modalConfig.warnings().concat(this.templateScript.warnings)
        : this.modalConfig.warnings();
    },
  },
  // Many props in this component are generated dynamically from a GameDB entry, but Vue can only give reactive
  // behavior to props that exist on declaration. We need all the dynamically generated inputs to be reactive, so we
  // specifically $set them here on initialization; additionally we give them a default value so that later function
  // calls don't error out from undefined inputs.
  created() {
    for (const input of this.modalConfig.inputs) {
      if (this.paramTypeObject(input.type).boolDisplay) this.$set(this.templateInputs, input.name, false);
      else this.$set(this.templateInputs, input.name, "");
    }
  },
  methods: {
    update() {
      this.invalidInputCount = 0;
      for (const input of this.modalConfig.inputs) {
        const boolProp = this.paramTypeObject(input.type).boolDisplay;
        if (boolProp) this.buttonTextStrings[input.name] = boolProp[this.templateInputs[input.name] ? 0 : 1];
        if (!this.isValid(input)) this.invalidInputCount++;
      }
      if (this.invalidInputCount === 0) this.makeTemplate();
    },
    paramTypeObject(name) {
      return this.params.find(p => p.name === name);
    },
    isValid(input) {
      const typeObject = this.paramTypeObject(input.type);
      return typeObject.isValidString ? typeObject.isValidString(this.templateInputs[input.name]) : true;
    },
    validityClass(input) {
      return this.isValid(input)
        ? undefined
        : "c-automator-template-textbox--invalid";
    },
    makeTemplate() {
      const templateProps = {};
      for (const input of this.modalConfig.inputs) {
        const typeObj = this.paramTypeObject(input.type);
        const mapFn = x => (typeObj.map ? typeObj.map(x) : x);
        templateProps[input.name] = mapFn(this.templateInputs[input.name]);
      }
      this.templateScript = new ScriptTemplate(templateProps, this.modalConfig.name);
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
  <div class="c-automator-template-container">
    <ModalCloseButton @click="emitClose" />
    <b>Template "{{ modalConfig.name }}"</b>
    {{ modalConfig.description }}
    <br>
    <br>
    <b>Required Information:</b>
    <div
      v-for="input in modalConfig.inputs"
      :key="input.name"
      class="c-automator-template-entry"
    >
      {{ input.prompt }}:
      <span v-if="paramTypeObject(input.type).boolDisplay">
        <button
          class="o-primary-btn"
          @click="templateInputs[input.name] = !templateInputs[input.name]"
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
        >
      </span>
    </div>
    <br>
    <br>
    <div>
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
  </div>
</template>
