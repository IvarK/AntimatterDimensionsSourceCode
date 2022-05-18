<script>
import AutomatorButton from "./AutomatorButton";

export default {
  name: "AutomatorControls",
  components: {
    AutomatorButton
  },
  data() {
    return {
      isRunning: false,
      isPaused: false,
      repeatOn: false,
      forceRestartOn: false,
      followExecution: false,
      hasErrors: false,
      currentLine: 0,
      runningName: "",
      editingName: "",
    };
  },
  computed: {
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
      const digits = Math.clampMin(Math.ceil(Math.log10(AutomatorBackend.currentScriptLength)), 1);
      let lineNum = `0000${this.currentLine}`;
      lineNum = lineNum.slice(lineNum.length - digits);

      if (this.isPaused) return `Paused: "${this.runningName}" (Resumes on Line ${lineNum})`;
      if (this.isRunning) return `Running: "${this.runningName}" (Line ${lineNum})`;
      if (this.hasErrors) return `Stopped: "${this.editingName}" has errors (Cannot run)`;
      return `Stopped: Will start running "${this.editingName}"`;
    },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.forceRestartOn = AutomatorBackend.state.forceRestart;
      this.followExecution = AutomatorBackend.state.followExecution;
      this.hasErrors = AutomatorData.currentErrors().length !== 0;
      this.currentLine = AutomatorBackend.currentLineNumber;
      this.runningName = AutomatorBackend.scriptName;
      this.editingName = AutomatorBackend.currentEditingScript.name;
    },
    rewind: () => AutomatorBackend.restart(),
    play() {
      if (this.hasErrors) return;
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
  }
};
</script>

<template>
  <div class="c-automator__controls l-automator__controls">
    <div class="l-automator-button-row">
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
        v-tooltip="'Restart script automatically when it completes'"
        class="fa-sync-alt"
        :class="{ 'c-automator__button--active' : repeatOn }"
        @click="repeat"
      />
      <AutomatorButton
        v-tooltip="'Restart script when finishing or restarting a Reality'"
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
      <div class="c-automator__status-text c-automator__status-text--edit">
        {{ editingName }}
      </div>
    </div>
    <div
      class="l-automator-button-row c-automator__status-text"
      :class="{ 'c-automator__status-text--error' : hasErrors && !isRunning }"
    >
      {{ statusText }}
    </div>
  </div>
</template>

<style scoped>
.c-automator__status-text {
  color: var(--color-reality);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0 0.5rem;
}

.c-automator__status-text--edit {
  color: var(--color-accent);
}

.c-automator__status-text--error {
  color: var(--color-bad);
}

.c-automator__button--active {
  background-color: var(--color-reality);
  border-color: var(--color-reality-light);
}

.c-automator__button.fa-eject::before {
  transform: rotate(90deg);
}
</style>
