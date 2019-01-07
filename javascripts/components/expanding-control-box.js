"use strict";

/* This wraps a control box of some sort (like glyph weight adjust) in
a dropdown menu like container */

Vue.component("expanding-control-box", {
  props: {
    containerClass: String, // class assigned to visible container; specify border and background here
    label: String,
  },
  data: function() {
    return {
      isOpen: false,
      closedHeight: "1em",
      openHeight: "1em",
    }
  },
  computed: {
    rootStyle() {
      return {
        position: "relative",
        "z-index": 10,
      };
    },
    containerStyle() {
      return {
        position: "absolute",
        display: "block",
        width: "auto",
        height: "auto",
        overflow: "hidden",
        left: "50%",
        transform: "translateX(-50%)",
        "-webkit-transform": "translateX(-50%)",
        transition: "height 1.5s",
        "-webkit-transition": "max-height 0.5s",
      }
    },
    expandButtonStyle() {
      return {
        display: "block",
        width: "100%",
        "white-space": "nowrap",
        border: "none !important"
      };
    },
  },
  watch: {
    isOpen(newOpen) {
      this.$nextTick(() => {
        this.$refs.container.style.maxHeight = newOpen ? this.openHeight : this.closedHeight;
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
  <div ref="root" :style="rootStyle">
    <div ref="container" :style="containerStyle" :class="containerClass">
      <div ref="expandButton" class="" :style="expandButtonStyle"
         @click="isOpen=!isOpen">
         {{label}} ▼
      </div>
      <div ref="dropdown"><slot name="dropdown"></slot></div>
    </div>
  </div>
  `,
  mounted() {
    // set the root and container elements to match the height of the button
    this.closedHeight = this.$refs.expandButton.offsetHeight + "px"
    this.openHeight = (this.$refs.expandButton.offsetHeight + this.$refs.dropdown.offsetHeight) + "px"
    this.$refs.container.style.maxHeight = this.closedHeight;
    this.$refs.container.style.width = this.$refs.expandButton.offsetWidth + "px";
    this.$refs.root.style.height = this.closedHeight;
    this.$refs.root.style.width = this.$refs.expandButton.offsetWidth + "px";
  }
});