"use strict";

Vue.component("modal-progress-bar", {
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remaining() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      return formatFloat(
        TimeSpan.fromMilliseconds(timeSinceStart / (this.progress.current / this.progress.max)).totalSeconds -
        TimeSpan.fromMilliseconds(timeSinceStart).totalSeconds
        , 1);
    },
    button() {
      return this.progress.button;
    }
  },
  methods: {
  },
  template: `
    <div class="l-modal-overlay c-modal-overlay" style="z-index: 8">
      <div class="l-modal-progress-bar c-modal">
        <div class="c-modal-progress-bar__label">
          {{ progress.label }}
        </div>
        <div>
          Ticks: {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }}
        </div>
        <div>
          Remaining: {{ remaining }} seconds
        </div>
        <div class="l-modal-progress-bar__hbox">
          <div class="l-modal-progress-bar__bg c-modal-progress-bar__bg">
            <div class="l-modal-progress-bar__fg c-modal-progress-bar__fg" :style="foregroundStyle" />
          </div>
        </div>
        <primary-button v-if="button" class="o-primary-btn--width-medium" @click="button.click()">{{ button.text }}</button>
      </div>
    </div>`,
});
