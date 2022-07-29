<script>
import { GameProgress, ProgressChecker } from "../../../../javascripts/core/storage/progress-checker";

import CatchupGroup from "@/components/modals/catchup/CatchupGroup";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CatchupModal",
  components: {
    CatchupGroup,
    PrimaryButton,
  },
  props: {
    diff: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      startTime: 0,
      remainingTime: 0,
    };
  },
  computed: {
    progressStage: () => ProgressChecker.getProgressStage(player).id,
    suggestedResource() {
      return GameProgress(this.progressStage).suggestedResource;
    },
    timeString() {
      // If diff is zero, that means we opened it up via the button and don't need the text for last opening
      if (!this.diff) return null;
      return `It has been ${TimeSpan.fromMilliseconds(this.diff).toStringShort()} since you last loaded up the game.`;
    },
    titleText() {
      return this.diff ? "Content Catch-up" : "Content Summary";
    }
  },
  created() {
    // This is a particularly important modal which cannot be opened again, so we make the close button unclickable
    // for the first few seconds to reduce the chance of a player instinctively clicking through and not reading it.
    // It can still be closed preemptively with escape, but that should be likely significantly less likely to happen
    this.startTime = Date.now();
  },
  methods: {
    update() {
      const timeSinceOpen = Date.now() - this.startTime;
      // Track remainingTime in seconds, starting at 5 and counting down to 0
      this.remainingTime = Math.max(Math.floor(5 - timeSinceOpen / 1000), 0);
    },
    stageName(stage) {
      return GameProgress(stage).name;
    }
  }
};
</script>

<template>
  <div class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      {{ titleText }}
    </div>
    {{ timeString }}
    If you need a refresher, here is a quick summary of all the content you have unlocked so far from the beginning of
    the game, separated into different stages of progression. These are only very brief descriptions; you may want to
    check the related How To Play entries if you want more detailed information.
    <div
      class="l-catchup-group-container"
      :style="{ 'height' : `${Math.clamp(5 * progressStage, 15, 40)}rem` }"
    >
      <CatchupGroup
        v-for="group of progressStage"
        :key="group"
        :group="group"
        :name="stageName(group)"
      />
    </div>
    <span class="c-suggestion-text">
      Based on your current progression, it will probably be useful to try to increase your {{ suggestedResource }}.
    </span>
    <div class="l-confirm-padding">
      <PrimaryButton
        v-if="remainingTime === 0"
        @click="emitClose"
      >
        Confirm
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="false"
      >
        Confirm ({{ formatInt(remainingTime) }})
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-catchup-group-container {
  text-align: left;
  width: 100%;
  margin: 1rem;
  padding: 2rem;
  overflow-y: scroll;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.4rem);
}

.l-confirm-padding {
  margin: 1rem;
}

.c-suggestion-text {
  font-size: 1.6rem;
  font-weight: bold;
}
</style>
