"use strict";

// This wraps a control box of some sort (like glyph weight adjust) in
// a dropdown menu like container.
// You can force it to open programatically by sending it an openrequest event

Vue.component("expanding-control-box", {
  props: {
    // Class assigned to visible container; specify border and background here
    containerClass: [String, Array],
    label: String,
    widthSource: {
      // Content sizes the width based on what's in the dropdown.
      // header sizes based on the menu header (container ref)
      type: String,
      default: "content",
    },
  },
  data() {
    return {
      state: null,
      openRequest: false,
      closedHeight: "1em",
      openHeight: "1em",
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
    containerStyle() {
      return {
        maxHeight: this.maxHeight,
        visibility: this.state.visibility,
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
  methods: {
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
        this.$refs.container.style.width = this.$refs.dropdown.offsetWidth + "px";
        this.$refs.root.style.width = this.$refs.dropdown.offsetWidth + "px";
      } else if (this.widthSource === "header") {
        this.$refs.root.style.width = this.$refs.container.offsetWidth + "px";
      }
    },
    updateHeightInfo() {
      const headerHeight = this.$refs.expandButton.offsetHeight;
      this.closedHeight = headerHeight + "px";
      this.openHeight = (headerHeight + this.$refs.dropdown.offsetHeight) + "px";
    },
    transitionEnd(event) {
      if (event.propertyName !== "max-height") return;
      if (this.state === this.states.OPENING) {
        this.state = this.states.OPEN;
      } else if (this.state === this.states.CLOSING) {
        this.state = this.states.CLOSED;
      }
    },
  },
  template: `
  <!-- The root element is an empty box of fixed size with position relative.
      On top of that, we have a container element (which has both the label and the control)
      The container element hides the control via clipping (and visibility). The thing you
      click to show hide is at the top of the container element. -->
  <div ref="root" class="l-expanding-control-box">
    <div ref="container"
         :class="['l-expanding-control-box__container',
                  containerClass,
                  {'l-expanding-control-box__container--transition': state.transition }]"
         :style="containerStyle"
         @transitionend="transitionEnd">
      <div v-if="!$slots.header"
           ref="expandButton"
           class="l-expanding-control-box__button"
           @click="openRequest=!openRequest">
        {{label}} ▼
      </div>
      <div v-else ref="expandButton" @click="openRequest=!openRequest">
        <slot name="header"/>
      </div>
      <div ref="dropdown"><slot name="dropdown"/></div>
    </div>
  </div>
  `,
  mounted() {
    // Set the root and container elements to match the height of the button
    this.updateHeightInfo();
    this.$refs.root.style.height = this.closedHeight;
    this.updateBaseWidth();
  },
  created() {
    this.state = this.states.CLOSED;
    this.$on("openrequest", () => this.openRequest = true);
  }
});