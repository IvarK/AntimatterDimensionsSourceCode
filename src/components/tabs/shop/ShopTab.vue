<script>
import ShopButton from "./ShopButton";

export default {
  name: "ShopTab",
  components: {
    ShopButton
  },
  data() {
    return {
      STD: 0,
      kongEnabled: false,
    };
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    },
    buySTDText() {
      return this.kongEnabled ? "Buy More" : "Play in Kongregate to buy STDs";
    }
  },
  methods: {
    update() {
      this.STD = player.IAP.totalSTD - player.IAP.spentSTD;
      this.kongEnabled = kong.enabled;
    },
    showStore() {
      if (!this.kongEnabled) return;
      Modal.shop.show();
    },
    buyTimeSkip() {
      kong.purchaseTimeSkip(10);
    },
    buyLongerTimeSkip() {
      kong.purchaseLongerTimeSkip(20);
    },
  },
};
</script>

<template>
  <div class="tab shop">
    <div class="c-shop-disclaimer">
      Disclaimer: These are not required to progress in the game, they are just for supporting the developer.
      The game is balanced without the use of any microtranactions.
    </div>
    <div class="c-shop-header">
      <span>You have {{ STD }}</span>
      <img
        src="images/std_coin.png"
        class="c-shop-header__img"
      >
      <button
        class="o-shop-button-button"
        @click="showStore()"
      >
        {{ buySTDText }}
      </button>
    </div>
    <div class="l-shop-buttons-container">
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
      />
      <div class="l-shop-buttons-container">
        <div class="o-shop-button-description">
          Get 6 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button
          class="o-shop-button-button"
          @click="buyTimeSkip()"
        >
          Cost: 10
          <img
            src="images/std_coin.png"
            class="c-shop-header__img"
          >
        </button>
      </div>
      <div class="l-shop-buttons-container">
        <div class="o-shop-button-description">
          Get 24 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button
          class="o-shop-button-button"
          @click="buyLongerTimeSkip()"
        >
          Cost: 20
          <img
            src="images/std_coin.png"
            class="c-shop-header__img"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.c-shop-disclaimer {
  color: black;
  background: var(--color-bad);
  width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 0.8rem;
}

.t-s1 .c-shop-disclaimer,
.t-s6 .c-shop-disclaimer,
.t-s10 .c-shop-disclaimer {
  color: var(--color-bad);
  background: black;
  border-color: var(--color-bad);
}

.c-shop-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.c-shop-header__img {
  height: 40px;
  margin: 0 1rem;
}

.o-shop-button-button {
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  display: flex;
  margin: auto;
  align-items: center;
  font-family: Typewriter;
  padding: 0.5rem 2rem;
  margin-top: 1rem;
  cursor: pointer;
}

.l-shop-buttons-container {
  display: flex;
  flex-wrap: wrap;
  width: 62rem;
  margin: auto;
}

.c-shop-header .o-shop-button-button {
  margin: 0;
}
</style>
