Vue.component("automator-controls", {
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
  },
  template: `
    <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
      <automator-button
        class="fa-fast-backward"
        @click="rewind"
        v-tooltip="'Rewind Automator to the first command'"
      />
      <automator-button
        :class="playPauseClass"
        @click="play"
        v-tooltip="playTooltip"
      />
      <automator-button
        class="fa-stop"
        @click="stop"
        v-tooltip="'Stop Automator and reset position'"
      />
      <automator-button
        class="fa-step-forward"
        @click="step"
        v-tooltip="'Step forward one line'"
      />
      <automator-button
        class="fa-sync-alt"
        :class="{ 'c-automator__button--active' : repeatOn }"
        @click="repeat"
        v-tooltip="'Restart script automatically when it completes'"
      />
      <automator-button
        class="fa-reply"
        :class="{ 'c-automator__button--active' : forceRestartOn }"
        @click="restart"
        v-tooltip="'Restart script when finishing or restarting a Reality'"
      />
      <automator-button
        class="fa-indent"
        :class="{ 'c-automator__button--active' : followExecution }"
        @click="follow"
        v-tooltip="'Scroll Automator to follow current line'"
      />
    </div>`
});
