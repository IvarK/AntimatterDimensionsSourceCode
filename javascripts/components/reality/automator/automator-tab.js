"use strict";

const AutomatorUI = {
  wrapper: null,
  editor: null,
};

Vue.component("automator-tab", {
  data() {
    return {
      code: null,
    };
  },
  created() {
    if (!AutomatorUI.wrapper) {
      AutomatorUI.wrapper = document.createElement("div");
      AutomatorUI.wrapper.className = "l-automator-editor__wrapper c-automator-editor__wrapper";
      const textArea = document.createElement("textarea");
      AutomatorUI.wrapper.appendChild(textArea);
      AutomatorUI.editor = CodeMirror.fromTextArea(textArea, {
        mode: "automato",
        lint: "automato",
        lineNumbers: true,
        theme: "liquibyte",
      });
    }
  },
  mounted() {
    this.$el.appendChild(AutomatorUI.wrapper);
    this.$nextTick(() => AutomatorUI.editor.refresh());
  },
  beforeDestroy() {
    this.$el.removeChild(AutomatorUI.wrapper);
  },
  template:
    `<div class="c-automator l-automator l-automator-tab__automator">
    </div>`
});