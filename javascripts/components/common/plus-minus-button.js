"use strict";

Vue.component("plus-minus-button", {
  props: {
    type: {
      type: String,
      default: "plus",
    },
    size: String,
  },
  data() {
    return {
      color: "white",
      computedSize: 0,
    };
  },
  mounted() {
    this.color = getComputedStyle(this.$el).color;
    this.computedSize = this.$el.offsetWidth;
  },
  computed: {
    iconClass() {
      return `fas fa-${this.type}`;
    }
  },
  template: `
    <div
      class="c-ad-slider__button"
      v-repeating-click="{ delay: 500 }"
      @firstclick="$emit('click')"
      @repeatclick="$emit('click')"
    >
      <div :class="iconClass" />
    </div>`
});
