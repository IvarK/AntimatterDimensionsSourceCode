<script>
export default {
  name: "CelestialQuoteBackground",
  props: {
    celestialSymbols: {
      // Array elements are String
      type: Array,
      required: true
    },
    celestials: {
      // Array elements are [String, Number]
      type: Array,
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
      };
    },
  },
  methods: {
    styleObject(celEntry, opac, isText) {
      const baseCol = `var(--color-${celEntry[0]}--base)`;
      if (celEntry[0] === "laitela") {
        return {
          color: `var(--color-${celEntry[0]}--accent)`,
          background: isText ? undefined : baseCol,
          opacity: opac * celEntry[1]
        };
      }
      return {
        color: baseCol,
        opacity: opac * celEntry[1]
      };
    },
  },
};
</script>

<template>
  <div :class="modalClass">
    <span
      v-for="(celestial, index) in celestials"
      :key="index"
      class="c-modal-celestial-quote c-modal-celestial-quote__symbol"
      :style="styleObject(celestial, 0.2, true)"
      v-html="celestialSymbols[index]"
    />
    <span
      v-for="(celestial, index) in celestials"
      :key="index + 10"
      class="c-modal-celestial-quote c-modal-celestial-quote__shadow"
      :style="styleObject(celestial, 1, false)"
    />
    <span
      v-for="(celestial, index) in celestials"
      :key="index + 20"
      class="c-modal-celestial-quote c-modal-celestial-quote__text"
      :style="styleObject(celestial, 1, true)"
    >
      <slot />
    </span>
  </div>
</template>

<style scoped>
.l-modal-celestial-quote {
  display: flex;
  flex-direction: row;
  width: 30rem;
  height: 30rem;
  position: absolute;
  /* stylelint-disable-next-line unit-allowed-list */
  top: 50vh;
  /* stylelint-disable-next-line unit-allowed-list */
  left: 50vw;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--var-border-radius, 1rem);
  transform: translate(-50%, -50%);
  background-color: black;
}

.c-modal-celestial-quote {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: var(--var-border-radius, 1rem);
}

.c-modal-celestial-quote__symbol {
  z-index: 1;
  font-size: 25rem;
  text-shadow: 0 0 2rem;
}

.c-modal-celestial-quote__shadow {
  box-shadow: 0 0 1.5rem 0.1rem, 0 0 1rem 0.1rem inset;
}

.s-base--metro .c-modal-celestial-quote__shadow {
  box-shadow: 0 0 1rem 0.2rem, 0 0 1rem 0.1rem inset
}

.c-modal-celestial-quote__text {
  z-index: 2;
  padding: 5rem;
}
</style>
