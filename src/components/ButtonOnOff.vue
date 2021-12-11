<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    displayText() {
      return `${this.text} ${this.value ? "ON" : "OFF"}`.trim();
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
  </button>
</template>

