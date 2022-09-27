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
      mainContent: null,
      isDarkTheme: false
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
    },
    // Manual light-dark differentiation instead of just slapping on a .s-base--dark .c-tooltip is needed
    // to minimise specificity to make the custom class specify more styles
    tooltipContentLightDarkClass() {
      return this.isDarkTheme ? "c-tooltip-content--dark" : "";
    },
    tooltipArrowLightDarkClass() {
      return this.isDarkTheme ? "c-tooltip-arrow--dark" : "";
    },
    tooltipInternalClass() {
      return {
        "c-tooltip-show": this.showTooltip,
        [this.tooltipType]: true
      };
    },
    tooltipContentClass() {
      return [
        this.tooltipInternalClass,
        this.tooltipClass,
        this.tooltipContentLightDarkClass
      ];
    },
    tooltipArrowClass() {
      return [
        this.tooltipInternalClass,
        this.tooltipArrowLightDarkClass
      ];
    }
  },
  methods: {
    update() {
      this.isDarkTheme = Theme.current().isDark();
    },
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
      :class="tooltipContentClass"
      :style="[tooltipContentStyle, positionStyle, { transform: tooltipTransform }]"
    >
      <slot name="tooltipContent" />
    </div>
    <div
      class="c-tooltip-arrow"
      :class="tooltipArrowClass"
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
