<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
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
  <PrimaryButton
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ displayText }}
  </PrimaryButton>
</template>

