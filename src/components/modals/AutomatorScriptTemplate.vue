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
      missingInputCount: 0,
      templateScript: null,
    };
  },
  computed: {
    params: () => GameDatabase.reality.automator.templates.paramTypes,
    templates: () => GameDatabase.reality.automator.templates.scripts,
    warnings() {
      return this.missingInputCount === 0
        ? this.modalConfig.warnings().concat(this.templateScript.warnings)
        : this.modalConfig.warnings();
    },
  },
  // PrimaryToggleButton gives console errors if the bound value is undefined, so we initialize all the boolean
  // input props as false
  created() {
    for (const input of this.modalConfig.inputs) {
      if (this.paramTypeObject(input.type).boolDisplay) this.templateInputs[input.name] = false;
    }
  },
  methods: {
    // Many props in this component are generated dynamically from a GameDB entry, but Vue can only give reactive
    // behavior to props that exist on initialization. Values in templateInputs don't need to be reactive, but values
    // buttonTextStrings need to be in order for the button text to change on click.
    update() {
      this.missingInputCount = 0;
      for (const input of this.modalConfig.inputs) {
        const boolProp = this.paramTypeObject(input.type).boolDisplay;
        if (boolProp) {
          const propValue = this.templateInputs[input.name];
          this.$set(this.buttonTextStrings, input.name, boolProp[propValue ? 0 : 1]);
        }
        if (this.templateInputs[input.name] === undefined) this.missingInputCount++;
      }

      if (this.missingInputCount === 0) this.makeTemplate();
    },
    paramTypeObject(name) {
      return this.params.find(p => p.name === name);
    },
    buttonText(input) {
      const propValue = this.templateInputs[input.name];
      return this.paramTypeObject(input.type).boolDisplay[propValue ? 0 : 1];
    },
    validityClass(input) {
      return this.paramTypeObject(input.type).isValidString(this.templateInputs[input.name])
        ? undefined
        : "o-autobuyer-input--invalid";
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
  <div>
    <ModalCloseButton @click="emitClose" />
    <b>Template "{{ modalConfig.name }}"</b>
    <br>
    {{ modalConfig.description }}
    <br>
    <br>
    <b>Required Information:</b>
    <div
      v-for="input in modalConfig.inputs"
      :key="input.name"
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
          class="c-modal-input"
          :class="validityClass(input)"
        >
      </span>
    </div>
    <br>
    <br>
    <div v-if="warnings.length !== 0">
      <b>Possible advice to consider:</b>
      <div
        v-for="warning in warnings"
        :key="warning"
      >
        {{ warning }}
      </div>
      <br>
      <br>
    </div>
    <button
      v-if="missingInputCount === 0"
      class="o-primary-btn"
      @click="copyAndClose"
    >
      Copy this template to your clipboard and close this modal
    </button>
    <button
      v-else
      class="o-primary-btn o-primary-btn--disabled"
    >
      Cannot generate template (You have {{ quantifyInt("invalid input", missingInputCount) }})
    </button>
  </div>
</template>
