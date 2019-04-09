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
      isOpen: false,
      closedHeight: "1em",
      openHeight: "1em",
    };
  },
  watch: {
    isOpen(newOpen) {
      this.$nextTick(() => {
        this.$refs.container.style.maxHeight = newOpen ? this.openHeight : this.closedHeight;
        this.updateBaseWidth();
      });
      if (newOpen) {
        this.$refs.dropdown.visibility = "visible";
      } else {
        this.$refs.container.addEventListener("transitionend", function hider(e) {
          e.target.visibility = "hidden";
          e.target.removeEventListener("transitionend", hider);
        });
      }
    }
  },
  template: `
  <!-- The root element is an empty box of fixed size with position relative.
      On top of that, we have a container element (which has both the label and the control)
      The container element hides the control via clipping (and visibility). The thing you
      click to show hide is at the top of the container element. -->
  <div ref="root" class="l-expanding-control-box">
    <div ref="container" :class="['l-expanding-control-box__container', containerClass]">
      <div v-if="!$slots.header" ref="expandButton" class="l-expanding-control-box__button" @click="isOpen=!isOpen">
        {{label}} ▼
      </div>
      <div v-else ref="expandButton" @click="isOpen=!isOpen"><slot name="header"/></div>
      <div ref="dropdown"><slot name="dropdown"/></div>
    </div>
  </div>
  `,
  methods: {
    updateBaseWidth() {
      if (this.widthSource === "content") {
        this.$refs.container.style.width = this.$refs.dropdown.offsetWidth + "px";
        this.$refs.root.style.width = this.$refs.dropdown.offsetWidth + "px";
      } else if (this.widthSource === "header") {
        this.$refs.root.style.width = this.$refs.container.offsetWidth + "px";
      }
    }
  },
  mounted() {
    // Set the root and container elements to match the height of the button
    const headerHeight = this.$refs.expandButton.offsetHeight;
    this.closedHeight = headerHeight + "px";
    this.openHeight = (headerHeight + this.$refs.dropdown.offsetHeight) + "px";
    this.$refs.container.style.maxHeight = this.closedHeight;
    this.$refs.root.style.height = this.closedHeight;
    this.updateBaseWidth();
  },
  created() {
    this.$on("openrequest", () => this.isOpen = true);
  }
});