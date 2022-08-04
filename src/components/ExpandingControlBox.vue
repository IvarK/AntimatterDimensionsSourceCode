<script>
// This wraps a control box of some sort (like glyph weight adjust) in
// a dropdown menu like container.
// You can force it to open programmatically by sending it an openrequest event

export default {
  name: "ExpandingControlBox",
  props: {
    // Class assigned to visible container; specify border and background here
    containerClass: {
      type: String,
      required: false,
      default: undefined
    },
    label: {
      type: String,
      required: false,
      default: undefined
    },
    widthSource: {
      // Content sizes the width based on what's in the dropdown.
      // header sizes based on the menu header (container ref)
      type: String,
      required: false,
      default: undefined,
    },
    buttonClass: {
      type: String,
      required: false,
      default: "l-expanding-control-box__button",
    },
    autoClose: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      state: null,
      openRequest: false,
      closedHeight: "1em",
      openHeight: "1em",
      hasMouse: false,
      closeTime: 0,
    };
  },
  computed: {
    states: () => ({
      CLOSED: { name: "CLOSED", transition: false, visibility: false, height: "closed" },
      OPEN_REQUESTED: { name: "OPEN_REQUESTED", transition: true, visibility: true, height: "closed" },
      OPENING: { name: "OPENING", transition: true, visibility: true, height: "open" },
      OPEN: { name: "OPEN", transition: false, visibility: true, height: null },
      CLOSE_REQUESTED: { name: "CLOSE_REQUESTED", transition: false, visibility: true, height: "open" },
      CLOSING: { name: "CLOSING", transition: true, visibility: true, height: "closed" },
    }),
    maxHeight() {
      if (this.state.height === "open") return this.openHeight;
      return this.state.height === "closed" ? this.closedHeight : null;
    },
    rootClassObject() {
      return {
        "l-expanding-control-box--controls-width": this.widthSource !== undefined
      };
    },
    containerStyle() {
      return {
        maxHeight: this.maxHeight,
        visibility: this.state.visibility,
      };
    },
    containerClassObject() {
      const classes = {
        "l-expanding-control-box__container--transition": this.state?.transition
      };
      classes[this.containerClass] = true;
      return classes;
    },
    indicatorArrowClassObject() {
      return {
        "c-indicator-arrow": true,
        "c-indicator-arrow--flipped": this.state === this.states.OPENING || this.state === this.states.OPEN,
      };
    }
  },
  watch: {
    state(newState) {
      this.processRequest(newState, this.openRequest);
      this.updateHeightInfo();
      switch (this.state) {
        case this.states.CLOSED:
          break;
        case this.states.OPEN_REQUESTED:
          this.$nextTick(() => this.state = this.states.OPENING);
          break;
        case this.states.OPENING:
          break;
        case this.states.OPEN:
          break;
        case this.states.CLOSE_REQUESTED:
          // Need to have DOM update with CLOSE_REQUESTED state to re-enable transitions
          this.$nextTick(() => this.state = this.states.CLOSING);
          break;
        case this.CLOSING:
          break;
      }
    },
    openRequest(newOpen) {
      this.processRequest(this.state, newOpen);
    },
  },
  created() {
    this.state = this.states.CLOSED;
    this.on$("openrequest", () => this.openRequest = true);
  },
  mounted() {
    // Set the root and container elements to match the height of the button
    this.updateHeightInfo();
    this.$refs.root.style.height = this.closedHeight;
    this.updateBaseWidth();
  },
  methods: {
    update() {
      const secSinceMouseOff = this.hasMouse ? 0 : (Date.now() - this.closeTime) / 1000;
      if (this.autoClose && this.state === this.states.OPEN && secSinceMouseOff > 1) this.openRequest = false;
    },
    processRequest(state, request) {
      if (request && (state === this.states.CLOSED || state === this.states.CLOSE_REQUESTED)) {
        this.state = this.states.OPEN_REQUESTED;
      }
      if (!request && (state === this.states.OPEN || state === this.states.OPEN_REQUESTED)) {
        this.state = this.states.CLOSE_REQUESTED;
      }
    },
    updateBaseWidth() {
      if (this.widthSource === "content") {
        this.$refs.container.style.width = `${this.$refs.dropdown.offsetWidth}px`;
        this.$refs.root.style.width = `${this.$refs.dropdown.offsetWidth}px`;
      } else if (this.widthSource === "header") {
        this.$refs.root.style.width = `${this.$refs.container.offsetWidth}px`;
      }
    },
    updateHeightInfo() {
      const headerHeight = this.$refs.expandButton.offsetHeight;
      this.closedHeight = `${headerHeight}px`;
      this.openHeight = `${headerHeight + this.$refs.dropdown.offsetHeight}px`;
    },
    transitionEnd(event) {
      if (event.propertyName !== "max-height") return;
      if (this.state === this.states.OPENING) {
        this.state = this.states.OPEN;
      } else if (this.state === this.states.CLOSING) {
        this.state = this.states.CLOSED;
      }
    },
    handleClick() {
      this.openRequest = !this.openRequest;
      this.hasMouse = this.openRequest;
    },
    mouseOn() {
      this.hasMouse = true;
    },
    mouseOff() {
      this.hasMouse = false;
      this.closeTime = Date.now();
    }
  }
};
</script>

<template>
  <!--
    The root element is an empty box of fixed size with position relative.
    On top of that, we have a container element (which has both the label and the control)
    The container element hides the control via clipping (and visibility). The thing you
    click to show hide is at the top of the container element.
  -->
  <div
    ref="root"
    class="l-expanding-control-box"
    :class="rootClassObject"
  >
    <div
      ref="container"
      class="l-expanding-control-box__container"
      :class="containerClassObject"
      :style="containerStyle"
      @transitionend="transitionEnd"
      @mouseenter="mouseOn"
      @mouseleave="mouseOff"
    >
      <div
        v-if="!$slots.header"
        ref="expandButton"
        :class="buttonClass"
        @click="handleClick"
      >
        {{ label }}
        <span :class="indicatorArrowClassObject">
          ▼
        </span>
      </div>
      <div
        v-else
        ref="expandButton"
        @click="handleClick"
      >
        <slot name="header" />
      </div>
      <div ref="dropdown">
        <slot name="dropdown" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-expanding-control-box {
  position: relative;
  z-index: 3;
}

.l-expanding-control-box--controls-width {
  width: 100%;
}

.l-expanding-control-box__container {
  display: block;
  overflow: hidden;
  width: 100%;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.l-expanding-control-box__container--transition {
  transition: max-height 0.5s;
}

.l-expanding-control-box__button {
  display: flex;
  white-space: nowrap;
  width: 100%;
  height: 2.5rem;
  position: relative;
  top: -0.5rem;
  justify-content: center;
  align-items: center;
  border: none !important;
  cursor: pointer;
}

.c-indicator-arrow--flipped {
  transform: rotate(-180deg);
}

.c-indicator-arrow {
  margin-left: 0.6rem;
  transition: transform 0.25s ease-out;
}
</style>
