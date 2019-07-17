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

Vue.component("automator-editor", {
  data() {
    return {
      code: null,
      activeLine: 0,
      isRunning: false,
      isPaused: false,
      repeatOn: false,
      editingName: false,
      runningScriptID: 0,
      scripts: [],
    };
  },
  watch: {
    activeLine(newVal, oldVal) {
      if (oldVal > 0) {
        AutomatorUI.editor.removeLineClass(oldVal - 1, "background", "c-automator-editor__active-line");
        AutomatorUI.editor.removeLineClass(oldVal - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
      if (newVal > 0) {
        AutomatorUI.editor.addLineClass(newVal - 1, "background", "c-automator-editor__active-line");
        AutomatorUI.editor.addLineClass(newVal - 1, "gutter", "c-automator-editor__active-line-gutter");
      }
    },
    fullScreen() {
      this.$nextTick(() => AutomatorUI.editor.refresh());
    }
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
      }
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
    },
    playTooltip() {
      if (this.isRunning) return undefined;
      if (this.isPaused) return "Resume automator execution";
      return "Start automator";
    }
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
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
      this.updateScriptList();
    },
    updateScriptList() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
    updateCurrentScriptID() {
      const storedScripts = player.reality.automator.scripts;
      this.currentScriptID = player.reality.automator.state.editorScript;
      // This shouldn't happen if things are loaded in the right order, but might as well be sure.
      if (storedScripts[this.currentScriptID] === undefined) {
        this.currentScriptID = Object.keys(storedScripts)[0];
        player.reality.automator.state.editorScript = this.currentScriptID;
      }
      if (AutomatorUI.documents[this.currentScriptID] === undefined) {
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
    rename() {
      this.editingName = true;
      this.$nextTick(() => {
        this.$refs.renameInput.value = player.reality.automator.scripts[this.currentScriptID].name;
        this.$refs.renameInput.focus();
      });
    },
    selectedScriptAttribute(id) {
      return id === this.currentScriptID ? { selected: "selected" } : {};
    },
    createNewScript() {
      const newScript = AutomatorBackend.newScript();
      player.reality.automator.state.editorScript = newScript.id;
      this.updateScriptList();
      this.rename();
    },
    onScriptDropdown(event) {
      const menu = event.target;
      if (menu.selectedIndex === menu.length - 1) this.createNewScript();
      else player.reality.automator.state.editorScript = this.scripts[menu.selectedIndex].id;
      this.updateCurrentScriptID();
    },
    nameEdited() {
      // Trim off leading and trailing whitespace
      const trimmed = this.$refs.renameInput.value.match(/^\s*(.*?)\s*$/u);
      if (trimmed.length === 2 && trimmed[1].length > 0) {
        player.reality.automator.scripts[this.currentScriptID].name = trimmed[1];
        this.updateScriptList();
      }
      this.$nextTick(() => this.editingName = false);
    },
    dropdownLabel(script) {
      let label = script.name;
      if (script.id === this.runningScriptID) {
        if (this.isRunning) label += " (Running)";
        else if (this.isPaused) label += " (Paused)";
      }
      return label;
    }
  },
  created() {
    AutomatorUI.initialize();
    EventHub.ui.on(GameEvent.GAME_LOAD, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
    this.updateScriptList();
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
    EventHub.ui.offAll(this);
  },
  template:
    `<div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
        <automator-button class="fa-fast-backward"
          @click="rewind"
          v-tooltip="'rewind automator to the first command'"/>
        <automator-button
          class="fa-play"
          :class="{ 'c-automator__button-play--active' : isRunning }"
          @click="play"
          v-tooltip="playTooltip"
        />
        <automator-button class="fa-pause"
          :class="{ 'c-automator__button--active': isPaused }"
          @click="pause"
          v-tooltip="'Pause automator on current command'"/>
        <automator-button class="fa-stop"
          @click="stop"
          v-tooltip="'Stop automator and reset position'"/>
        <automator-button class="fa-step-forward"
          @click="step"
          v-tooltip="'Step forward one line'"/>
        <automator-button
          class="fa-sync-alt"
          :class="{ 'c-automator__button--active' : repeatOn }"
          @click="repeat"
          v-tooltip="'Restart script automatically when it completes'"
        />
        <div class="l-automator__script-names">
          <template v-if="!editingName">
            <select class="l-automator__scripts-dropdown"
                    @input="onScriptDropdown">
              <option v-for="script in scripts"
                      v-bind="selectedScriptAttribute(script.id)"
                      :value="script.id">{{dropdownLabel(script)}}</option>
              <option value="createNewScript">Create new...</option>
            </select>
            <automator-button class="far fa-edit" @click="rename"/>
          </template>
          <input v-else ref="renameInput"
                        class="l-automator__rename-input"
                        @blur="nameEdited"
                        @keyup.enter="$refs.renameInput.blur()"/>
        </div>
        <automator-button
          class="l-automator__button--corner"
          :class="modeIconClass"
          @click="mode = !mode"
        />
      </div>
      <div class="c-automator-editor l-automator-editor l-automator-pane__content" ref="container" />
    </div>`
});
