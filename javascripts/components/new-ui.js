"use strict";

Vue.component("new-ui", {
  data() {
    return {
      view: ui.view,
      showCrunch: false,
      showTicker: true
    }
  },
  methods: {
    update() {
      this.showCrunch = !player.break && player.money.gte(Number.MAX_VALUE);
      this.showTicker = !player.options.newsHidden;
    }
  },
  template:
  `<div id="page">
    <sidebar></sidebar>
    <div class="game-container">
      <div class="quote" v-show="showTicker"><div id="newNews">.</div></div>
      <div class="tab-container">
        <component :is="$viewModel.page" v-if="!showCrunch"></component>
        <div v-else>
          <h3>The world has collapsed due to excess antimatter.</h3>
          <button class="btn-big-crunch" onclick="bigCrunchReset()">Big Crunch</button>
        </div>
      </div>
    </div>
    <div v-if="view.newUI" id="notification-container" class="l-notification-container"></div>
  </div>`
})