"use strict";

Vue.component("automator-docs", {
  data() {
    return {
      commandID: -1,
      isBlockAutomator: false
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
    },
    fullScreenTooltip() {
      return this.fullScreen ? "Exit full screen" : "Expand to full screen";
    }
  },
  methods: {
    changeCommand(event) {
      this.commandID = event;
    },
    update() {
      this.isBlockAutomator = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
    }
  },
  template: `
    <div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls" >
        <automator-button
          :class="{ 'visibility: false' : commandID !== -1 }"
          class="fa-long-arrow-alt-left"
          @click="commandID = -1"
          v-tooltip="'Return to command list'"
        />
        <automator-button
          :class="fullScreenIconClass"
          class="l-automator__button--corner"
          @click="fullScreen = !fullScreen"
          v-tooltip="fullScreenTooltip"
        />
      </div>
      <automator-blocks v-if="isBlockAutomator" />
      <div class="c-automator-docs l-automator-pane__content">
        <automator-docs-main-page
          v-if="command === undefined"
          @select="changeCommand"
        />
        <automator-man-page v-else :command="command" />
      </div>
    </div>`
});
