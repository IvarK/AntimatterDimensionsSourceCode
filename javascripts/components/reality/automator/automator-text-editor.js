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
    activeLine: Number,
    currentScriptID: {
      Type: String,
      Default: "",
    }
  },
  watch: {
    activeLine: {
      handler(newVal, oldVal) {
        if (oldVal > 0) {
          this.UI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
          this.UI.editor.removeLineClass(oldVal - 1, "gutter", "c-automator-editor__active-line-gutter");
        }
        if (newVal > 0 && newVal <= this.UI.editor.getDoc().lineCount()) {
          this.UI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
          this.UI.editor.addLineClass(newVal - 1, "gutter", "c-automator-editor__active-line-gutter");
        }
      },
      immediate: true,
    },
    currentScriptID: {
      handler(id, oldId) {
        const storedScripts = player.reality.automator.scripts;
        this.UI.documents[id] = CodeMirror.Doc(storedScripts[id].content, "automato");
        this.UI.editor.swapDoc(this.UI.documents[id]);
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
    if (this.activeLine > 0) {
      // This will stick around, otherwise
      this.UI.editor.removeLineClass(this.activeLine - 1, "background", "c-automator-editor__active-line");
    }
    this.$refs.container.removeChild(this.UI.container);
    EventHub.ui.offAll(this);
  },
  template: `
    <div ref="container"
         class="c-automator-editor l-automator-editor l-automator-pane__content"/>`
});
