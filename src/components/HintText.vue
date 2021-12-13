<script>
export default {
  name: "HintText",
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
