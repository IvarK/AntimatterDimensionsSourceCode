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
    outerStyle() {
      return {
        height: "1.6rem",
        width: "1.6rem",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "font-size": "1rem",
        "border-radius": "50%",
        border: `0.1rem solid ${this.color}`,
      };
    },
    iconClass() {
      return this.type === "plus" ? "fas fa-plus" : "fas fa-minus";
    }
  },
  template: `
    <div
      :style="outerStyle"
      v-repeating-click="{ delay: 500 }"
      @firstclick="$emit('click')"
      @repeatclick="$emit('click')"
    >
      <div :class="iconClass" />
    </div>`
});
