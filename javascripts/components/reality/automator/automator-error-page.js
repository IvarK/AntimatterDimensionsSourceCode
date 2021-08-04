"use strict";

Vue.component("automator-error-page", {
  data() {
    return {
      errors: [],
    };
  },
  computed: {
    commands: () => GameDatabase.reality.automator.commands
  },
  methods: {
    update() {
      this.errors = AutomatorData.currentErrors();
    },
    scrollToLine(line) {
      AutomatorTextUI.editor.scrollIntoView({ line, ch: 0 }, 16);
    }
  },
  template: `
    <div class="c-automator-docs-page">
      <div v-if="errors.length === 0">
        No script errors found!
      </div>
      <div v-else>
        <b>Your script has the following {{ "error" | pluralize(errors.length, "errors") }}:</b>
        <br>
        <span v-for="error in errors">
          <b>On line {{ error.startLine }}:</b>
          <button
            class="fas fa-arrow-circle-right"
            @click="scrollToLine(error.startLine)"
            v-tooltip="'Jump to line'"
          />
          <div class="c-automator-docs-page__indented">
            {{ error.info }}
          </div>
          <div class="c-automator-docs-page__indented">
            <i>Suggested fix: {{ error.tip }}</i>
          </div>
        </span>
      </div>
    </div>`
});
