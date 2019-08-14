"use strict";

Vue.component("automator-docs", {
  data() {
    return {
      commandID: -1
    };
  },
  computed: {
    command() {
      return GameDatabase.reality.automator.commands[this.commandID];
    },
    fullScreen: {
      get() {
        return this.$viewModel.tabs.reality.automator.fullScreen;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.fullScreen = value;
      }
    },
    fullScreenIconClass() {
      return this.fullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt";
    }
  },
  methods: {
    changeCommand(event) {
      this.commandID = event;
    }
  },
  template: `
    <div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls" >
        <automator-button class="fa-long-arrow-alt-left" @click="commandID = -1"/>
        <automator-button
          :class="fullScreenIconClass"
          class="l-automator__button--corner"
          @click="fullScreen = !fullScreen"
        />
      </div>
      <div class="c-automator-docs l-automator-pane__content">
        <automator-docs-main-page
          v-if="command === undefined"
          @select="changeCommand"
        />
        <automator-man-page v-else :command="command" />
      </div>
    </div>
  `
});
