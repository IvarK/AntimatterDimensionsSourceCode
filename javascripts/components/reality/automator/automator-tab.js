"use strict";

const AutomatorUI = {
  wrapper: null,
  editor: null,
  mode: {
    mode: "automato",
    lint: "automato",
    lineNumbers: true,
    styleActiveLine: true,
    theme: "liquibyte",
  },
  documents: {},
};

Vue.component("automator-tab", {
  data() {
    return {
      code: null,
      activeLine: 0,
      currentScriptID: "",
    };
  },
  watch: {
    activeLine(newVal, oldVal) {
      if (oldVal > 0) AutomatorUI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
      if (newVal > 0) AutomatorUI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
    }
  },
  methods: {
    update() {
      if (AutomatorBackend.state.topLevelScript !== this.currentScriptID || !AutomatorBackend.isOn) {
        this.activeLine = 0;
        return;
      }
      const newLineNumber = AutomatorBackend.stack.top.lineNumber;
      if (newLineNumber > AutomatorUI.editor.getDoc().lineCount()) {
        this.activeLine = 0;
        return;
      }
      this.activeLine = newLineNumber;
    },
    onGameLoad() {
      AutomatorUI.documents = {};
      this.updateCurrentScriptID();
    },
    updateCurrentScriptID() {
      const storedScripts = player.reality.automator.scripts;
      this.currentScriptID = player.reality.automator.state.editorScript;
      // This shouldn't happen if things are loaded in the right order, but might as well be sure.
      if (storedScripts[this.currentScriptID] === undefined) {
        console.log(`Could not find currentScriptID ${this.currentScriptID} in player`);
        this.currentScriptID = Object.keys(storedScripts)[0];
        player.reality.automator.state.editorScript = this.currentScriptID;
      }
      if (AutomatorUI.documents[this.currentScriptID] === undefined) {
        console.log(`Could not find currentScriptID ${this.currentScriptID} in documents`);
        AutomatorUI.documents[this.currentScriptID] =
          CodeMirror.Doc(storedScripts[this.currentScriptID].content, "automato");
      }
      AutomatorUI.editor.swapDoc(AutomatorUI.documents[this.currentScriptID]);
    },
  },
  created() {
    if (!AutomatorUI.wrapper) {
      AutomatorUI.wrapper = document.createElement("div");
      AutomatorUI.wrapper.className = "l-automator-editor__wrapper c-automator-editor__wrapper";
      const textArea = document.createElement("textarea");
      AutomatorUI.wrapper.appendChild(textArea);
      AutomatorUI.editor = CodeMirror.fromTextArea(textArea, AutomatorUI.mode);
      AutomatorUI.editor.on("keyup", (editor, event) => {
        if (editor.state.completionActive) return;
        const key = event.key;
        if (!/^[a-zA-Z0-9 \t]$/u.test(key)) return;
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
      });
      AutomatorUI.editor.on("change", (editor, changes) => {
        player.reality.automator.scripts[this.currentScriptID].content = editor.getDoc().getValue();
        if (this.currentScriptID === player.reality.automator.state.topLevelScript) {
          AutomatorBackend.stop();
        }
      });
    }
    EventHub.logic.on(GameEvent.GAME_LOAD, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
  },
  mounted() {
    this.$el.appendChild(AutomatorUI.wrapper);
    this.$nextTick(() => AutomatorUI.editor.refresh());
  },
  beforeDestroy() {
    this.$el.removeChild(AutomatorUI.wrapper);
    EventHub.logic.offAll(this);
  },
  template:
    `<div class="c-automator l-automator l-automator-tab__automator">
    </div>`
});