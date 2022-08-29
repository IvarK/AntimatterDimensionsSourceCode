<script>
export default {
  name: "ToggleButton",
  props: {
    label: {
      type: String,
      required: false,
      default: ""
    },
    on: {
      type: String,
      required: false,
      default: "ON"
    },
    off: {
      type: String,
      required: false,
      default: "OFF"
    },
    value: {
      type: Boolean,
      required: true
    },
    tooltipClass: {
      type: String,
      required: false,
      default: ""
    },
    tooltipContent: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    displayText() {
      return `${this.label} ${this.value ? this.on : this.off}`.trim();
    }
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ displayText }}
    <div
      v-if="tooltipClass"
      :class="tooltipClass"
    >
      {{ tooltipContent }}
    </div>
  </button>
</template>

