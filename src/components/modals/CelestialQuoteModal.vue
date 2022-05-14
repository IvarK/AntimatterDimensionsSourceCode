<script>
export default {
  name: "CelestialQuoteModal",
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      index: 0,
      message: "",
      celestialSymbol: "",
      celestialName: ""
    };
  },
  computed: {
    currentLine: {
      get() {
        return this.index;
      },
      set(x) {
        this.index = Math.clamp(x, 0, this.totalLines - 1);
      }
    },
    quote() {
      return this.modalConfig.quote;
    },
    line() {
      return this.quote.line(this.currentLine);
    },
    celestial() {
      return this.line.celestial;
    },
    totalLines() {
      return this.quote.totalLines;
    },
    isQuoteStart() {
      return this.currentLine === 0;
    },
    isQuoteEnd() {
      return this.currentLine === this.totalLines - 1;
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
        `c-modal-celestial-quote--${this.celestial}`
      ];
    }
  },
  created() {
    this.on$(GAME_EVENT.ARROW_KEY_PRESSED, this.progressIn);
    this.on$(GAME_EVENT.ENTER_PRESSED, () => {
      if (this.isQuoteEnd) this.close();
    });
  },
  methods: {
    progressIn(direction) {
      switch (direction[0]) {
        case "left": return this.currentLine--;
        case "right": return this.currentLine++;
        default: return false;
      }
    },
    close() {
      this.index = 0;
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    update() {
      const line = this.line;
      this.message = line.line;
      this.celestialSymbol = line.celestialSymbol;
      this.celestialName = line.celestialName;
    }
  },
};
</script>

<template>
  <div class="l-modal-overlay c-modal-overlay">
    <div :class="modalClass">
      <span
        class="c-modal-cestial-quote__symbol"
        v-html="celestialSymbol"
      />
      <span
        v-if="line.showCelestialName"
        class="c-modal-celestial-name"
      >
        {{ celestialName }}
      </span>
      <i
        :style="prevStyle"
        class="c-modal-celestial-quote__arrow fas fa-chevron-circle-left"
        @click="progressIn('left')"
      />
      <div class="l-modal-celestial-quote__text">
        {{ message }}
      </div>
      <i
        :style="nextStyle"
        class="c-modal-celestial-quote__arrow fas fa-chevron-circle-right"
        @click="progressIn('right')"
      />
      <i
        v-if="isQuoteEnd"
        class="c-modal-celestial-quote__end fas fa-check-circle"
        @click="close"
      />
    </div>
  </div>
</template>

<style scoped>
.l-modal-celestial-quote {
  display: flex;
  flex-direction: row;
  width: 30rem;
  height: 30rem;
  position: fixed;
  /* stylelint-disable-next-line unit-allowed-list */
  top: 50vh;
  /* stylelint-disable-next-line unit-allowed-list */
  left: 50vw;
  z-index: 3;
  justify-content: space-between;
  align-items: center;
  transform: translate(-50%, -50%);
}

.c-modal-cestial-quote__symbol {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  justify-content: center;
  align-items: center;
  font-size: 25rem;
  opacity: 0.2;
  text-shadow: 0 0 2rem;
  pointer-events: none;
}

.c-modal-celestial-quote--teresa {
  color: var(--color-teresa--base);
  background-color: black;
  border-color: var(--color-teresa--base);
  box-shadow: 0 0 1rem var(--color-teresa--base), 0 0 1rem var(--color-teresa--base) inset;
}

.c-modal-celestial-quote--effarig {
  color: var(--color-effarig--base);
  background-color: black;
  border-color: var(--color-effarig--base);
  box-shadow: 0 0 1rem var(--color-effarig--base), 0 0 1rem var(--color-effarig--base) inset;
}

.c-modal-celestial-quote--enslaved {
  color: var(--color-enslaved--base);
  background-color: black;
  border-color: var(--color-enslaved--base);
  box-shadow: 0 0 1rem var(--color-enslaved--base), 0 0 1rem var(--color-enslaved--base) inset;
}

.c-modal-celestial-quote--v {
  color: var(--color-v--base);
  background-color: black;
  border-color: var(--color-v--base);
  box-shadow: 0 0 1rem var(--color-v--base), 0 0 1rem var(--color-v--base) inset;
}

.c-modal-celestial-quote--ra {
  color: var(--color-ra--base);
  background-color: black;
  border-color: var(--color-ra--base);
  box-shadow: 0 0 1rem var(--color-ra--base), 0 0 1rem var(--color-ra--base) inset;
}

.c-modal-celestial-quote--laitela {
  color: var(--color-laitela--accent);
  background-color: var(--color-laitela--base);
  border-color: var(--color-laitela--accent);
  box-shadow: 0 0 1rem var(--color-laitela--accent), 0 0 1rem var(--color-laitela--accent) inset;
}

.c-modal-celestial-quote--pelle {
  color: var(--color-pelle--base);
  background-color: black;
  border-color: var(--color-pelle--base);
  box-shadow: 0 0 1rem var(--color-pelle--base), 0 0 1rem var(--color-pelle--base) inset;
}

.c-modal-celestial-name {
  position: absolute;
  top: 1rem;
  right: 0;
  left: 0;
  font-weight: bold;
}

.c-modal-celestial-quote__arrow {
  font-size: 150%;
  margin: 0.5rem;
  cursor: pointer;
}

.c-modal-celestial-quote__end {
  position: absolute;
  bottom: 1.5rem;
  left: calc(50% - 1rem);
  font-size: 150%;
  cursor: pointer;
}

.l-modal-celestial-quote__text {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.l-modal-celestial-quote__buttons {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}
</style>
