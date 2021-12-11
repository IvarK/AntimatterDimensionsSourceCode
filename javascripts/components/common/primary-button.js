import PrimaryButton from "@/components/PrimaryButton";

Vue.component("button-on-off", {
  props: {
    text: String,
    value: Boolean
  },
  computed: {
    displayText() {
      return `${this.text} ${this.value ? "ON" : "OFF"}`.trim();
    }
  },
  template:
    `<button v-bind="$attrs" @click="emitInput(!value)">{{ displayText }}</button>`
});

Vue.component("primary-button-on-off", {
  components: {
    PrimaryButton
  },
  props: {
    text: String,
    value: Boolean
  },
  computed: {
    displayText() {
      return `${this.text} ${this.value ? "ON" : "OFF"}`.trim();
    }
  },
  template:
    `<PrimaryButton v-bind="$attrs" @click="emitInput(!value)">{{ displayText }}</PrimaryButton>`
});

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

Vue.component("primary-button-cycle", {
  components: {
    PrimaryButton
  },
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
  template:
    `<PrimaryButton v-bind="$attrs" @click="emitInput((value + 1) % labels.length)">{{ displayText }}</PrimaryButton>`
});
