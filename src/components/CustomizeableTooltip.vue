<script>
// This component was mainly created to solve the z-index problem on PelleRiftBar milestone hovering
// Because apparently making the z-index of PelleStrike change with its expanded/contracted state is bad.
// As such it may not be perfectly generalised. Changes should be made to generalise it more.
export default {
  name: "CustomizeableTooltip",
  props: {
    tooltipContentStyle: {
      type: Object,
      required: true
    },
    tooltipArrowStyle: {
      type: Object,
      required: true
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
      return { left: this.left, top: this.top, right: this.right, bottom: this.bottom };
    },
    tooltipType() {
      return `c-tooltip--${this.mode}`;
    },
    showTooltip() {
      return this.show === undefined ? this.hovering : this.show;
    }
  }
};
</script>

<template>
  <div class="l-custom-tooltip">
    <div
      class="c-main-content"
      :class="contentClass"
      :style="positionStyle"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <slot name="mainContent" />
    </div>
    <div
      class="c-tooltip-content"
      :class=" {'c-tooltip-show': hovering, [tooltipType]: true } "
      :style="[tooltipContentStyle, positionStyle]"
    >
      <slot name="tooltipContent" />
    </div>
    <div
      class="c-tooltip-arrow"
      :class=" {'c-tooltip-show': hovering, [tooltipType]: true } "
      :style="[tooltipArrowStyle, positionStyle]"
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
  transform: translateX(-50%);
}

.c-tooltip-content,
.c-tooltip-arrow {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s linear;
  transition-property: opacity, visibility;
}

.c-tooltip-content {
  position: absolute;
  padding: 0.7rem;
  width: 16rem;
  border-radius: 0.3rem;
  background-color: hsla(0, 0%, 5%, 0.9);
  color: #fff;
  content: attr(ach-tooltip);
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.2;
  z-index: 4;
}

.t-dark-metro .c-tooltip-content {
  border-radius: 0;
}

.c-tooltip-arrow {
  position: absolute;
  transform: translate(-50%, -100%);
  width: 0;
  border-top: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-bottom: 0.5rem solid transparent;
  border-left: 0.5rem solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
  transition-duration: 0.4s;
  z-index: 4;
}

.c-tooltip--top.c-tooltip-content {
  transform: translate(-50%, -100%);
  margin-top: -0.5rem;
}

.c-tooltip--top.c-tooltip-arrow {
  transform: translate(-50%, -100%);
  border-top: 0.5rem solid hsla(0, 0%, 5%, 0.9);
  border-bottom: 0;
}

.c-tooltip--bottom.c-tooltip-content {
  transform: translate(-50%, 100%);
  margin-bottom: -0.5rem;
}

.c-tooltip--bottom.c-tooltip-arrow {
  transform: translate(-50%, 100%);
  border-bottom: 0.5rem solid hsla(0, 0%, 5%, 0.9);
  border-top: 0;
}

.c-tooltip--right.c-tooltip-content {
  transform: translate(100%, -50%);
  margin-right: -0.5rem;
}

.c-tooltip--right.c-tooltip-arrow {
  transform: translate(100%, -50%);
  border-right: 0.5rem solid hsla(0, 0%, 5%, 0.9);
  border-left: 0;
}

.c-tooltip--left.c-tooltip-content {
  transform: translate(-100%, -50%);
  margin-left: -0.5rem;
}

.c-tooltip--left.c-tooltip-arrow {
  transform: translate(-100%, -50%);
  border-left: 0.5rem solid hsla(0, 0%, 5%, 0.9);
  border-right: 0;
}

.c-tooltip-show {
  visibility: visible;
  opacity: 1;
}
</style>