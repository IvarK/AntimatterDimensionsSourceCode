<script>
export default {
  name: "CelestialQuoteModal",
  data() {
    return {
      index: 0,
      line: "",
      overrideCelestial: ""
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
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    update() {
      if (!this.currentQuote) {
        this.line = "";
        return;
      }
      if (typeof this.currentQuote.line === "function") {
        let currentQuoteLine = this.currentQuote.line();
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
        v-if="index === length - 1"
        class="c-modal-celestial-quote__end fas fa-check-circle"
        @click="close"
      />
    </div>
  </div>
</template>
