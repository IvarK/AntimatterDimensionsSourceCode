<script>
import "vue-loading-overlay/dist/vue-loading.css";

import Loading from "vue-loading-overlay";

import Payments from "../../../../javascripts/core/payments";

import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

import ShopButton from "./ShopButton";

export default {
  name: "ShopTab",
  components: {
    ShopButton,
    Loading,
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      STD: 0,
      isLoading: false,
      IAPsDisabled: false,
    };
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    },
    buySTDText() {
      return "Buy More";
    }
  },
  watch: {
    IAPsDisabled(newValue) {
      player.IAP.disabled = newValue;
    }
  },
  methods: {
    update() {
      this.STD = player.IAP.totalSTD - player.IAP.spentSTD;
      this.isLoading = Boolean(player.IAP.checkoutSession.id);
      this.IAPsDisabled = player.IAP.disabled;
    },
    showStore() {
      SecretAchievement(33).unlock();
      Modal.shop.show();
    },
    onCancel() {
      Payments.cancelPurchase();
    },
    respecAll() {
      ShopPurchase.respecAll();
    }
  },
};
</script>

<template>
  <div class="tab shop">
    <div class="c-shop-disclaimer">
      Disclaimer: These are not required to progress in the game, they are just for supporting the developer.
      The game is balanced without the use of any microtransactions.
    </div>
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="IAPsDisabled"
        class="o-primary-btn--subtab-option"
        label="Disable in-app-purchases:"
      />
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="respecAll()"
      >
        Respec Shop
      </PrimaryButton>
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
    </div>
    <loading
      :active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
    />
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
  width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: black;
  background: var(--color-bad);
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
