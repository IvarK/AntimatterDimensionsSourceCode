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
    buttons() {
      return this.progress.buttons || [];
    }
  },
  methods: {
    // The code is less redundant if we check the condition here instead of within the button object itself
    canBeClicked(button) {
      return button.condition(this.progress.current, this.progress.max);
    },
    buttonClicked(button) {
      if (!this.canBeClicked(button)) return;
      button.click();
    },
    buttonClass(button) {
      return {
        "o-primary-btn--width-medium": true,
        "o-primary-btn--disabled": !this.canBeClicked(button),
      };
    }
  },
  template: `
    <div class="l-modal-overlay c-modal-overlay" style="z-index: 8">
      <div class="l-modal-progress-bar c-modal">
        <div class="c-modal-progress-bar__label">
          {{ progress.label }}
        </div>
        <div>
          {{ progress.info() }}
        </div>
        <br>
        <div>
          {{ progress.progressName }}: {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }}
        </div>
        <div>
          Remaining: {{ remaining }} seconds
        </div>
        <div class="l-modal-progress-bar__hbox">
          <div class="l-modal-progress-bar__bg c-modal-progress-bar__bg">
            <div class="l-modal-progress-bar__fg c-modal-progress-bar__fg" :style="foregroundStyle" />
          </div>
        </div>
        <br>
        <div class="l-modal-progress-bar__buttons">
          <primary-button v-for="button in buttons"
            :class="buttonClass(button)"
            :key="button.text"
            @click="buttonClicked(button)"
          >
            {{ button.text }}
          </primary-button>
        </div>
      </div>
    </div>`,
});
