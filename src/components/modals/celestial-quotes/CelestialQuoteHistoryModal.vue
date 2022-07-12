<script>
import CelestialQuoteLineBasicInteractable from "./templates/CelestialQuoteLineBasicInteractable";

export default {
  name: "CelestialQuoteHistoryModal",
  components: {
    CelestialQuoteLineBasicInteractable
  },
  props: {
    quotes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      focusedQuote: 0,
      unlockedQuotes: []
    };
  },
  computed: {
    upClass() {
      return {
        "c-modal-celestial-quote-history__arrow": true,
        "c-modal-celestial-quote-history__arrow-up": true,
        "c-modal-celestial-quote-history__arrow--disabled": this.focusedQuote <= 0,
        "fas": true,
        "fa-chevron-circle-up": true,
      };
    },
    downClass() {
      return {
        "c-modal-celestial-quote-history__arrow": true,
        "c-modal-celestial-quote-history__arrow-down": true,
        "c-modal-celestial-quote-history__arrow--disabled": this.focusedQuote >= this.unlockedQuotes.length - 1,
        "fas": true,
        "fa-chevron-circle-down": true,
      };
    },
  },
  methods: {
    update() {
      this.unlockedQuotes = this.quotes.filter(x => x.isUnlocked);
    },
    quoteStyle(id) {
      return {
        top: `calc(50vh + ${(id - this.focusedQuote) * 10}rem)`,
        transform: `translate(-50%, -50%) scale(${Math.max(1 - Math.abs(id - this.focusedQuote) / 4, 0)})`,
        "z-index": 6 - Math.abs(id - this.focusedQuote)
      };
    },
    progressUp() {
      this.focusedQuote = Math.max(0, this.focusedQuote - 1);
    },
    progressDown() {
      this.focusedQuote = Math.min(this.unlockedQuotes.length - 1, this.focusedQuote + 1);
    }
  }
};
</script>

<template>
  <div class="l-modal-overlay c-modal-overlay">
    <i
      class="c-modal-celestial-quote-history__close fas fa-circle-xmark"
      @click="emitClose"
    />
    <div
      class="c-quote-history-modal__clickable-background"
      @click="emitClose"
    />
    <div class="c-quote-history-modal__controls">
      <i
        :class="upClass"
        @click="progressUp"
      />
      <i
        :class="downClass"
        @click="progressDown"
      />
    </div>
    <CelestialQuoteLineBasicInteractable
      v-for="(quote, quoteId) in unlockedQuotes"
      :key="quoteId"
      class="c-quote-overlay"
      :style="quoteStyle(quoteId)"
      :quote="quote"
      :is-focused="focusedQuote === quoteId"
      :close-visible="false"
    />
  </div>
</template>

<style scoped>
.c-modal-overlay {
  cursor: pointer;
}

.c-quote-overlay {
  font-size: 1.4rem;
  padding: 1rem;
  transition: all 0.2s, top 0.3s ease, transform 0.3s ease, z-index 0s;
}

.c-modal-celestial-quote-history__arrow,
.c-modal-celestial-quote-history__close {
  font-size: 2.5rem;
  color: var(--color-text);
  cursor: pointer;
}

.c-modal-celestial-quote-history__arrow--disabled {
  opacity: 0.4;
  cursor: default;
}

.c-modal-celestial-quote-history__close {
  position: absolute;
  /* stylelint-disable-next-line unit-allowed-list */
  bottom: calc(50vh + 16rem);
  /* stylelint-disable-next-line unit-allowed-list */
  left: calc(50vw + 16rem);
  z-index: 1;
  animation: 0.5s a-fade-in;
}

.c-quote-history-modal__controls {
  display: flex;
  flex-direction: column;
  height: 10rem;
  position: absolute;
  /* stylelint-disable-next-line unit-allowed-list */
  top: 50vh;
  /* stylelint-disable-next-line unit-allowed-list */
  right: calc(50vw + 16rem);
  z-index: 1;
  justify-content: space-between;
  padding: 1rem;
  transform: translateY(-50%);
  animation: 0.5s a-fade-in;
}

.c-quote-history-modal__clickable-background {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 0;
}

@keyframes a-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
