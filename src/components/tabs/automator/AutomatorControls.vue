<script>
import AutomatorButton from "./AutomatorButton";
import AutomatorModeSwitch from "./AutomatorModeSwitch";

export default {
  name: "AutomatorControls",
  components: {
    AutomatorButton,
    AutomatorModeSwitch
  },
  data() {
    return {
      isRunning: false,
      isPaused: false,
      repeatOn: false,
      justCompleted: false,
      forceRestartOn: false,
      followExecution: false,
      hasErrors: false,
      currentLine: 0,
      statusName: "",
      editingName: "",
      editingDifferentScript: false,
      currentChars: 0,
      hasUndo: false,
      hasRedo: false,
    };
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    currentScriptID() {
      return this.$viewModel.tabs.reality.automator.editorScriptID;
    },
    playTooltip() {
      if (this.isPaused) return "Resume Automator execution";
      if (!this.isRunning) return "Start Automator";
      return "Pause Automator execution";
    },
    playButtonClass() {
      return {
        "c-automator__button--active": this.isRunning,
        "fa-play": !this.isRunning && !this.isPaused,
        "fa-pause": this.isRunning,
        "fa-eject": this.isPaused
      };
    },
    statusText() {
      // Pad with leading zeroes based on script length to prevent text jitter on fast scripts. This technically fails
      // for scripts with more than 99999 lines, but scripts that long will be prevented elsewhere
      const digits = Math.clampMin(Math.ceil(Math.log10(AutomatorBackend.currentScriptLength + 1)), 1);
      let lineNum = `0000${this.currentLine}`;
      lineNum = lineNum.slice(lineNum.length - digits);

      if (this.isPaused) return `Paused: "${this.statusName}" (Resumes on Line ${lineNum})`;
      if (this.isRunning) return `Running: "${this.statusName}" (Line ${lineNum})`;
      if (this.hasErrors) return `Stopped: "${this.statusName}" has errors (Cannot run)`;
      return `Stopped: Will start running "${this.statusName}"`;
    },
    maxScriptChars() {
      return AutomatorData.MAX_ALLOWED_SCRIPT_CHARACTERS;
    },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.justCompleted = AutomatorBackend.hasJustCompleted;
      this.forceRestartOn = AutomatorBackend.state.forceRestart;
      this.followExecution = AutomatorBackend.state.followExecution;
      this.hasErrors = AutomatorData.currentErrors().length !== 0;
      this.currentLine = AutomatorBackend.currentLineNumber;

      // When the automator isn't running, the script name contains the last run script instead of the
      // to-be-run script, which is the currently displayed one in the editor
      this.statusName = (this.isPaused || this.isRunning)
        ? AutomatorBackend.scriptName
        : AutomatorBackend.currentEditingScript.name;
      this.duplicateStatus = AutomatorBackend.hasDuplicateName(this.statusName);
      this.editingDifferentScript = (this.isRunning || this.isPaused) &&
        AutomatorBackend.currentEditingScript.id !== AutomatorBackend.currentRunningScript.id;

      this.currentChars = AutomatorData.singleScriptCharacters();
      this.hasUndo = AutomatorData.undoBuffer.length > 0;
      this.hasRedo = AutomatorData.redoBuffer.length > 0;
    },
    rewind: () => AutomatorBackend.restart(),
    play() {
      if (this.hasErrors) {
        // This shouldn't be needed but someone's save was still on MODE.RUN when the script had errors so this
        // is just an additional layer of failsafe in case something goes wrong
        AutomatorBackend.mode = AUTOMATOR_MODE.PAUSED;
        return;
      }
      if (this.isRunning) {
        AutomatorBackend.pause();
        return;
      }
      if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) this.$emit("automatorplay");
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AUTOMATOR_MODE.RUN;
      else AutomatorBackend.start(this.currentScriptID);
    },
    stop: () => AutomatorBackend.stop(),
    step() {
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AUTOMATOR_MODE.SINGLE_STEP;
      else AutomatorBackend.start(this.currentScriptID, AUTOMATOR_MODE.SINGLE_STEP);
    },
    repeat: () => AutomatorBackend.toggleRepeat(),
    restart: () => AutomatorBackend.toggleForceRestart(),
    follow: () => AutomatorBackend.toggleFollowExecution(),
    undo: () => AutomatorData.undoScriptEdit(),
    redo: () => AutomatorData.redoScriptEdit(),
  }
};
</script>

<template>
  <div class="c-automator__controls l-automator__controls">
    <div class="c-automator-control-row l-automator-button-row">
      <div class="c-button-group">
        <AutomatorButton
          v-tooltip="'Rewind Automator to the first command'"
          class="fa-fast-backward"
          @click="rewind"
        />
        <AutomatorButton
          v-tooltip="{
            content: playTooltip,
            hideOnTargetClick: false
          }"
          :class="playButtonClass"
          @click="play"
        />
        <AutomatorButton
          v-tooltip="'Stop Automator and reset position'"
          class="fa-stop"
          @click="stop"
        />
        <AutomatorButton
          v-tooltip="'Step forward one line'"
          class="fa-step-forward"
          @click="step"
        />
        <AutomatorButton
          v-tooltip="'Restart script automatically when it reaches the end'"
          class="fa-sync-alt"
          :class="{ 'c-automator__button--active' : repeatOn }"
          @click="repeat"
        />
        <AutomatorButton
          v-tooltip="'Automatically restart the active script when finishing or restarting a Reality'"
          class="fa-reply"
          :class="{ 'c-automator__button--active' : forceRestartOn }"
          @click="restart"
        />
        <AutomatorButton
          v-tooltip="'Scroll Automator to follow current line'"
          class="fa-indent"
          :class="{ 'c-automator__button--active' : followExecution }"
          @click="follow"
        />
        <span
          v-if="fullScreen"
          class="c-automator__status-text c-automator__status-text--small"
          :class="{ 'c-automator__status-text--error' : currentChars > maxScriptChars }"
        >
          This script: {{ formatInt(currentChars) }}/{{ formatInt(maxScriptChars) }}
        </span>
      </div>
      <div class="c-button-group">
        <AutomatorButton
          v-tooltip="'Undo'"
          class="fa-arrow-rotate-left"
          :class="{ 'c-automator__button--inactive' : !hasUndo }"
          @click="undo"
        />
        <AutomatorButton
          v-tooltip="'Redo'"
          class="fa-arrow-rotate-right"
          :class="{ 'c-automator__button--inactive' : !hasRedo }"
          @click="redo"
        />
        <AutomatorModeSwitch />
      </div>
    </div>
    <div class="l-automator-button-row">
      <span
        v-if="duplicateStatus"
        v-tooltip="'More than one script has this name!'"
        class="fas fa-exclamation-triangle c-automator__status-text c-automator__status-text--error"
      />
      <span
        v-if="editingDifferentScript"
        v-tooltip="'The automator is running a different script than the editor is showing'"
        class="fas fa-circle-exclamation c-automator__status-text c-automator__status-text--warning"
      />
      <span
        v-if="justCompleted"
        v-tooltip="'The automator completed running the previous script'"
        class="fas fa-circle-check c-automator__status-text"
      />
      <span
        class="c-automator__status-text"
        :class="{ 'c-automator__status-text--error' : hasErrors && !(isRunning || isPaused) }"
      >
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.c-automator-control-row {
  justify-content: space-between;
}

.c-button-group {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.c-automator__status-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-reality);
  padding: 0 0.5rem;
}

.c-automator__status-text--small {
  font-size: 1.1rem;
}

.c-automator__status-text--warning {
  color: var(--color-good-paused);
}

.c-automator__status-text--error {
  color: var(--color-bad);
}

.c-automator__button--active {
  background-color: var(--color-automator-controls-active);
  border-color: var(--color-reality-light);
}

.c-automator__button--inactive {
  background-color: var(--color-automator-controls-border);
  border-color: var(--color-reality-light);
}

.c-automator__button.fa-eject::before {
  transform: rotate(90deg);
}
</style>
