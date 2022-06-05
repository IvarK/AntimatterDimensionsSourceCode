<script>
export default {
  name: "CelestialQuoteBackground",
  props: {
    celestialSymbol: {
      type: String,
      required: true
    },
    celestial: {
      type: String,
      required: true
    },
    primary: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    modalClass() {
      return {
        "l-modal-celestial-quote": true,
        [`c-modal-celestial-quote--${this.celestial}`]: true,
        [`c-modal-celestial-quote-primary--${this.celestial}`]: this.primary,
      };
    }
  },
};
</script>

<template>
  <div :class="modalClass">
    <span
      class="c-modal-cestial-quote__symbol"
      v-html="celestialSymbol"
    />
    <slot />
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
  border-radius: var(--var-border-radius, 1rem);
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
  box-shadow: 0 0 1rem var(--color-teresa--base), 0 0 1rem var(--color-teresa--base) inset;
}

.c-modal-celestial-quote-primary--teresa {
  border-color: var(--color-teresa--base);
}

.c-modal-celestial-quote--effarig {
  color: var(--color-effarig--base);
  background-color: black;
  box-shadow: 0 0 1rem var(--color-effarig--base), 0 0 1rem var(--color-effarig--base) inset;
}

.c-modal-celestial-quote-primary--effarig {
  border-color: var(--color-effarig--base);
}

.c-modal-celestial-quote--enslaved {
  color: var(--color-enslaved--base);
  background-color: black;
  box-shadow: 0 0 1rem var(--color-enslaved--base), 0 0 1rem var(--color-enslaved--base) inset;
}

.c-modal-celestial-quote-primary--enslaved {
  border-color: var(--color-enslaved--base);
}

.c-modal-celestial-quote--v {
  color: var(--color-v--base);
  background-color: black;
  box-shadow: 0 0 1rem var(--color-v--base), 0 0 1rem var(--color-v--base) inset;
}

.c-modal-celestial-quote-primary--v {
  border-color: var(--color-v--base);
}

.c-modal-celestial-quote--ra {
  color: var(--color-ra--base);
  background-color: black;
  box-shadow: 0 0 1rem var(--color-ra--base), 0 0 1rem var(--color-ra--base) inset;
}

.c-modal-celestial-quote-primary--ra {
  border-color: var(--color-ra--base);
}

.c-modal-celestial-quote--laitela {
  color: var(--color-laitela--accent);
  background-color: var(--color-laitela--base);
  box-shadow: 0 0 1rem var(--color-laitela--accent), 0 0 1rem var(--color-laitela--accent) inset;
}

.c-modal-celestial-quote-primary--laitela {
  border-color: var(--color-laitela--accent);
}

.c-modal-celestial-quote--pelle {
  color: var(--color-pelle--base);
  background-color: black;
  box-shadow: 0 0 1rem var(--color-pelle--base), 0 0 1rem var(--color-pelle--base) inset;
}

.c-modal-celestial-quote-primary--pelle {
  border-color: var(--color-pelle--base);
}
</style>
