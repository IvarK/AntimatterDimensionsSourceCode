<script>
export default {
  name: "PlusMinusButton",
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    iconClass() {
      return `fas fa-${this.type}`;
    }
  }
};
</script>

<template>
  <div
    v-repeating-click="{ delay: 500 }"
    class="c-ad-slider__button"
    @firstclick="$emit('click')"
    @repeatclick="$emit('click')"
    style="width: 1.4rem; height: 1.4rem; flex-grow: 1; flex-shrink: 0;"
  >
    <div :class="iconClass" />
  </div>
</template>

