<script>
import HeaderChallengeDisplay from "../HeaderChallengeDisplay";
import HeaderChallengeEffects from "../HeaderChallengeEffects";
import HeaderGameSpeed from "../HeaderGameSpeed";
import HeaderPrestigeGroup from "../HeaderPrestigeGroup";
import NewsTicker from "../NewsTicker";


export default {
  name: "ModernUi",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    NewsTicker,
    HeaderGameSpeed,
    HeaderPrestigeGroup
  },
  data() {
    return {
      bigCrunch: false,
      smallCrunch: false,
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    },
    topMargin() {
      return this.$viewModel.news ? "" : "margin-top: 3.9rem";
    }
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      const reachedInfinityInMinute = Time.bestInfinityRealTime.totalMinutes <= 1;
      this.bigCrunch = crunchButtonVisible && !reachedInfinityInMinute;
      this.smallCrunch = crunchButtonVisible && reachedInfinityInMinute;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) manualBigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  },
};
</script>

<template>
  <div id="page">
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/new-ui-styles.css"
    >
    <div
      class="game-container"
      :style="topMargin"
    >
      <NewsTicker v-if="news" />
      <div
        v-if="bigCrunch"
        class="l-new-ui-big-crunch__container"
      >
        <h3>The world has collapsed due to excess antimatter.</h3>
        <button
          class="btn-big-crunch"
          @click="handleClick"
        >
          Big Crunch
        </button>
      </div>
      <div
        v-else
        class="tab-container"
      >
        <HeaderPrestigeGroup />
        <div class="information-header">
          <HeaderChallengeDisplay />
          <HeaderChallengeEffects />
          <HeaderGameSpeed />
        </div>
        <button
          v-if="smallCrunch && !bigCrunch"
          class="btn-big-crunch btn-big-crunch--small"
          onclick="manualBigCrunchResetRequest()"
        >
          Big Crunch
        </button>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
