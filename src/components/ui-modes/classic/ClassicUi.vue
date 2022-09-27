<script>
import GameHeader from "../GameHeader";
import NewsTicker from "../NewsTicker";

import ClassicBigCrunchButton from "./ClassicBigCrunchButton";
import ClassicSubtabBar from "./ClassicSubtabBar";
import ClassicTabBar from "./ClassicTabBar";
import EternityPointsHeader from "@/components/EternityPointsHeader";
import InfinityPointsHeader from "@/components/InfinityPointsHeader";

export default {
  name: "ClassicUi",
  components: {
    GameHeader,
    ClassicBigCrunchButton,
    ClassicSubtabBar,
    ClassicTabBar,
    NewsTicker,
    InfinityPointsHeader,
    EternityPointsHeader
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
};
</script>

<template>
  <div
    id="container"
    class="container c-old-ui l-old-ui"
  >
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/old-ui.css"
    >
    <template v-if="bigCrunch">
      <ClassicBigCrunchButton class="l-old-ui__big-crunch-btn" />
      <div class="o-emptiness">
        The world has collapsed due to excess of antimatter.
      </div>
    </template>
    <template v-else>
      <NewsTicker
        v-if="news"
        class="l-old-ui__news-bar"
      />
      <GameHeader class="l-old-ui__header" />
      <ClassicTabBar />
      <component
        :is="tab.config.before"
        v-if="tab.config.before"
      />
      <ClassicSubtabBar />
      <ClassicBigCrunchButton
        v-show="smallCrunch"
        class="l-old-ui__big-crunch-btn l-old-ui__big-crunch-btn--overlay"
      />
      <div class="l-old-ui__page">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
