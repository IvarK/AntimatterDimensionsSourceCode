<script>
export default {
  name: "AutomatorTextEditor",
  props: {
    currentScriptId: {
      type: [Number, String],
      required: true
    },
  },
  data() {
    return {
      markedLineNumber: 0,
      unclearedLines: false,
      isActiveScript: false,
    };
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
  watch: {
    currentScriptId: {
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
    this.on$(GAME_EVENT.GAME_LOAD, () => this.onGameLoad());
  },
  mounted() {
    this.$refs.container.appendChild(this.UI.container);
    this.$nextTick(() => {
      this.UI.editor.refresh();
      this.UI.editor.performLint();
      this.UI.editor.scrollTo(null, AutomatorTextUI.savedVertPos);
    });
  },
  beforeDestroy() {
    // This will stick around, otherwise
    this.unmarkActiveLine();
    AutomatorTextUI.savedVertPos = AutomatorTextUI.editor.doc.scrollTop;
    this.$refs.container.removeChild(this.UI.container);
  },
  methods: {
    update() {
      AutomatorBackend.jumpToActiveLine();
      if (this.unclearedLines && !AutomatorBackend.isOn) this.clearAllActiveLines();
      if (AutomatorBackend.isOn) {
        this.setActiveState(`${AutomatorBackend.state.topLevelScript}`, AutomatorBackend.stack.top.lineNumber);
      } else {
        this.setActiveState("", -1);
      }
    },
    onGameLoad() {
      this.UI.documents = {};
    },
    unmarkActiveLine() {
      AutomatorHighlighter.updateHighlightedLine(-1, "Active");
    },
    markActiveLine(lineNumber) {
      AutomatorHighlighter.updateHighlightedLine(lineNumber, "Active");
      this.unclearedLines = true;
    },
    // This only runs when a script is interrupted and stops during execution because of the player editing the text
    clearAllActiveLines() {
      AutomatorHighlighter.clearAllHighlightedLines();
      this.unclearedLines = false;
    },
    setActiveState(scriptID, lineNumber) {
      if (`${this.currentScriptId}` === scriptID) this.markActiveLine(lineNumber);
      else this.unmarkActiveLine();
    },
  }
};

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
    lineWrapping: true
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
      const scriptText = editor.getDoc().getValue();
      AutomatorBackend.saveScript(scriptID, scriptText);

      AutomatorData.recalculateErrors();
      const errors = AutomatorData.currentErrors().length;
      if (errors > editor.doc.size) SecretAchievement(48).unlock();

      // Clear all line highlighting as soon as any text is changed because that might have shifted lines around
      AutomatorHighlighter.clearAllHighlightedLines();
    });
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.documents = {});
  },
  // Used to return back to the same line the editor was on from before switching tabs
  savedVertPos: 0,
};
</script>

<template>
  <div
    ref="container"
    class="c-automator-editor l-automator-editor l-automator-pane__content"
  />
</template>
