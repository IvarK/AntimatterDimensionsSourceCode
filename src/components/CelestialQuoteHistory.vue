<script>
export default {
  name: "CelestialQuoteHistory",
  props: {
    celestial: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShown: false
    };
  },
  computed: {
    color() {
      return this.celestial === "laitela" ? `var(--color-laitela--accent)` : `var(--color-${this.celestial}--base)`;
    },
    possessiveForm() {
      return Celestials[this.celestial].possessiveName;
    }
  },
  methods: {
    update() {
      this.isShown = Celestials[this.celestial].quotes.all.some(x => x.isUnlocked);
    },
    show() {
      Quote.showHistory(Celestials[this.celestial].quotes.all);
    },
  }
};
</script>

<template>
  <button
    v-if="isShown"
    class="c-celestial-quote-history--button"
    :style="{
      '--scoped-cel-color': color
    }"
    @click="show"
  >
    {{ possessiveForm }} Quotes
  </button>
</template>

<style scope>
.c-celestial-quote-history--button {
  align-self: center;
  font-family: Typewriter;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid var(--scoped-cel-color);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  transition: 0.2s;
  transition-property: color, background-color;
  cursor: pointer;
}

.c-celestial-quote-history--button:hover {
  color: var(--color-text-inverted);
  background-color: var(--scoped-cel-color);
}
</style>
