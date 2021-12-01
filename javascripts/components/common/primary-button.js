import PrimaryButton from "@/components/PrimaryButton";

Vue.component("unstyled-button", {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <button v-on="$listeners">
      <slot />
    </button>`
});

Vue.component("button-on-off-custom", {
  props: {
    on: String,
    off: String,
    value: Boolean
  },
  template:
    `<unstyled-button v-bind="$attrs" @click="emitInput(!value)">{{ value ? on : off }}</unstyled-button>`
});

Vue.component("primary-button-on-off-custom", {
  components: {
    PrimaryButton
  },
  props: {
    on: String,
    off: String,
    value: Boolean
  },
  template:
    `<PrimaryButton v-bind="$attrs" @click="emitInput(!value)">{{ value ? on : off }}</PrimaryButton>`
});

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
    `<unstyled-button v-bind="$attrs" @click="emitInput(!value)">{{ displayText }}</unstyled-button>`
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
    <unstyled-button
      v-bind="$attrs" @click="emitInput((value + 1) % labels.length)">{{ displayText }}
    </unstyled-button>`
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
