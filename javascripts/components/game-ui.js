"use strict";

Vue.component("game-ui", {
  computed: {
    view() {
      return this.$viewModel;
    },
    uiLayout() {
      return this.view.newUI ? "new-ui" : "old-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      const config = subtab.config;
      if (this.view.newUI && config.newUIComponent !== undefined) {
        return config.newUIComponent;
      }
      return config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    }
  },
  template: `
    <div v-if="view.initialized" id="ui" class="c-game-ui">
      <component :is="uiLayout">
        <component :is="page" />
      </component>
      <modal-popup v-if="view.modal.current" />
      <modal-glyph-selection v-if="view.modal.glyphSelection" />
      <modal-progress-bar v-if="view.modal.progressBar" />
      <link v-if="view.theme !== 'Normal'" type="text/css" rel="stylesheet" :href="themeCss">
      <div id="notification-container" class="l-notification-container" />
      <help-me />
    </div>
  `
});
