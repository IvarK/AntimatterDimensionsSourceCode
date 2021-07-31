"use strict";

Vue.component("automator-controls", {
  data() {
    return {
      isRunning: false,
      isPaused: false,
      repeatOn: false,
      forceRestartOn: false,
    };
  },
  computed: {
    currentScriptID() {
      return this.$viewModel.tabs.reality.automator.editorScriptID;
    },
    playTooltip() {
      if (this.isRunning) return undefined;
      if (this.isPaused) return "Resume automator execution";
      return "Start automator";
    },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.repeatOn = AutomatorBackend.state.repeat;
      this.forceRestartOn = AutomatorBackend.state.forceRestart;
    },
    rewind: () => AutomatorBackend.restart(),
    play() {
      if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) this.$emit("automatorplay");
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AUTOMATOR_MODE.RUN;
      else AutomatorBackend.start(this.currentScriptID);
    },
    pause: () => AutomatorBackend.pause(),
    stop: () => AutomatorBackend.stop(),
    step() {
      if (AutomatorBackend.isOn) AutomatorBackend.mode = AUTOMATOR_MODE.SINGLE_STEP;
      else AutomatorBackend.start(this.currentScriptID, AUTOMATOR_MODE.SINGLE_STEP);
    },
    repeat: () => AutomatorBackend.toggleRepeat(),
    restart: () => AutomatorBackend.toggleForceRestart(),
  },
  template: `
    <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
      <automator-button class="fa-fast-backward"
        @click="rewind"
        v-tooltip="'Rewind automator to the first command'"
      />
      <automator-button
        class="fa-play"
        :class="{ 'c-automator__button-play--active' : isRunning }"
        @click="play"
        v-tooltip="playTooltip"
      />
      <automator-button class="fa-pause"
        :class="{ 'c-automator__button--active': isPaused }"
        @click="pause"
        v-tooltip="'Pause automator on current command'"
      />
      <automator-button class="fa-stop"
        @click="stop"
        v-tooltip="'Stop automator and reset position'"
      />
      <automator-button class="fa-step-forward"
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
        v-tooltip="'Restart script when undoing/replacing glyphs or finishing/restarting a Reality'"
      />
    </div>`
});
