"use strict";

Vue.component("celestial-quote-history", {
  props: {
    celestial: String,
    visibleLines: {
      type: Number,
      default: 3,
    }
  },
  data: () => ({
    seenIds: [],
    lastVisibleIndex: 4,
  }),
  mounted() {
    this.lastVisibleIndex = this.quotes.length - 1;
  },
  computed: {
    quotes() {
      const quoteLists = this.seenIds.map(id => Celestials[this.celestial].quotes.fromID(id).lines);
      return [].concat(...quoteLists);
    },
    firstVisibleIndex() {
      return Math.max(0, this.lastVisibleIndex - this.visibleLines + 1);
    },
    visibleQuotes() {
      return this.quotes.slice(this.firstVisibleIndex, this.lastVisibleIndex + 1);
    },
    upButtonClass() {
      return this.buttonClass(this.upButtonEnabled);
    },
    downButtonClass() {
      return this.buttonClass(this.downButtonEnabled);
    },
    upButtonEnabled() {
      return this.lastVisibleIndex >= this.visibleLines;
    },
    downButtonEnabled() {
      return this.lastVisibleIndex < this.quotes.length - 1;
    }
  },
  methods: {
    update() {
      this.seenIds = Array.from(player.celestials[this.celestial].quotes);
    },
    lineStyle(idx) {
      const idxDiff = Math.abs(idx - (this.visibleQuotes.length - 1));
      return {
        opacity: 0.3 + 0.7 / (idxDiff + 1)
      };
    },
    buttonClass(enabled) {
      return enabled
        ? "c-celestial-quote-history__button--enabled"
        : "c-celestial-quote-history__button--disabled";
    },
    upButtonClick() {
      if (this.upButtonEnabled) this.lastVisibleIndex--;
    },
    downButtonClick() {
      if (this.downButtonEnabled) this.lastVisibleIndex++;
    },
  },
  template: `
    <div class="o-celestial-quote-history">
      <div class="l-celestial-quote-history__lines">
        <div
          v-for="(quote, idx) in visibleQuotes"
          :key="idx"
          class="c-celestial-quote-history__line"
          :style="lineStyle(idx)"
        >
          {{quote}}
        </div>
      </div>
      <div class="l-celestial-quote-history__buttons">
        <div
          class="c-celestial-quote-history__button fas fa-chevron-circle-up"
          :class="upButtonClass"
          @click="upButtonClick"
        />
        <div
          class="c-celestial-quote-history__button fas fa-chevron-circle-down"
          :class="downButtonClass"
          @click="downButtonClick"
        />
      </div>
    </div>`
});
