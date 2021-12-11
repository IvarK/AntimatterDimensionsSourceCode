<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      color: "white",
      computedSize: 0,
    };
  },
  computed: {
    iconClass() {
      return `fas fa-${this.type}`;
    }
  },
  mounted() {
    this.color = getComputedStyle(this.$el).color;
    this.computedSize = this.$el.offsetWidth;
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

