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
      unlockedQuotes: [],
      lastProgress: Date.now()
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
  created() {
    this.$nextTick(() => {
      this.on$(GAME_EVENT.ARROW_KEY_PRESSED, arrow => {
        switch (arrow[0]) {
          case "up":
            this.progressUp();
            break;
          case "down":
            this.progressDown();
        }
      });
    });
  },
  methods: {
    update() {
      this.unlockedQuotes = this.quotes.filter(x => x.isUnlocked);
    },
    quoteStyle(id) {
      return {
        top: `calc(50vh + ${easeOut(id - this.focusedQuote) * 16}rem)`,
        transform: `translate(-50%, -50%) scale(${Math.max(1 - Math.abs(id - this.focusedQuote) / 8, 0)})`,
        "z-index": 6 - Math.abs(id - this.focusedQuote)
      };
    },
    progressUp() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuote = Math.max(0, this.focusedQuote - 1);
      this.lastProgress = Date.now();
    },
    progressDown() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuote = Math.min(this.unlockedQuotes.length - 1, this.focusedQuote + 1);
      this.lastProgress = Date.now();
    }
  }
};

function easeOut(x) {
  return Math.sign(x) * Math.pow(Math.abs(x), 0.4);
}
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
    <div
      v-for="(quote, quoteId) in unlockedQuotes"
      :key="quoteId"
      @click="focusedQuote = quoteId"
    >
      <CelestialQuoteLineBasicInteractable
        class="c-quote-overlay"
        :class="{ 'c-quote-overlay--background': focusedQuote !== quoteId }"
        :style="quoteStyle(quoteId)"
        :quote="quote"
        :is-focused="focusedQuote === quoteId"
        :close-visible="false"
      />
    </div>
  </div>
</template>

<style scoped>
.c-quote-overlay {
  font-size: 1.4rem;
  padding: 1rem;
  transition: all 0.2s, top 0.3s ease, transform 0.3s ease, z-index 0.3s;
}

.c-quote-overlay--background {
  opacity: 0.8;
  filter: grayscale(0.5);
  cursor: pointer;
}

.c-quote-overlay--background:hover {
  opacity: 1;
  filter: grayscale(0.3) drop-shadow(0 0 2rem);
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
  cursor: pointer;
}

@keyframes a-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
