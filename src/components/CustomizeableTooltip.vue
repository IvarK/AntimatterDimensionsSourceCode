<script>
// This component was mainly created to solve the z-index problem on PelleRiftBar milestone hovering
// Because apparently making the z-index of PelleStrike change with its expanded/contracted state is bad.
// As such it may not be perfectly generalised. Changes should be made to generalise it more.
export default {
  name: "CustomizeableTooltip",
  props: {
    tooltipContentStyle: {
      type: Object,
      required: false,
      default: () => ({})
    },
    tooltipArrowStyle: {
      type: Object,
      required: false,
      default: () => ({})
    },
    left: {
      type: String,
      required: false,
      default: ""
    },
    top: {
      type: String,
      required: false,
      default: ""
    },
    right: {
      type: String,
      required: false,
      default: ""
    },
    bottom: {
      type: String,
      required: false,
      default: ""
    },
    contentClass: {
      type: [Object, String],
      required: false,
      default: ""
    },
    tooltipClass: {
      type: [Object, String],
      required: false,
      default: ""
    },
    mode: {
      type: String,
      required: false,
      default: "top"
    },
    show: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      hovering: false,
      mainContent: null
    };
  },
  computed: {
    positionStyle() {
      return {
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom
      };
    },
    tooltipType() {
      return `c-tooltip--${this.mode}`;
    },
    contentTransform() {
      const axis = this.mode === "top" || this.mode === "bottom" ? "X" : "Y";
      return `translate${axis}(${this.showNegativeSign(axis)}50%)`;
    },
    tooltipTransform() {
      switch (this.mode) {
        case "top":
          return `translate(${this.showNegativeSign("X")}50%, -100%)`;
        case "bottom":
          return `translate(${this.showNegativeSign("X")}50%, 100%)`;
        case "right":
          return `translate(100%, ${this.showNegativeSign("Y")}50%)`;
        case "left":
          return `translate(-100%, ${this.showNegativeSign("Y")}50%)`;
        default:
          return "";
      }
    },
    showTooltip() {
      return this.show || this.hovering;
    }
  },
  methods: {
    showNegativeSign(axis) {
      if (axis === "X") {
        return this.left ? "-" : "";
      }
      return this.top ? "-" : "";
    },
  }
};
</script>

<template>
  <div class="l-custom-tooltip">
    <div
      class="c-main-content"
      :class="contentClass"
      :style="{ ...positionStyle, transform: contentTransform }"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <slot name="mainContent" />
    </div>
    <div
      class="c-tooltip-content"
      :class="[{'c-tooltip-show': showTooltip, [tooltipType]: true }, tooltipClass]"
      :style="[tooltipContentStyle, positionStyle, { transform: tooltipTransform }]"
    >
      <slot name="tooltipContent" />
    </div>
    <div
      class="c-tooltip-arrow"
      :class="{'c-tooltip-show': showTooltip, [tooltipType]: true }"
      :style="[tooltipArrowStyle, positionStyle, { transform: tooltipTransform }]"
    />
  </div>
</template>

<style scoped>
.l-custom-tooltip {
  display: inline-block;
  position: static;
}

.c-main-content {
  position: absolute;
}

/* c-tooltip-content styles in styles.css to make way for custom class colour styling */
</style>
