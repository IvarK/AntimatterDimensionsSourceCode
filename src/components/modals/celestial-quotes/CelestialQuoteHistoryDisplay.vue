<script>
import CelestialQuoteLine from "./CelestialQuoteLine";

export default {
  name: "CelestialQuoteHistoryDisplay",
  components: {
    CelestialQuoteLine
  },
  props: {
    quotes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      focusedQuoteId: 0,
      unlockedQuotes: [],
      lastProgress: Date.now()
    };
  },
  computed: {
    name() {
      return this.unlockedQuotes[0].quote._celestial;
    },
    focusedQuote() {
      return this.unlockedQuotes[this.focusedQuoteId];
    },
    currentQuoteLine() {
      return this.focusedQuote.currentLine;
    },
    commonButtonClass() {
      const lightBG = this.name === "laitela" && !Theme.current().isDark();
      return {
        "fas c-modal-celestial-quote-history__arrow": true,
        "o-dark-button": lightBG,
        "o-light-button": !lightBG,
      };
    },
    upClass() {
      return {
        ...this.commonButtonClass,
        "c-modal-celestial-quote-history__arrow-up fa-chevron-circle-up": true,
        "c-modal-celestial-quote-history__arrow--disabled": this.focusedQuoteId <= 0,
      };
    },
    downClass() {
      return {
        ...this.commonButtonClass,
        "c-modal-celestial-quote-history__arrow-down fa-chevron-circle-down": true,
        "c-modal-celestial-quote-history__arrow--disabled": this.focusedQuoteId >= this.unlockedQuotes.length - 1,
      };
    },
    leftClass() {
      return {
        ...this.commonButtonClass,
        "c-modal-celestial-quote-history__arrow-left fa-chevron-circle-left": true,
        "c-modal-celestial-quote-history__arrow--disabled": this.currentQuoteLine <= 0,
      };
    },
    rightClass() {
      return {
        ...this.commonButtonClass,
        "c-modal-celestial-quote-history__arrow-right fa-chevron-circle-right": true,
        "c-modal-celestial-quote-history__arrow--disabled":
          this.currentQuoteLine >= this.focusedQuote.quote.totalLines - 1,
      };
    },
  },
  created() {
    // Doesn't need to be reactive because any quotes which are unlocked will temp hide this modal first
    this.unlockedQuotes = this.quotes.filter(x => x.isUnlocked).map(x => ({ quote: x, currentLine: 0 }));
    this.$nextTick(() => {
      this.on$(GAME_EVENT.ARROW_KEY_PRESSED, arrow => {
        switch (arrow[0]) {
          case "up":
            this.progressUp();
            break;
          case "down":
            this.progressDown();
            break;
          case "left":
            this.progressLeft();
            break;
          case "right":
            this.progressRight();
            break;
        }
      });
    });
  },
  methods: {
    isFocused(quote, line) {
      return this.focusedQuoteId === quote && this.currentQuoteLine === line;
    },
    quoteStyle(quote, line) {
      const scale = quote === this.focusedQuoteId ? 1 - (line !== this.currentQuoteLine) * 0.3
        : 1 - Math.abs(quote - this.focusedQuoteId) / 8;
      const additionalTranslate = quote === this.focusedQuoteId && line !== this.currentQuoteLine
        ? `translateX(${(line - this.currentQuoteLine) * 110 + Math.sign(line - this.currentQuoteLine) * 20}%)`
        : "";
      return {
        top: `calc(50vh + ${easeOut(quote - this.focusedQuoteId) * 16}rem)`,
        transform: `translate(-50%, -50%) scale(${Math.max(scale, 0)}) ${additionalTranslate}`,
        opacity: Number(line === this.unlockedQuotes[quote].currentLine || quote === this.focusedQuoteId),
        visibility: line === this.unlockedQuotes[quote].currentLine || quote === this.focusedQuoteId ? "visible"
          : "hidden",
        "z-index": -Math.abs(quote - this.focusedQuoteId)
      };
    },
    progressUp() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuoteId = Math.max(0, this.focusedQuoteId - 1);
      this.lastProgress = Date.now();
    },
    progressDown() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuoteId = Math.min(this.unlockedQuotes.length - 1, this.focusedQuoteId + 1);
      this.lastProgress = Date.now();
    },
    progressLeft() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuote.currentLine = Math.max(0, this.focusedQuote.currentLine - 1);
      this.lastProgress = Date.now();
    },
    progressRight() {
      if (Date.now() - this.lastProgress < 150) return;
      this.focusedQuote.currentLine = Math.min(this.focusedQuote.quote.totalLines - 1,
        this.focusedQuote.currentLine + 1);
      this.lastProgress = Date.now();
    },
    close() {
      Quote.clearHistory();
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
      class="c-modal-celestial-quote-history__close fas fa-circle-xmark o-light-button"
      @click="close"
    />
    <div
      class="c-quote-history-modal__clickable-background"
      @click="close"
    />
    <div
      v-for="(quote, quoteId) in unlockedQuotes"
      :key="quoteId"
      @click="focusedQuoteId = quoteId"
    >
      <div
        v-for="(_, lineId) in quote.quote.config.lines"
        :key="lineId"
        @click="quote.currentLine = lineId"
      >
        <CelestialQuoteLine
          class="c-quote-overlay"
          :class="{ 'c-quote-overlay--background': !isFocused(quoteId, lineId) }"
          :quote="quote.quote"
          :current-line="lineId"
          primary
          :style="quoteStyle(quoteId, lineId)"
        />
      </div>
    </div>
    <div class="c-quote-history-modal__controls">
      <i
        :class="upClass"
        @click="progressUp"
      />
      <i
        :class="downClass"
        @click="progressDown"
      />
      <i
        :class="leftClass"
        @click="progressLeft"
      />
      <i
        :class="rightClass"
        @click="progressRight"
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
  filter: grayscale(0.5);
  cursor: pointer;
}

.c-quote-overlay--background:hover {
  opacity: 1;
  filter: grayscale(0.3) drop-shadow(0 0 2rem);
}

.c-modal-celestial-quote-history__arrow,
.c-modal-celestial-quote-history__close {
  position: absolute;
  z-index: 1;
  font-size: 2.5rem;
  cursor: pointer;
}

.o-light-button {
  color: white;
}

.o-dark-button {
  color: black;
}

.c-modal-celestial-quote-history__arrow--disabled {
  opacity: 0.4;
  cursor: default;
}

.c-modal-celestial-quote-history__arrow-down {
  top: calc(50% + 16rem);
  left: 50%;
  transform: translateX(-50%);
}

.c-modal-celestial-quote-history__arrow-up {
  bottom: calc(50% + 16rem);
  left: 50%;
  transform: translateX(-50%);
}

.c-modal-celestial-quote-history__arrow-left {
  top: 50%;
  right: calc(50% + 16rem);
  transform: translateY(-50%);
}

.c-modal-celestial-quote-history__arrow-right {
  top: 50%;
  left: calc(50% + 16rem);
  transform: translateY(-50%);
}

.c-modal-celestial-quote-history__close {
  position: absolute;
  bottom: calc(50% + 16rem);
  left: calc(50% + 16rem);
  z-index: 1;
  animation: a-fade-in 0.5s;
}

.c-quote-history-modal__controls {
  animation: a-fade-in 0.5s;
}

.c-quote-history-modal__clickable-background {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: -10;
  cursor: zoom-out;
}

@keyframes a-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
