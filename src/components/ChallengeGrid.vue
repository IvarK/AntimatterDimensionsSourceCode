<script>
import ChallengeGridCell from "@/components/ChallengeGridCell";

export default {
  name: "ChallengeGrid",
  components: {
    ChallengeGridCell
  },
  props: {
    count: {
      type: Number,
      required: true
    },
    isChallengeVisible: {
      type: Function,
      required: false,
      default: () => true
    }
  }
};
</script>

<template>
  <div class="l-challenge-grid">
    <ChallengeGridCell
      v-for="id in count"
      :id="id"
      :key="id"
      :is-challenge-visible="isChallengeVisible"
    >
      <slot :challengeId="id" />
    </ChallengeGridCell>
  </div>
</template>

<style scoped>

</style>
