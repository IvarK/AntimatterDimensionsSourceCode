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
  computed: {
    outerStyle() {
      return {
        display: "inline-block !important",
        width: this.size,
        height: this.size,
        position: "relative !important",
        "border-radius": "50% !important",
        border: "1px solid " + this.color + " !important",
      };
    },
    horizStyle() {
      return this.hvStyle(0.7, 0.2);
    },
    vertStyle() {
      return this.hvStyle(0.2, 0.7);
    },
  },
  methods: {
    hvStyle(rx, ry) {
      const szx = this.findGoodSizes(rx);
      const szy = this.findGoodSizes(ry);
      return {
        display: "block !important",
        position: "absolute !important",
        width: szx[1],
        height: szy[1],
        left: szx[0],
        top: szy[0],
        background: this.color,
       };
    },
    // Given a desired width or height, this finds a pixel-perfect value for the
    // dimension (width or height) and offset (left or top)
    findGoodSizes(x) {
      const edgePixels = Math.round(this.computedSize * (1 - x) / 2);
      const midPixels = this.computedSize - edgePixels * 2;
      return [
        (edgePixels / this.computedSize * 100).toFixed(2) + "%",
        (midPixels / this.computedSize * 100).toFixed(2) + "%"
      ];
    },
  },
  template: `
  <div :style="outerStyle"
       v-repeating-click="{ delay: 500 }"
       @firstclick="$emit('click')"
       @repeatclick="$emit('click')">
    <div :style="horizStyle" />
    <div v-if="type==='plus'" :style="vertStyle" />
  </div>`,
  mounted() {
    this.color = getComputedStyle(this.$el).color;
    this.computedSize = this.$el.offsetWidth;
  }
});
