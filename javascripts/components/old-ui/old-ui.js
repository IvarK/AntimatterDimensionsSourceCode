"use strict";

Vue.component("old-ui", {
  components: {
    "big-crunch-button": {
      template: `<button class="o-tab-btn o-big-crunch-btn" onclick="bigCrunchResetRequest()">Big Crunch</button>`
    }
  },
  data() {
    return {
      bigCrunch: false,
      smallCrunch: false
    };
  },
  computed: {
    tab: () => Tabs.current,
    news() {
      return this.$viewModel.news;
    }
  },
  methods: {
    update() {
      const inBrokenChallenge = Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(NormalChallenge.current?.id);
      if (!Player.canCrunch || inBrokenChallenge || (player.break && !Player.isInAntimatterChallenge)) {
        this.bigCrunch = false;
        this.smallCrunch = false;
        return;
      }
      this.smallCrunch = true;
      const endOfChallenge = Player.isInAntimatterChallenge && !player.options.retryChallenge;
      this.bigCrunch = endOfChallenge ||
        (Time.thisInfinity.totalMinutes > 1 && Time.bestInfinityRealTime.totalMinutes > 1);
    }
  },
  template: `
    <div id="container" class="container c-old-ui l-old-ui">
      <link rel="stylesheet" type="text/css" href="stylesheets/old-ui.css">
      <template v-if="bigCrunch">
        <big-crunch-button class="l-old-ui__big-crunch-btn" />
        <div class="o-emptiness">
          The world has collapsed on itself due to excess of antimatter.
        </div>
      </template>
      <template v-else>
        <news-ticker class="l-old-ui__news-bar" v-if="news" />
        <game-header class="l-old-ui__header" />
        <old-ui-tab-bar />
        <component v-if="tab.config.before" :is="tab.config.before" />
        <old-ui-subtab-bar />
        <big-crunch-button
          v-show="smallCrunch"
          class="l-old-ui__big-crunch-btn l-old-ui__big-crunch-btn--overlay"
        />
        <div class="l-old-ui-page l-old-ui__page">
          <slot />
        </div>
        <footer-links class="l-old-ui__footer" />
      </template>
    </div>`
});
