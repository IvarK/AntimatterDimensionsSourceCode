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
  display: flex;
  width: 1.6rem;
  height: 1.6rem;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: 0.1rem solid var(--color-reality-light);
  border-radius: var(--var-border-radius, 50%);
  transition-duration: 0.2s;
  cursor: pointer;
}

.c-ad-slider__button:hover {
  color: black;
  background-color: var(--color-reality-light);
}

.l-ad-slider--disabled .c-ad-slider__button {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
