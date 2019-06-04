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

Vue.component("automator-editor", {
  data() {
    return {
      code: null,
      activeLine: 0,
      currentScriptID: "",
      isRunning: false,
      repeatOn: false,
    };
  },
  watch: {
    activeLine(newVal, oldVal) {
      if (oldVal > 0) AutomatorUI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
      if (newVal > 0) AutomatorUI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
    },
    fullScreen() {
      this.$nextTick(() => AutomatorUI.editor.refresh());
    }
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    mode: {
      get() {
        return this.$viewModel.tabs.reality.automator.mode;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.mode = value;
      }
    },
    modeIconClass() {
      return this.mode ? "fa-cubes" : "fa-code";
    }
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
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
    rewind: () => AutomatorBackend.restart(),
    play() {
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AutomatorMode.RUN;
      else AutomatorBackend.start(this.currentScriptID);
    },
    pause: () => AutomatorBackend.pause(),
    stop: () => AutomatorBackend.stop(),
    step() {
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AutomatorMode.SINGLE_STEP;
      else AutomatorBackend.start(this.currentScriptID, AutomatorMode.SINGLE_STEP);
    },
    repeat: () => AutomatorBackend.toggleRepeat(),
  },
  created() {
    if (!AutomatorUI.container) {
      AutomatorUI.container = document.createElement("div");
      AutomatorUI.container.className = "l-automator-editor__codemirror-container";
      const textArea = document.createElement("textarea");
      AutomatorUI.container.appendChild(textArea);
      AutomatorUI.editor = CodeMirror.fromTextArea(textArea, AutomatorUI.mode);
      AutomatorUI.editor.on("keydown", (editor, event) => {
        if (editor.state.completionActive) return;
        const key = event.key;
        console.log(event);
        if (event.ctrlKey || event.altKey || event.metaKey || !/^[a-zA-Z0-9 \t]$/u.test(key)) return;
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
      });
      AutomatorUI.editor.on("change", editor => {
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
    this.$refs.container.appendChild(AutomatorUI.container);
    this.$nextTick(() => AutomatorUI.editor.refresh());
  },
  beforeDestroy() {
    if (this.activeLine > 0) {
      // This will stick around, otherwise
      AutomatorUI.editor.removeLineClass(this.activeLine - 1, "background", "c-automator-editor__active-line");
    }
    this.$refs.container.removeChild(AutomatorUI.container);
    EventHub.logic.offAll(this);
  },
  template:
    `<div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
        <automator-button class="fa-fast-backward" @click="rewind"/>
        <automator-button
          class="fa-play"
          :class="{ 'c-automator__button-play--active' : isRunning }"
          @click="play"
        />
        <automator-button class="fa-pause" @click="pause"/>
        <automator-button class="fa-stop" @click="stop"/>
        <automator-button class="fa-step-forward" @click="step"/>
        <automator-button
          class="fa-sync-alt"
                :class="{ 'c-automator__button-repeat--active' : repeatOn }"
          @click="repeat"
        />
        <automator-button
          class="l-automator__button--corner"
          :class="modeIconClass"
          @click="mode = !mode"
        />
      </div>
      <div class="c-automator-editor l-automator-editor l-automator-pane__content" ref="container" />
    </div>`
});
