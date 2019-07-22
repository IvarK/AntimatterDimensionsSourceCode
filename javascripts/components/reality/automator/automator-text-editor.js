"use strict";

const AutomatorUI = {
  wrapper: null,
  editor: null,
  mode: {
    mode: "automato",
    lint: "automato",
    lineNumbers: true,
    theme: "liquibyte",
  },
  documents: {},
  initialize() {
    if (this.container) return;
    this.container = document.createElement("div");
    this.container.className = "l-automator-editor__codemirror-container";
    const textArea = document.createElement("textarea");
    this.container.appendChild(textArea);
    this.editor = CodeMirror.fromTextArea(textArea, this.mode);
    this.editor.on("keydown", (editor, event) => {
      if (editor.state.completionActive) return;
      const key = event.key;
      if (event.ctrlKey || event.altKey || event.metaKey || !/^[a-zA-Z0-9 \t]$/u.test(key)) return;
      CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    });
    this.editor.on("change", editor => {
      const scriptID = ui.view.tabs.reality.automator.editorScriptID;
      AutomatorBackend.saveScript(scriptID, editor.getDoc().getValue());
    });
    EventHub.ui.on(GameEvent.GAME_LOAD, () => this.documents = {});
  }
};

Vue.component("automator-text-editor", {
  props: {
    activeLine: Number,
    currentScriptID: String,
  },
  watch: {
    activeLine(newVal, oldVal) {
      if (oldVal > 0) {
        AutomatorTextUI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
        AutomatorTextUI.editor.removeLineClass(oldVal - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
      if (newVal > 0 && newVal <= AutomatorTextUI.editor.getDoc().lineCount()) {
        AutomatorTextUI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
        AutomatorTextUI.editor.addLineClass(newVal - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
    },
    currentScriptID(id) {
      const storedScripts = player.reality.automator.scripts;
      if (AutomatorTextUI.documents[id] === undefined) {
        AutomatorTextUI.documents[id] = CodeMirror.Doc(storedScripts[id].content, "automato");
      }
      AutomatorTextUI.editor.swapDoc(AutomatorTextUI.documents[id]);
    },
    fullScreen() {
      this.$nextTick(() => AutomatorTextUI.editor.refresh());
    }
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
  },
  methods: {
    onGameLoad() {
      AutomatorTextUI.documents = {};
    },
  },
  created() {
    AutomatorTextUI.initialize();
    EventHub.ui.on(GameEvent.GAME_LOAD, () => this.onGameLoad(), this);
  },
  mounted() {
    this.$refs.container.appendChild(AutomatorTextUI.container);
    this.$nextTick(() => {
      AutomatorUI.editor.refresh();
      AutomatorUI.editor.performLint();
    });
  },
  beforeDestroy() {
    if (this.activeLine > 0) {
      // This will stick around, otherwise
      AutomatorTextUI.editor.removeLineClass(this.activeLine - 1, "background", "c-automator-editor__active-line");
    }
    this.$refs.container.removeChild(AutomatorTextUI.container);
    EventHub.ui.offAll(this);
  },
  template: `
    <div ref="container"
         class="c-automator-editor l-automator-editor l-automator-pane__content"/>`
});
