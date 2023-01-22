<script>
import BigCrunchButton from "../BigCrunchButton";
import HeaderBlackHole from "../HeaderBlackHole";
import HeaderChallengeDisplay from "../HeaderChallengeDisplay";
import HeaderChallengeEffects from "../HeaderChallengeEffects";
import HeaderPrestigeGroup from "../HeaderPrestigeGroup";
import NewsTicker from "../NewsTicker";

import BackgroundAnimations from "@/components/BackgroundAnimations";
import GameUiComponentFixed from "@/components/GameUiComponentFixed";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";

import { S12Windows } from "./windows";


export default {
  name: "S12Ui",
  components: {
    BigCrunchButton,
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    NewsTicker,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,

    GameUiComponentFixed,
    BackgroundAnimations,
  },
  data() {
    return {
      bigCrunch: false,
      hasReality: false,
      newGameKey: "",
      S12Windows,
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    },
    topMargin() {
      return this.$viewModel.news ? "" : "margin-top: 3.9rem";
    },
    isOldUi() {
      return !this.$viewModel.newUI;
    },
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes > 1;
      this.hasReality = PlayerProgress.realityUnlocked();
      // This only exists to force a key-swap after pressing the button to start a new game; the news ticker can break
      // if it isn't redrawn
      this.newGameKey = Pelle.isDoomed;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) manualBigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  },
};
</script>

<template>
  <div
    v-if="!S12Windows.isMinimised"
    id="page"
    class="c-s12-window--outer"
  >
    <link
      rel="stylesheet"
      type="text/css"
      :href="isOldUi ? 'stylesheets/old-ui.css' : 'stylesheets/new-ui-styles.css'"
    >
    <div
      :key="newGameKey"
      class="game-container c-s12-window__inner"
      :class="isOldUi ? 'c-old-ui l-old-ui' : ''"
      :style="topMargin"
    >
      <GameUiComponentFixed />
      <BackgroundAnimations />
      <div class="c-s12-window__content-container">
        <NewsTicker
          v-if="news"
        />
        <BigCrunchButton />
        <div
          v-if="!bigCrunch"
          class="tab-container"
        >
          <HeaderPrestigeGroup />
          <div class="information-header">
            <HeaderChallengeDisplay />
            <HeaderChallengeEffects />
            <GameSpeedDisplay v-if="hasReality" />
            <br v-if="hasReality">
            <HeaderBlackHole />
          </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#page {
  width: 100%;
  /* stylelint-disable-next-line unit-allowed-list */
  height: calc(100vh - var(--s12-taskbar-height));
  position: absolute;
  top: 0;
  background-color: rgba(255, 255, 255, 0.5);
  background-image: repeating-linear-gradient(
    50deg,
    rgba(170, 170, 170, 0.1), rgba(170, 170, 170, 0.1) 2rem,
    rgba(255, 255, 255, 0.1) 4rem, rgba(255, 255, 255, 0.1) 5rem,
    rgba(170, 170, 170, 0.1) 6rem, rgba(170, 170, 170, 0.1) 8rem
  ),
  linear-gradient(
    -50deg,
    rgba(60, 60, 60, 0.3),
    transparent 20%,
    transparent 80%,
    rgba(60, 60, 60, 0.3)
  );
  margin-top: 0;
  padding: 2.3rem 0.7rem 0.7rem 0.7rem;

  -webkit-backdrop-filter: blur(1rem);

  backdrop-filter: blur(1rem);
}

.c-s12-window__inner {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
  background-color: #111014;
  border: 0.15rem solid var(--s12-border-color);
  border-radius: 0.15rem;
  box-shadow: 0 0 0.4rem 0.2rem rgba(255, 255, 255, 0.5);
}

.c-old-ui.c-s12-window__inner {
  background-color: white;
}

.c-s12-window__content-container {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  position: relative;

  scrollbar-gutter: stable both-edges;
}
</style>
