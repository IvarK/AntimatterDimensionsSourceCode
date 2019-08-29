"use strict";

Vue.component("new-ui", {
  data() {
    return {
      view: ui.view,
      bigCrunch: false,
      smallCrunch: false,
      breakInfinity: false,
      realities: 0
    };
  },
  methods: {
    update() {
      this.breakInfinity = player.break;
      this.realities = player.realities;
      const canCrunch = player.antimatter.gte(Player.infinityGoal);
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      if (!canCrunch || Tabs.current.name !== "Dimensions" || (player.break && challenge === undefined)) {
        this.bigCrunch = false;
        this.smallCrunch = false;
        return;
      }
      this.smallCrunch = true;
      const endOfChallenge = challenge !== undefined && !player.options.retryChallenge;
      this.bigCrunch = endOfChallenge || Time.thisInfinityRealTime.totalMinutes > 1;
    }
  },
  template:
  `<div id="page">
    <link rel="stylesheet" type="text/css" href="stylesheets/new-ui-styles.css">
    <sidebar />
    <div class="game-container">
      <news-ticker />
      <div v-if="bigCrunch" class="l-new-ui-big-crunch__container">
        <h3>The world has collapsed due to excess antimatter.</h3>
        <button class="btn-big-crunch" onclick="bigCrunchResetRequest()">Big Crunch</button>
      </div>
      <div class="tab-container" v-else>
        <div class="l-reset-buttons-container" v-if="breakInfinity">
          <game-header-eternity-button/>
          <game-header-new-dim-button/>
          <reality-button v-if="realities > 0" class="l-reset-buttons-container__reality-button"/>
          <game-header-big-crunch-button/>
        </div>
        <button 
        class="btn-big-crunch btn-big-crunch--small"
        onclick="bigCrunchResetRequest()"
        v-if="smallCrunch && !bigCrunch">Big Crunch</button>
        <slot />
      </div>
    </div>
  </div>`
});
