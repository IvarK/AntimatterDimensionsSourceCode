<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EternityChallengeStartModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    challenge() {
      return EternityChallenge(this.modal.id);
    },
    challengeIsCompleted() {
      return this.challenge.isFullyCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      return `You will Eternity, if possible, and will start a new Eternity within the challenge,
        with all the restrictions and modifiers that entails. Upon reaching the goal
        (${format(this.challenge.currentGoal)} Infinity Points for this challenge), you
        can complete the Eternity Challenge${this.challengeIsCompleted ? "" : ", which grants you the reward"}. You
        can complete Eternity Challenges up to ${formatInt(5)} times, with increasing goals, to get higher bonuses.`;
    },
    entranceLabel() {
      return `You are about to enter Eternity Challenge ${this.modal.id}`;
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
      return `Inside this Eternity Challenge, the condition is: ${conditionOfChallenge}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start(true);
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
