Vue.component("hint-text", {
  props: {
    type: String
  },
  computed: {
    showThisHintText() {
      // Accessing the player object in this computed is intentional for the sake of performance.
      // Always access the player object in update method and store required stuff in component data.
      return player.options.showHintText[this.type];
    }
  },
  template:
    `<div v-show="$viewModel.shiftDown || showThisHintText" class="o-hint-text l-hint-text"><slot /></div>`
});
