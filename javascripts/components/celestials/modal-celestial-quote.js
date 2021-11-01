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
    currentCelestialSymbol() {
      return Celestials[this.currentQuote.celestial].symbol;
    },
    prevStyle() {
      return this.index > 0 ? {} : { visibility: "hidden" };
    },
    nextStyle() {
      return this.index >= this.quotes.length - 1 ? { visibility: "hidden" } : {};
    },
    endStyle() {
      return this.index >= this.quotes.length - 1 ? {} : { visibility: "hidden" };
    },
    modalClass() {
      return [
        "l-modal-celestial-quote",
        "c-modal",
        `c-modal-celestial-quote--${this.currentQuote.celestial}`
      ];
    }
  },
  methods: {
    nextClick() {
      ++this.index;
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
      <div :class="modalClass">
        <i
          :style="prevStyle"
          class="c-modal-celestial-quote__arrow fas fa-chevron-circle-left"
          @click="prevQuote"
        />
        <span class="c-modal-cestial-quote__symbol" v-html="currentCelestialSymbol"></span>
        <div class="l-modal-celestial-quote__text">
          <div v-if="currentQuote.showName">
            <b>{{ currentCelestialName }}</b>
          </div>
          {{ currentQuote.line.replace("*", "") }}
        </div>
        <i
          :style="nextStyle"
          class="c-modal-celestial-quote__arrow fas fa-chevron-circle-right"
          @click="nextClick"
        />
        <i
          :style="endStyle"
          class="c-modal-celestial-quote__end fas fa-check-circle"
          @click="close()"
        />
      </div>
    </div>`,
});
