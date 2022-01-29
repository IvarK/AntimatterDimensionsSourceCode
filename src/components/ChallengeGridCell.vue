<script>
export default {
  name: "ChallengeGridCell",
  props: {
    id: {
      type: Number,
      required: true
    },
    isChallengeVisible: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    update() {
      this.isVisible = this.isChallengeVisible(this.id);
    }
  }
};
</script>

<template>
  <div
    v-show="isVisible"
    class="l-challenge-grid__cell"
  >
    <slot />
  </div>
</template>

<style scoped>

</style>
