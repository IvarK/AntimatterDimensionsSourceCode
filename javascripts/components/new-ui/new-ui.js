"use strict";

Vue.component("new-ui", {
  data() {
    return {
      view: ui.view,
      showCrunch: false,
      breakInfinity: false,
      realities: 0
    };
  },
  methods: {
    update() {
      this.showCrunch = !player.break && player.antimatter.gte(Number.MAX_VALUE);
      this.breakInfinity = player.break;
      this.realities = player.realities;
    }
  },
  template:
  `<div id="page">
    <link rel="stylesheet" type="text/css" href="stylesheets/new-ui-styles.css">
    <sidebar />
    <div class="game-container">
      <news-ticker />
      <div class="tab-container">
        <div class="l-reset-buttons-container" v-if="breakInfinity">
          <game-header-eternity-button/>
          <reality-button v-if="realities > 0" class="l-reset-buttons-container__reality-button"/>
          <game-header-big-crunch-button/>
        </div>
        <div v-if="showCrunch">
          <h3>The world has collapsed due to excess antimatter.</h3>
          <button class="btn-big-crunch" onclick="bigCrunchResetRequest()">Big Crunch</button>
        </div>
        <slot v-else />
      </div>
    </div>
  </div>`
});
