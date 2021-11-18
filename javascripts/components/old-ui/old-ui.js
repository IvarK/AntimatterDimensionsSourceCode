import "./old-ui-subtab-bar.js";
import "./old-ui-tab-bar.js";
import "./header/game-header.js";
import NewsTicker from "@/components/NewsTicker";
import FooterLinks from "@/components/FooterLinks";

Vue.component("old-ui", {
  components: {
    "big-crunch-button": {
      template: `<button class="o-tab-btn o-big-crunch-btn" onclick="bigCrunchResetRequest()">Big Crunch</button>`
    },
    NewsTicker,
    FooterLinks
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
      const crunchButtonVisible = !player.break && Player.canCrunch;
      const reachedInfinityInMinute = Time.bestInfinityRealTime.totalMinutes <= 1;
      this.bigCrunch = crunchButtonVisible && !reachedInfinityInMinute;
      this.smallCrunch = crunchButtonVisible && reachedInfinityInMinute;
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
        <NewsTicker class="l-old-ui__news-bar" v-if="news" />
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
        <FooterLinks class="l-old-ui__footer" />
      </template>
    </div>`
});
