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
    }
  },
  watch: {
    left(newVal) {
      this.updateLeft(newVal);
    }
  },
  mounted() {
    this.mainContent = this.$el.querySelector("#mainContent");
    if (!this.mainContent) {
      throw new Error("CustomizeableTooltip has no element with id mainContent inserted.");
    }
    this.mainContent.addEventListener("mouseenter", () => {
      this.hovering = true;
    });
    this.mainContent.addEventListener("mouseleave", () => {
      this.hovering = false;
    });
    this.updateLeft();
  },
  data() {
    return {
      hovering: false,
      mainContent: null
    };
  },
  methods: {
    updateLeft(newVal = this.left) {
      this.mainContent.style.left = newVal;
    }
  },
  computed: {
    tooltipGenStyle() {
      const styles = { left: this.left };
      return styles;
    }
  }
};
</script>

<template>
  <div
    class="l-custom-tooltip"
  >
    <slot
      name="mainContent"
    />
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