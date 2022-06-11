<script>
import { ProgressChecker } from "../../../../javascripts/core/storage/progress-checker";

import CatchupGroup from "@/components/modals/catchup/CatchupGroup";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "CatchupModal",
  components: {
    CatchupGroup,
    ModalWrapper,
  },
  computed: {
    progressStage: () => ProgressChecker.getProgressStage(player),
    suggestedResource() {
      return ProgressChecker.getSuggestedResource(this.progressStage);
    }
  },
  methods: {
    stageName(stage) {
      return ProgressChecker.getStageName(stage);
    }
  }
};
</script>

<template>
  <ModalWrapper class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      Content Catch-up
    </div>
    It has been a long time since you last opened the game.
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
  </ModalWrapper>
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
