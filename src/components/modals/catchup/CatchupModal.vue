<script>
import { ProgressChecker } from "../../../../javascripts/core/storage/progress-checker";

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
    progressStage: () => ProgressChecker.getProgressStage(player),
    suggestedResource() {
      return ProgressChecker.getSuggestedResource(this.progressStage);
    },
    timeString() {
      return TimeSpan.fromMilliseconds(this.diff).toStringShort();
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
      this.remainingTime = Math.clampMin(Math.floor((this.startTime - Date.now() + 5000) / 1000), 0);
    },
    stageName(stage) {
      return ProgressChecker.getStageName(stage);
    }
  }
};
</script>

<template>
  <div class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      Content Catch-up
    </div>
    It has been {{ timeString }} since you last opened the game.
    If you need a refresher, here is a quick summary of all the content you have unlocked so far from the beginning of
    the game, separated into different stages of progression. These are only very brief descriptions; you may want to
    check the related How To Play entries if you want more detailed information.
    <div class="l-catchup-group-container">
      <CatchupGroup
        v-for="group of progressStage"
        :key="group"
        :group="group"
        :name="stageName(group)"
      />
    </div>
    Based on your current progression, it will probably be useful to try to increase your {{ suggestedResource }}.
    <br>
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
</template>

<style scoped>
.l-catchup-group-container {
  text-align: left;
  width: 100%;
  margin: 1rem;
  padding: 2rem;
  overflow-y: scroll;
  height: 50rem;
  border: 0.1rem solid var(--color-text);
}
</style>
