<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    showThisHintText() {
      // Accessing the player object in this computed is intentional for the sake of performance.
      // Always access the player object in update method and store required stuff in component data.
      return this.$viewModel.shiftDown || player.options.showHintText[this.type];
    }
  },
};
</script>

<template>
  <div
    v-show="showThisHintText"
    class="o-hint-text l-hint-text"
  >
    <slot />
  </div>
</template>

<style scoped>
.o-hint-text {
  font-size: 1.55rem;
  color: white;
  text-shadow:
    -0.1rem -0.1rem 0 black,
    -0.1rem -0.1rem 0 black,
    0.1rem -0.1rem 0 black,
    0.1rem -0.1rem 0 black,
    -0.1rem 0.1rem 0 black,
    -0.1rem 0.1rem 0 black,
    0.1rem 0.1rem 0 black,
    0.1rem 0.1rem 0 black;
  pointer-events: none;
}

.l-hint-text {
  position: absolute;
  top: -1.6rem;
  left: 0;
}
</style>
