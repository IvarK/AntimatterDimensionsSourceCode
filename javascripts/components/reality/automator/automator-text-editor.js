export const AutomatorTextUI = {
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
      // Clear all line highlighting as soon as any text is changed. We can't use the locations of previously
      // highlighted lines because changes may shift the line numbers around before they're cleared.
      this.clearAllHighlightedLines("Active");
      this.clearAllHighlightedLines("Error");
      this.clearAllHighlightedLines("Event");
    });
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.documents = {});
  },
  // Used to return back to the same line the editor was on from before switching tabs
  savedVertPos: 0,
  scrollToLine(line) {
    this.editor.scrollIntoView({ line, ch: 0 });
  },
  // Line highlighting requires a reference to the row in order to clear it, so keep track of the lines currently
  // being highlighted for errors or events so that they can be referenced to be cleared instead of the alternative
  // of looping through and clearing every line (bad for performance)
  currentActiveLine: -1,
  currentErrorLine: -1,
  currentEventLine: -1,
  updateHighlightedLine(line, key) {
    this.removeHighlightedLine(key);
    this.addHighlightedLine(line, key);
  },
  removeHighlightedLine(key) {
    const removedLine = this[`current${key}Line`] - 1;
    this.editor.removeLineClass(removedLine, "background", `c-automator-editor__${key.toLowerCase()}-line`);
    this.editor.removeLineClass(removedLine, "gutter", `c-automator-editor__${key.toLowerCase()}-line-gutter`);
    this[`current${key}Line`] = -1;
  },
  addHighlightedLine(line, key) {
    this.editor.addLineClass(line - 1, "background", `c-automator-editor__${key.toLowerCase()}-line`);
    this.editor.addLineClass(line - 1, "gutter", `c-automator-editor__${key.toLowerCase()}-line-gutter`);
    this[`current${key}Line`] = line;
  },
  clearAllHighlightedLines(key) {
    for (let line = 0; line < this.editor.doc.size; line++) {
      this.editor.removeLineClass(line, "background", `c-automator-editor__${key.toLowerCase()}-line`);
      this.editor.removeLineClass(line, "gutter", `c-automator-editor__${key.toLowerCase()}-line-gutter`);
    }
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
      unclearedLines: false,
      isActiveScript: false,
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
      // Take the scroll attribute of the editor and convert into a line number, then use the scrollToLine function
      // in order to move the editor back to the line it was on before switching tabs. I suspect this has a chance
      // to be device-dependent somehow, but it seems to seems to have worked fairly accurately on all situations
      // I was able to test personally - Chrome/FF, varying screen zoom settings, and varying monitor resolutions.
      const UNITS_PER_LINE = 15.305;
      const targetLine = Math.round(AutomatorTextUI.savedVertPos / UNITS_PER_LINE) + 24;
      AutomatorTextUI.scrollToLine(Math.clampMax(targetLine, AutomatorTextUI.editor.lastLine() + 1));
    });
  },
  beforeDestroy() {
    // This will stick around, otherwise
    this.unmarkActiveLine();
    AutomatorTextUI.savedVertPos = AutomatorTextUI.editor.doc.scrollTop;
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
    update() {
      AutomatorBackend.jumpToActiveLine();
      if (this.unclearedLines && !AutomatorBackend.isOn) this.clearAllActiveLines();
      if (AutomatorBackend.isOn) {
        this.setActiveState(`${AutomatorBackend.state.topLevelScript}`, AutomatorBackend.stack.top.lineNumber);
      } else {
        this.setActiveState("", 0);
      }
    },
    onGameLoad() {
      this.UI.documents = {};
    },
    unmarkActiveLine() {
      this.UI.removeHighlightedLine("Active");
    },
    markActiveLine(lineNumber) {
      this.UI.updateHighlightedLine(lineNumber, "Active");
      this.unclearedLines = true;
    },
    // This only runs once when a script is interrupted and stops during execution because of the player editing the
    // text, but it needs to loop through and clear all lines since editing text may cause arbitrarily shifts of the
    // active line index via pasting/deleting large code blocks
    clearAllActiveLines() {
      this.UI.clearAllHighlightedLines("Active");
      this.unclearedLines = false;
    },
    setActiveState(scriptID, lineNumber) {
      if (`${this.currentScriptID}` === scriptID) this.markActiveLine(lineNumber);
      else this.unmarkActiveLine();
    },
  },
  template: `
    <div
      ref="container"
      class="c-automator-editor l-automator-editor l-automator-pane__content"
    />`
});
