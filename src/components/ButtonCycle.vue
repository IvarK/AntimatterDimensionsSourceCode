<script>
export default {
  name: "ButtonCycle",
  props: {
    text: {
      type: String,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
  },
  computed: {
    displayText() {
      return `${this.text} ${this.labels[this.value]}`.trim();
    }
  },
  methods: {
    handleClick() {
      this.emitInput((this.value + 1) % this.labels.length);
    }
  }
};
</script>

<template>
  <button
    v-bind="$attrs"
    @click="handleClick"
  >
    {{ displayText }}
  </button>
</template>

