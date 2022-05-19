<script>
export default {
  name: "ShopButton",
  props: {
    purchase: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentMult: 0,
      nextMult: 0
    };
  },
  methods: {
    update() {
      this.currentMult = this.purchase.currentMult;
      this.nextMult = this.purchase.nextMult;
    }
  },
};
</script>

<template>
  <div class="c-shop-button-container">
    <div class="o-shop-button-description">
      {{ purchase.description }}
      <br>
      <span class="o-shop-button-multiplier">
        Currently {{ formatX(currentMult, 2, 0) }}, next: {{ formatX(nextMult, 2, 0) }}
      </span>
    </div>
    <button
      class="o-shop-button-button"
      @click="purchase.purchase()"
    >
      Cost: {{ purchase.cost }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      >
    </button>
  </div>
</template>

<style scoped>
.c-shop-button-container {
  width: 30rem;
  color: white;
  background: #3c3c3c;
  border: var(--var-border-width, 0.2rem) solid #1f7d1f;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0.5rem;
  padding: 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: auto;
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button__img {
  height: 40px;
  margin-left: 1rem;
}

.o-shop-button-multiplier {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}
</style>
