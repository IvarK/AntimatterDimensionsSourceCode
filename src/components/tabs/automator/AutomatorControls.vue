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
    playPauseClass() {
      return {
        "c-automator__button--active": this.isRunning,
        "fa-play": !this.isRunning || this.isPaused,
        "fa-pause": !this.isPaused,
      };
    },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.forceRestartOn = AutomatorBackend.state.forceRestart;
      this.followExecution = AutomatorBackend.state.followExecution;
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
  <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
    <AutomatorButton
      v-tooltip="'Rewind Automator to the first command'"
      class="fa-fast-backward"
      @click="rewind"
    />
    <AutomatorButton
      v-tooltip="playTooltip"
      :class="playPauseClass"
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
</template>

<style scoped>

</style>
