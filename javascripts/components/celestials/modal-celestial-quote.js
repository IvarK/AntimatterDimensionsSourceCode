"use strict";

Vue.component("modal-celestial-quote", {
  data: () => ({
    index: 0,
  }),
  computed: {
    quotes() {
      return this.$viewModel.modal.current.lines;
    },
    celestialName() {
      return Celestials[this.$viewModel.modal.current.celestial].displayName;
    },
    isLastQuote() {
      return this.index >= this.quotes.length - 1;
    },
    prevStyle() {
      return this.index > 0 ? {} : { visibility: "hidden" };
    },
    nextClass() {
      return this.isLastQuote ? "fa-check-circle" : "fa-chevron-circle-right";
    },
  },
  methods: {
    nextClick() {
      if (this.isLastQuote) {
        this.close();
      } else {
        ++this.index;
      }
    },
    prevQuote() {
      this.index = Math.max(this.index - 1, 0);
    },
    close() {
      Modal.hide();
    }
  },
  template: `
  <div class="l-modal-overlay c-modal-overlay">
    <div class="l-modal-celestial-quote c-modal">
      <i :style="prevStyle"
         class="c-modal-celestial-quote__arrow fas fa-chevron-circle-left"
         @click="prevQuote"/>
      <div class="l-modal-celestial-quote__text">
        <div><b>{{celestialName}}:</b></div>
        {{quotes[index]}}
      </div>
      <i class="c-modal-celestial-quote__arrow fas"
         :class="nextClass"
         @click="nextClick" />
      </div>
  </div>`,
});
