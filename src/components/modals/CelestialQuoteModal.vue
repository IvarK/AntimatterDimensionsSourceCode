<script>
import CelestialQuoteLine from "./CelestialQuoteLine";

export default {
  name: "CelestialQuoteModal",
  components: {
    CelestialQuoteLine
  },
  props: {
    quote: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    totalLines() {
      return this.quote.totalLines;
    },
    currentLine: {
      get() {
        return this.index;
      },
      set(x) {
        this.index = Math.clamp(x, 0, this.totalLines - 1);
      }
    },
    isQuoteStart() {
      return this.currentLine === 0;
    },
    isQuoteEnd() {
      return this.currentLine === this.totalLines - 1;
    },
  },
  created() {
    this.$nextTick(() => {
      this.on$(GAME_EVENT.ARROW_KEY_PRESSED, arrow => this.progressIn(arrow[0]));
      this.on$(GAME_EVENT.ENTER_PRESSED, () => {
        if (this.isQuoteEnd) this.close();
      });
    });
  },
  methods: {
    progressIn(direction) {
      switch (direction) {
        case "left": return this.currentLine--;
        case "right": return this.currentLine++;
        default: return false;
      }
    },
    close() {
      this.index = 0;
      Quote.advanceQueue();
    },
  },
};
</script>

<template>
  <div class="l-modal-overlay c-modal-overlay">
    <CelestialQuoteLine
      class="c-quote-overlay"
      :quote="quote"
      :current-line="currentLine"
      :left-visible="!isQuoteStart"
      :right-visible="!isQuoteEnd"
      :close-visible="isQuoteEnd"
      primary
      @close="close"
      @progress-in="progressIn"
    />
  </div>
</template>

<style scoped>
.c-quote-overlay {
  font-size: 1.4rem;
  padding: 1rem;
  transition-duration: 0.2s;
}
</style>
