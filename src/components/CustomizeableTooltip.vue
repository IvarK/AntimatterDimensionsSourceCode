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
      default: "0"
    },
    contentClass: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hovering: false,
      mainContent: null
    };
  },
  computed: {
    tooltipGenStyle() {
      return { left: this.left };
    }
  }
};
</script>

<template>
  <div class="l-custom-tooltip">
    <div
      class="c-main-content"
      :class="contentClass"
      :style="{ left }"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <slot name="mainContent" />
    </div>
    <div
      class="c-tooltip-content"
      :class=" {'c-tooltip-show': hovering } "
      :style="[tooltipContentStyle, tooltipGenStyle]"
    >
      <slot name="tooltipContent" />
    </div>
    <div
      class="c-tooltip-arrow"
      :class=" {'c-tooltip-show': hovering } "
      :style="[tooltipArrowStyle, tooltipGenStyle]"
    />
  </div>
</template>

<style scoped>
.l-custom-tooltip {
  display: inline-block;
  position: static;
}

.c-main-content {
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
  bottom: 100%;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
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
  bottom: 100%;
  margin-left: -0.5rem;
  width: 0;
  border-top: 0.5rem solid hsla(0, 0%, 5%, 0.9);
  border-right: 0.5rem solid transparent;
  border-left: 0.5rem solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
  transition-duration: 0.4s;
  z-index: 4;
}

.c-tooltip-show {
  visibility: visible;
  opacity: 1;
}
</style>