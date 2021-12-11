Vue.component("button-cycle", {
  props: {
    text: String,
    labels: Array,
    value: Number
  },
  computed: {
    displayText() {
      return `${this.text} ${this.labels[this.value]}`.trim();
    }
  },
  template: `
    <button
      v-bind="$attrs" @click="emitInput((value + 1) % labels.length)">{{ displayText }}
    </button>`
});
