<script>
export default {
  name: "CelestialQuoteModal",
  data() {
    return {
      index: 0,
      line: "",
      overrideCelestial: "",
      currentCelestialName: "",
      length: 0
    };
  },
  computed: {
    quotes() {
      if (!this.$viewModel.modal.current) return false;
      return this.$viewModel.modal.current.lines;
    },
    currentQuote() {
      if (!this.quotes) return false;
      return this.quotes[this.index];
    },
    celestial() {
      if (this.overrideCelestial) {
        return Celestials[this.overrideCelestial];
      }
      return Celestials[this.currentQuote.celestial];
    },
    defaultCelestial() {
      return Celestials[this.currentQuote.celestial];
    },
    currentCelestialSymbol() {
      return this.celestial.symbol;
    },
    isQuoteStart() {
      return this.index === 0 || this.quotes[this.index - 1].isEndQuote;
    },
    isQuoteEnd() {
      return this.index >= this.length - 1 || this.currentQuote.isEndQuote;
    },
    prevStyle() {
      return this.isQuoteStart ? { visibility: "hidden" } : {};
    },
    nextStyle() {
      return this.isQuoteEnd ? { visibility: "hidden" } : {};
    },
    modalClass() {
      return [
        "l-modal-celestial-quote",
        "c-modal",
        `c-modal-celestial-quote--${this.overrideCelestial || this.currentQuote.celestial}`
      ];
    }
  },
  methods: {
    nextClick() {
      this.index = Math.min(this.index + 1, this.length);
      this.update();
    },
    prevQuote() {
      this.index = Math.max(this.index - 1, 0);
      this.update();
    },
    close() {
      if (this.index >= this.length - 1) {
        EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
      } else {
        this.nextClick();
      }
    },
    update() {
      if (!this.currentQuote) {
        this.line = "";
        return;
      }
      this.length = this.quotes.length;
      this.currentCelestialName = this.defaultCelestial.displayName;
      if (typeof this.currentQuote.line === "function") {
        const currentQuoteLine = this.currentQuote.line();
        this.currentQuote.showName = (currentQuoteLine[0] !== "*");
        this.line = this.currentQuote.line().replace("*", "");
        if (this.line.includes("<!")) {
          const start = this.line.indexOf("<!"), end = this.line.indexOf("!>");
          this.overrideCelestial = this.line.substring(start + 2, end);
          this.line = Modal.celestialQuote.removeOverrideCel(this.line);
        } else {
          this.overrideCelestial = "";
        }
      } else {
        this.line = this.currentQuote.line.replace("*", "");
        this.overrideCelestial = this.currentQuote.overrideCelestial;
      }
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
        {{ line }}
      </div>
      <i
        :style="nextStyle"
        class="c-modal-celestial-quote__arrow fas fa-chevron-circle-right"
        @click="nextClick"
      />
      <i
        v-if="isQuoteEnd"
        class="c-modal-celestial-quote__end fas fa-check-circle"
        @click="close"
      />
    </div>
  </div>
</template>
