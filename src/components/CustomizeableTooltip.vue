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
      type: String,
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
      :class=" {'c-tooltip-show': showTooltip, [tooltipType]: true } "
      :style="[tooltipContentStyle, positionStyle, { transform: tooltipTransform }]"
    >
      <slot name="tooltipContent" />
    </div>
    <div
      class="c-tooltip-arrow"
      :class=" {'c-tooltip-show': showTooltip, [tooltipType]: true } "
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

.c-tooltip-content,
.c-tooltip-arrow {
  visibility: hidden;
  opacity: 0;
  transition: 0.4s linear;
  transition-property: opacity, visibility;
  pointer-events: none;
}

.c-tooltip-content {
  content: attr(ach-tooltip);
  width: 16rem;
  position: absolute;
  z-index: 4;
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.2;
  color: #ffffff;
  background-color: hsla(0deg, 0%, 5%, 90%);
  border-radius: var(--var-border-radius, 0.3rem);
  padding: 0.7rem;
}

.c-tooltip-arrow {
  content: " ";
  width: 0;
  position: absolute;
  z-index: 4;
  font-size: 0;
  line-height: 0;
  border-top: 0.55rem solid transparent;
  border-right: 0.55rem solid transparent;
  border-bottom: 0.55rem solid transparent;
  border-left: 0.55rem solid transparent;
  transform: translate(-50%, -100%);
  transition-duration: 0.4s;
}

.c-tooltip--top.c-tooltip-content {
  margin-top: -0.5rem;
}

.c-tooltip--top.c-tooltip-arrow {
  border-top: 0.55rem solid hsla(0deg, 0%, 5%, 90%);
  border-bottom: 0;
}

.c-tooltip--bottom.c-tooltip-content {
  margin-bottom: -0.5rem;
}

.c-tooltip--bottom.c-tooltip-arrow {
  border-top: 0;
  border-bottom: 0.55rem solid hsla(0deg, 0%, 5%, 90%);
}

.c-tooltip--right.c-tooltip-content {
  margin-right: -0.5rem;
}

.c-tooltip--right.c-tooltip-arrow {
  border-right: 0.55rem solid hsla(0deg, 0%, 5%, 90%);
  border-left: 0;
}

.c-tooltip--left.c-tooltip-content {
  margin-left: -0.5rem;
}

.c-tooltip--left.c-tooltip-arrow {
  border-right: 0;
  border-left: 0.55rem solid hsla(0deg, 0%, 5%, 90%);
}

.c-tooltip-show {
  visibility: visible;
  opacity: 1;
}
</style>
