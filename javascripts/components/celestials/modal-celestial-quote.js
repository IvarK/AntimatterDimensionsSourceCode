"use strict";

Vue.component("modal-celestial-quote", {
  data: () => ({
    index: 0,
  }),
  computed: {
    quotes() {
      return this.$viewModel.modal.current.lines;
    },
    currentQuote() {
      return this.quotes[this.index];
    },
    currentCelestialName() {
      return Celestials[this.currentQuote.celestial].displayName;
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
        <div v-if="currentQuote.showName"><b>{{currentCelestialName}}:</b></div>
        {{currentQuote.line.replace("*", "")}}
      </div>
      <i class="c-modal-celestial-quote__arrow fas"
         :class="nextClass"
         @click="nextClick" />
      </div>
  </div>`,
});
