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
  padding: 1rem;
  border: .2rem solid #1f7d1f;
  border-radius: .5rem;
  margin: .5rem;
  background: #3c3c3c;
  color: white;
}

.o-shop-button-button {
  background: turquoise;
  border: none;
  border-radius: .5rem;
  display: flex;
  margin: auto;
  align-items: center;
  font-family: Typewriter;
  padding: .5rem 2rem;
  margin-top: 1rem;
  cursor: pointer;
}

.o-shop-button-button__img {
  margin-left: 1rem;
  height: 40px;
}

.o-shop-button-multiplier {
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0.5rem 0;
  display: block;
}
</style>