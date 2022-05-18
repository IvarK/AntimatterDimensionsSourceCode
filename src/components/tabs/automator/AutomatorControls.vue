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
      currentLine: 0,
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
      // TODO Check for correct script, add script name to running
      const prefix = "Status: ";
      // Pad with leading zeroes based on script length to prevent text jitter on fast scripts. This technically fails
      // for scripts with more than 99999 lines, but scripts that long will be prevented elsewhere
      const digits = Math.ceil(Math.log10(AutomatorBackend.currentScriptLength));
      let lineNum = `0000${this.currentLine}`;
      lineNum = lineNum.slice(lineNum.length - digits);

      if (this.isPaused) return `${prefix}Paused (Will run line ${lineNum} when resumed)`;
      if (!this.isRunning) return `${prefix}Not running (Will start at beginning)`;
      return `${prefix}Running (Last executed line ${lineNum})`;
    },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.forceRestartOn = AutomatorBackend.state.forceRestart;
      this.followExecution = AutomatorBackend.state.followExecution;
      if (this.isRunning) this.currentLine = AutomatorBackend.currentLineNumber;
    },
    rewind: () => AutomatorBackend.restart(),
    play() {
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
    </div>
    <div class="l-automator-button-row c-automator__status-text">
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

.c-automator__button--active {
  background-color: var(--color-reality);
  border-color: var(--color-reality-light);
}

.c-automator__button.fa-eject::before {
  transform: rotate(90deg);
}
</style>
