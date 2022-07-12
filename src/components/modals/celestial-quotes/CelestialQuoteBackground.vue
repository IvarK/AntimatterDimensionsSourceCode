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
        "c-modal-celestial-quote": true,
        [`c-modal-celestial-quote--${this.celestial}`]: true,
        "c-modal-celestial-quote-primary": this.primary,
      };
    }
  },
};
</script>

<template>
  <div :class="modalClass">
    <span
      class="c-modal-celestial-quote__symbol"
      v-html="celestialSymbol"
    />
    <slot />
  </div>
</template>

<style scoped>
.l-modal-celestial-quote {
  --scoped-quote-color: var(--color-text);
  --scoped-quote-background: black;

  display: flex;
  flex-direction: row;
  width: 30rem;
  height: 30rem;
  position: absolute;
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

.c-modal-celestial-quote--teresa {
  --scoped-quote-color: var(--color-teresa--base);
}

.c-modal-celestial-quote--effarig {
  --scoped-quote-color: var(--color-effarig--base);
}

.c-modal-celestial-quote--enslaved {
  --scoped-quote-color: var(--color-enslaved--base);
}

.c-modal-celestial-quote--v {
  --scoped-quote-color: var(--color-v--base);
}

.c-modal-celestial-quote--ra {
  --scoped-quote-color: var(--color-ra--base);
}

.c-modal-celestial-quote--laitela {
  --scoped-quote-color: var(--color-laitela--accent);
  --scoped-quote-background: var(--color-laitela--base);
}

.c-modal-celestial-quote--pelle {
  --scoped-quote-color: var(--color-pelle--base);
}

.c-modal-celestial-quote {
  color: var(--scoped-quote-color);
  background-color: var(--scoped-quote-background);
}

.c-modal-celestial-quote-primary {
  box-shadow: 0 0 1.5rem 0.1rem var(--scoped-quote-color), 0 0 1rem 0.1rem var(--scoped-quote-color) inset;
}

.s-base--metro .c-modal-celestial-quote-primary {
  box-shadow: 0 0 1rem 0.2rem var(--scoped-quote-color), 0 0 1rem 0.1rem var(--scoped-quote-color) inset
}

.c-modal-celestial-quote__symbol {
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
</style>
