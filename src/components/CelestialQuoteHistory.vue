<script>
export default {
  name: "CelestialQuoteHistory",
  props: {
    celestial: {
      type: String,
      required: true
    }
  },
  computed: {
    borderColor() {
      return this.celestial === "laitela" ? `var(--color-laitela--accent)` : `var(--color-${this.celestial}--base)`;
    }
  },
  methods: {
    show() {
      Modal.celestialQuoteHistory.show(Celestials[this.celestial].quotes.all);
    },
  }
};
</script>

<template>
  <button
    class="c-celestial-quote-history--button"
    :style="{
      'border-color': borderColor
    }"
    @click="show"
  >
    {{ celestial.capitalize() }}'s Dialogue
  </button>
</template>

<style scope>
.c-celestial-quote-history--button {
  width: fit-content;
  align-self: center;
  font-family: Typewriter;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
