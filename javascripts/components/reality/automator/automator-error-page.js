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
      const errorLine = AutomatorData.currentErrorLine - 1;
      AutomatorTextUI.editor.removeLineClass(errorLine, "background", "c-automator-editor__error-line");
      AutomatorTextUI.editor.removeLineClass(errorLine, "gutter", "c-automator-editor__error-line-gutter");
      AutomatorTextUI.editor.addLineClass(line - 1, "background", "c-automator-editor__error-line");
      AutomatorTextUI.editor.addLineClass(line - 1, "gutter", "c-automator-editor__error-line-gutter");
      AutomatorData.currentErrorLine = line;
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
        <i>
          Note: Sometimes errors may cause the automator to be unable to scan the rest of the script.
          This may result in some errors "disappearing" due to other errors occurring in earlier lines.
        </i>
      </div>
    </div>`
});
