"use strict";

Vue.component("new-ui", {
  data() {
    return {
      view: ui.view,
      bigCrunch: false,
      smallCrunch: false,
      breakInfinity: false,
      realities: 0,
      antimatter: new Decimal(0),
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    }
  },
  methods: {
    update() {
      this.antimatter.copyFrom(player.antimatter);
      this.breakInfinity = player.break;
      this.realities = player.realities;
      const canCrunch = player.antimatter.gte(Player.infinityGoal);
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      if (!canCrunch || Tabs.current !== Tab.dimensions || (player.break && challenge === undefined)) {
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
      <news-ticker v-if="news"/>
      <div v-if="bigCrunch" class="l-new-ui-big-crunch__container">
        <h3>The world has collapsed due to excess antimatter.</h3>
        <button class="btn-big-crunch" onclick="bigCrunchResetRequest()">Big Crunch</button>
      </div>
      <div class="tab-container" v-else>
        <div class="l-reset-buttons-container" v-if="breakInfinity">
          <game-header-eternity-button/>
          <game-header-new-dim-button/>
          <game-header-big-crunch-button/>
        </div>
        <game-header-amounts-line />
        <div class="l-game-header__antimatter-container">
          <p>You have <span class="c-game-header__antimatter">{{format(antimatter, 2, 1)}}</span> antimatter.</p>
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
