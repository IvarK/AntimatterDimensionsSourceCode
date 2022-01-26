<script>
export default {
  name: "CelestialQuoteModal",
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    quotes() {
      return this.$viewModel.modal.current.lines;
    },
    currentQuote() {
      return this.quotes[this.index];
    },
    celestial() {
      return Celestials[this.currentQuote.celestial];
    },
    currentCelestialName() {
      return this.celestial.displayName;
    },
    currentCelestialSymbol() {
      return this.celestial.symbol;
    },
    prevStyle() {
      return this.index > 0 ? {} : { visibility: "hidden" };
    },
    length() {
      return this.quotes.length;
    },
    nextStyle() {
      return this.index >= this.length - 1 ? { visibility: "hidden" } : {};
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
      this.index = Math.min(this.index + 1, this.length);
    },
    prevQuote() {
      this.index = Math.max(this.index - 1, 0);
    },
    close() {
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  },
};
</script>

<template>
  <div class="l-modal-overlay c-modal-overlay">
    <div :class="modalClass">
      <i
        :style="prevStyle"
        class="c-modal-celestial-quote__arrow fas fa-chevron-circle-left"
        @click="prevQuote"
      />
      <span
        class="c-modal-cestial-quote__symbol"
        v-html="currentCelestialSymbol"
      />
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
        v-if="index === length - 1"
        class="c-modal-celestial-quote__end fas fa-check-circle"
        @click="close"
      />
    </div>
  </div>
</template>
