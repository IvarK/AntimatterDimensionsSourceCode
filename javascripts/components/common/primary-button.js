"use strict";

Vue.component("primary-button", {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": !this.enabled,
      };
    }
  },
  template: `
    <button :class="classObject" v-on="$listeners">
      <slot/>
    </button>`
});

Vue.component("unstyled-button", {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <button v-on="$listeners">
      <slot/>
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
  props: {
    on: String,
    off: String,
    value: Boolean
  },
  template:
    `<primary-button v-bind="$attrs" @click="emitInput(!value)">{{ value ? on : off }}</primary-button>`
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
    `<primary-button v-bind="$attrs" @click="emitInput(!value)">{{ displayText }}</primary-button>`
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
  template:
    `<unstyled-button v-bind="$attrs" @click="emitInput((value + 1) % labels.length)">{{ displayText }}</unstyled-button>`
});

Vue.component("primary-button-cycle", {
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
    `<primary-button v-bind="$attrs" @click="emitInput((value + 1) % labels.length)">{{ displayText }}</primary-button>`
});