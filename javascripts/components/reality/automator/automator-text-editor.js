"use strict";

const AutomatorTextUI = {
  wrapper: null,
  editor: null,
  mode: {
    mode: "automato",
    lint: "automato",
    lineNumbers: true,
    theme: "liquibyte",
    tabSize: 2,
    extraKeys: {
      Tab: cm => cm.execCommand("indentMore"),
      "Shift-Tab": cm => cm.execCommand("indentLess"),
    },
    autoCloseBrackets: true,
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
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.documents = {});
  }
};

Vue.component("automator-text-editor", {
  props: {
    currentScriptID: {
      Type: String,
      Default: "",
    },
  },
  data() {
    return {
      markedLineNumber: 0,
    };
  },
  watch: {
    currentScriptID: {
      handler(id, oldId) {
        this.unmarkActiveLine();
        const storedScripts = player.reality.automator.scripts;
        if (!this.UI.documents[id] || this.UI.documents[id].getValue() !== storedScripts[id].content) {
          this.UI.documents[id] = CodeMirror.Doc(storedScripts[id].content, "automato");
        }
        if (this.UI.editor.getDoc() !== this.UI.documents[id]) this.UI.editor.swapDoc(this.UI.documents[id]);
        // When a script gets deleted, get rid of the old document object
        if (this.UI.documents[oldId] !== undefined && storedScripts[oldId] === undefined) {
          delete this.UI.documents[oldId];
        }
      },
      immediate: true,
    },
    fullScreen() {
      this.$nextTick(() => this.UI.editor.refresh());
    }
  },
  created() {
    AutomatorTextUI.initialize();
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.onGameLoad(), this);
  },
  mounted() {
    this.$refs.container.appendChild(this.UI.container);
    this.$nextTick(() => {
      this.UI.editor.refresh();
      this.UI.editor.performLint();
    });
  },
  beforeDestroy() {
    // This will stick around, otherwise
    this.unmarkActiveLine();
    this.$refs.container.removeChild(this.UI.container);
    EventHub.ui.offAll(this);
  },
  computed: {
    UI() {
      AutomatorTextUI.initialize();
      return AutomatorTextUI;
    },
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
  },
  methods: {
    onGameLoad() {
      this.UI.documents = {};
    },
    unmarkActiveLine() {
      if (this.markedLineNumber > 0) {
        this.UI.editor.removeLineClass(this.markedLineNumber - 1, "background", "c-automator-editor__active-line");
        this.UI.editor.removeLineClass(this.markedLineNumber - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
      this.markedLineNumber = 0;
    },
    markActiveLine(lineNumber) {
      if (this.markedLineNumber === lineNumber) return;
      this.unmarkActiveLine();
      if (lineNumber > 0) {
        this.UI.editor.addLineClass(lineNumber - 1, "background", "c-automator-editor__active-line");
        this.UI.editor.addLineClass(lineNumber - 1, "gutter", "c-automator-editor__active-line-gutter");
        this.UI.editor.scrollIntoView({ line: lineNumber - 1, ch: 0 }, 16);
        this.markedLineNumber = lineNumber;
      }
    },
    clearActiveLineStyle(lineNumber) {
      if (lineNumber > 0) {
        this.UI.editor.removeLineClass(lineNumber - 1, "background", "c-automator-editor__active-line");
        this.UI.editor.removeLineClass(lineNumber - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
    },
    update() {
      if (AutomatorBackend.isOn) {
        this.setActiveState(AutomatorBackend.state.topLevelScript, AutomatorBackend.stack.top.lineNumber);
      } else {
        this.setActiveState("", 0);
      }
    },
    setActiveState(scriptID, lineNumber) {
      if (this.currentScriptID === scriptID) this.markActiveLine(lineNumber);
      else this.unmarkActiveLine();
    },
  },
  template: `
    <div
      ref="container"
      class="c-automator-editor l-automator-editor l-automator-pane__content"
    />`
});
