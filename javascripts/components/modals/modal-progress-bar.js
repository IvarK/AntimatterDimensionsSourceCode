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
  },
  methods: {
  },
  template: `
  <div class="l-modal-overlay c-modal-overlay">
    <div class="l-modal-progress-bar c-modal">
      <div class="c-modal-progress-bar__label"> {{progress.label}} </div>
      <div class="l-modal-progress-bar__hbox">
        <span>0</span>
        <div class="l-modal-progress-bar__bg c-modal-progress-bar__bg">
          <div class="l-modal-progress-bar__fg c-modal-progress-bar__fg" :style="foregroundStyle"/>
        </div>
        <span>{{progress.max}}</span>
      </div>
    </div>
  </div>`,
});
