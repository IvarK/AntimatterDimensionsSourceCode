Vue.component("hint-text", {
  computed: {
    isVisible: function() {
      return ui.view.shiftDown;
    }
  },
  template:
    `<div v-if="isVisible" class="o-hint-text l-hint-text"><slot /></div>`
});