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
  >
    <div :class="iconClass" />
  </div>
</template>

<style scoped>
.c-ad-slider__button {
  width: 1.4rem;
  height: 1.4rem;
  flex-grow: 1;
  flex-shrink: 0;
}
</style>