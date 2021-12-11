<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
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
  <PrimaryButton
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ value ? on : off }}
  </PrimaryButton>
</template>

