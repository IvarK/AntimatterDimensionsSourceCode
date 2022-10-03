<script>
import BigCrunchButton from "../BigCrunchButton";
import GameHeader from "../GameHeader";
import NewsTicker from "../NewsTicker";


import ClassicSubtabBar from "./ClassicSubtabBar";
import ClassicTabBar from "./ClassicTabBar";
import EternityPointsHeader from "@/components/EternityPointsHeader";
import InfinityPointsHeader from "@/components/InfinityPointsHeader";

export default {
  name: "ClassicUi",
  components: {
    GameHeader,
    ClassicSubtabBar,
    ClassicTabBar,
    NewsTicker,
    InfinityPointsHeader,
    EternityPointsHeader,
    BigCrunchButton
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
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes > 1;
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
    <BigCrunchButton />
    <template v-if="!bigCrunch">
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
      <div class="l-old-ui__page">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
