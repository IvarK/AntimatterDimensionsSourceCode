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
      availableSTD: 0,
      spentSTD: 0,
      isLoading: false,
      exportIAP: false,
      IAPsDisabled: false,
      creditsClosed: false,
      loggedIn: false,
      username: "",
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
    exportIAP(newValue) {
      player.IAP.exportSTD = newValue;
    },
    IAPsDisabled(newValue) {
      if (!newValue && this.spentSTD > 0) Speedrun.setSTDUse(true);
      player.IAP.disabled = newValue;
    }
  },
  methods: {
    update() {
      this.availableSTD = player.IAP.totalSTD - player.IAP.spentSTD;
      this.spentSTD = player.IAP.spentSTD;
      this.isLoading = Boolean(player.IAP.checkoutSession.id);
      this.exportIAP = player.IAP.exportSTD;
      this.IAPsDisabled = player.IAP.disabled;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.loggedIn = Cloud.loggedIn;
      this.username = Cloud.user.displayName;
    },
    showStore() {
      if (this.creditsClosed) return;
      SecretAchievement(33).unlock();
      Modal.shop.show();
    },
    onCancel() {
      Payments.cancelPurchase();
    },
    respec() {
      if (this.creditsClosed) return;
      ShopPurchase.respecRequest();
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
        v-model="exportIAP"
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        label="Include IAP in export:"
      />
      <PrimaryToggleButton
        v-model="IAPsDisabled"
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        label="Disable in-app-purchases:"
      />
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        @click="respec()"
      >
        Respec Shop
      </PrimaryButton>
    </div>
    <div
      v-if="loggedIn"
      class="c-login-info"
    >
      You are logged in as {{ username }}.
      <button
        class="o-shop-button-button"
        onclick="GameOptions.logout()"
      >
        Disconnect Google Account
      </button>
    </div>
    <div
      v-else
      class="c-login-info"
    >
      You must be logged in to purchase STD coins.
      <button
        class="o-shop-button-button"
        onclick="GameOptions.login()"
      >
        Login with Google
      </button>
    </div>
    <div class="c-shop-header">
      <span>You have {{ availableSTD }}</span>
      <img
        src="images/std_coin.png"
        class="c-shop-header__img"
      >
      <button
        class="o-shop-button-button"
        :class="{ 'o-shop-button-button--disabled': !loggedIn }"
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
        :iap-disabled="IAPsDisabled"
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
  width: 80%;
  max-width: 100rem;
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

.c-login-info {
  font-size: 1.5rem;
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

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
  pointer-events: none;
}

.l-shop-buttons-container {
  display: flex;
  flex-wrap: wrap;
  width: 93rem;
  margin: auto;
}

.c-shop-header .o-shop-button-button {
  margin: 0;
}
</style>
