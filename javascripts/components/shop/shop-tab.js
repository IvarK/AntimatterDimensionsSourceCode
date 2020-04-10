"use strict";

Vue.component("shop-tab", {
  data() {
    return {
      STD: 0,
      kongEnabled: false,
    };
  },
  methods: {
    update() {
      this.STD = player.IAP.totalSTD - player.IAP.spentSTD;
      this.kongEnabled = kong.enabled;
    },
    showStore() {
      if (!this.kongEnabled) return;
      Modal.shop.show();
      this.$viewModel.modal.closeButton = true;
    },
    buyTimeSkip() {
      kong.purchaseTimeSkip(10);
    },
    buyLongerTimeSkip() {
      kong.purchaseLongerTimeSkip(20);
    },
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    },
    buySTDText() {
      return this.kongEnabled ? "Buy More" : "Play in Kongregate to buy STDs";
    }
  },
  template: 
  `<div id="shop" class="tab">
    <div class="c-shop-header">
      <span>You have {{ STD }}</span>
      <img src="images/std_coin.png" height="40">
      <button class="o-shop-button-button" @click="showStore()">{{ buySTDText }}</button>
    </div>
    <div class="l-shop-buttons-container">
      <shop-button v-for="purchase in purchases" :purchase="purchase" :key="purchase.key"></shop-button>
      <div class="c-shop-button-container">
        <div class="o-shop-button-description">
          Get 6 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button 
          @click="buyTimeSkip()" 
          class="o-shop-button-button">Cost: 10 <img src="images/std_coin.png" height="40"></button>
      </div>
      <div class="c-shop-button-container">
        <div class="o-shop-button-description">
          Get 24 hours worth of offline production. (Autobuyers don't work full speed)
        </div>
        <button 
          @click="buyLongerTimeSkip()" 
          class="o-shop-button-button">Cost: 20 <img src="images/std_coin.png" height="40"></button>
      </div>
    </div>
    <span style="font-size: 12px"><b>
      Disclaimer: These are not required to progress in the game, they are just to help and support the developer.
    </b></span>
  </div>
  `
});