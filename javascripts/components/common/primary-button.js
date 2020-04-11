"use strict";

Vue.component("primary-button", {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },
  template:
    `<button :class="classObject" v-on="$listeners">
      <slot/>
    </button>`,
  computed: {
    classObject() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": !this.enabled,
      };
    }
  }
});

Vue.component("primary-button-on-off-custom", {
  props: {
    on: String,
    off: String,
    value: Boolean
  },
  template:
    '<primary-button v-bind="$attrs" @click="emitInput(!value)">{{value ? on : off}}</primary-button>'
});

Vue.component("primary-button-on-off", {
  props: {
    text: String,
    value: Boolean
  },
  template:
    '<primary-button v-bind="$attrs" @click="emitInput(!value)">{{displayText}}</primary-button>',
  computed: {
    displayText() {
      return `${this.text} ${this.value ? "ON" : "OFF"}`.trim();
    }
  }
});