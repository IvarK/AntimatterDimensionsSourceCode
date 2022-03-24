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
  <div
    id="shop"
    class="tab"
  >
    <div class="shop-disclaimer">
      Disclaimer: These are not required to progress in the game, they are just for supporting the developer.
      The game is balanced without the use of any microtranactions.
    </div>
    <div class="shop-header">
      <span>You have {{ STD }}</span>
      <img
        src="images/std_coin.png"
        height="40"
      >
      <button
        class="shop-button-button"
        @click="showStore()"
      >
        {{ buySTDText }}
      </button>
    </div>
    <div class="shop-buttons-container">
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
      />
      <div class="shop-buttons-container">
        <div class="o-shop-button-description">
          Get 6 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button
          class="shop-button-button"
          @click="buyTimeSkip()"
        >
          Cost: 10 <img
            src="images/std_coin.png"
            height="40"
          >
        </button>
      </div>
      <div class="shop-buttons-container">
        <div class="o-shop-button-description">
          Get 24 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button
          class="shop-button-button"
          @click="buyLongerTimeSkip()"
        >
          Cost: 20 <img
            src="images/std_coin.png"
            height="40"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.shop-disclaimer {
  color: black;
  background: var(--color-bad);
  width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  border: 0.2rem solid black;
  border-radius: 1rem;
  margin-top: 0.8rem;
}

.s-base--metro .shop-disclaimer {
  border-width: 0.1rem;
  border-radius: 0;
}

.t-s1 .shop-disclaimer,
.t-s6 .shop-disclaimer,
.t-s10 .shop-disclaimer {
  color: var(--color-bad);
  background: black;
  border-color: var(--color-bad);
}

.shop-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.shop-header img {
  margin: 0 1rem;
}

.shop-button-button {
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

.shop-buttons-container {
  display: flex;
  flex-wrap: wrap;
  width: 62rem;
  margin: auto;
}

.shop-header .shop-button-button {
  margin: 0;
}
</style>