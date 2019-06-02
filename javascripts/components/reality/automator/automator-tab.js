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
      isRunning: false,
      repeatOn: false,
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
    if (this.activeLine > 0) {
      // This will stick around, otherwise
      AutomatorUI.editor.removeLineClass(this.activeLine - 1, "background", "c-automator-editor__active-line");
    }
    this.$el.removeChild(AutomatorUI.wrapper);
    EventHub.logic.offAll(this);
  },
  template:
    `<div class="c-automator l-automator l-automator-tab__automator">
      <div class="l-automator__top-row">
        <div class="c-automator__controls l-automator__controls">
          <button class="c-automator__button l-automator__button fas fa-fast-backward" @click="rewind" />
          <button class="c-automator__button l-automator__button fas fa-play"
                  :class="{ 'c-automator__button-play--active' : isRunning }"
                  @click="play" />
          <button class="c-automator__button l-automator__button fas fa-pause" @click="pause" />
          <button class="c-automator__button l-automator__button fas fa-stop" @click="stop" />
          <button class="c-automator__button l-automator__button fas fa-step-forward" @click="step" />
          <button class="c-automator__button l-automator__button fas fa-sync-alt"
                  :class="{ 'c-automator__button-repeat--active' : repeatOn }"
                  @click="repeat" />
        </div>
      </div>
    </div>`
});