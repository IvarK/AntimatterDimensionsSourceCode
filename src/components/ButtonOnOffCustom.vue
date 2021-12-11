<script>
export default {
  props: {
    on: {
      type: String,
      required: true
    },
    off: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    },
  }
};
</script>

<template>
  <button
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ value ? on : off }}
  </button>
</template>

