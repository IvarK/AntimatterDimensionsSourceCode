"use strict";

const AutomatorUI = {
  wrapper: null,
  editor: null,
};

let borkbork = 0

Vue.component("automator-tab", {
  data() {
    return {
      code: null,
      activeLine: 0,
    };
  },
  watch: {
    activeLine(newVal, oldVal) {
      if (newVal > 0) AutomatorUI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
      if (oldVal > 0) AutomatorUI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
    }
  },
  methods: {
    update() {
      this.activeLine = AutomatorBackend.stack.isEmpty
        ? 0 : AutomatorBackend.stack.top.lineNumber;
      this.activeLine = borkbork;
    }
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
        styleActiveLine: true,
        theme: "liquibyte",
      });
      AutomatorUI.editor.on("keyup", (editor, event) => {
        if (editor.state.completionActive) return;
        const key = event.key;
        if (!/^[a-zA-Z0-9 \t]$/u.test(key)) return;
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
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