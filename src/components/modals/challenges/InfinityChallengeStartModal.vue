<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "InfinityChallengeStartModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    challenge() {
      return InfinityChallenge(this.modal.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      return `You will Big Crunch (if possible) and start a new Infinity within the Challenge, with all the
        Challenge-specific restrictions and modifiers active.
        To complete the Challenge${this.challengeIsCompleted ? "" : " and gain its reward"},
        you must reach the Challenge goal of
        ${format(InfinityChallenge(this.modal.id).goal)} Antimatter.
        You do not start with any Dimensions or Galaxies, regardless of upgrades.`;
    },
    entranceLabel() {
      return `You are about to enter Infinity Challenge ${this.modal.id}`;
    },
    reward() {
      let rewardDescription = this.challenge._config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return `The reward for completing this challenge is: ${rewardDescription}`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `Inside this Infinity Challenge, ${conditionOfChallenge}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ condition }}
    </div>
    <div
      v-if="!challengeIsCompleted"
      class="c-modal-message__text"
    >
      <br>
      {{ reward }}
    </div>
    <template #confirm-text>
      Begin
    </template>
  </ModalWrapperChoice>
</template>
