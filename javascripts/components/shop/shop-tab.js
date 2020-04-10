"use strict";

Vue.component("shop-tab", {
  data() {
    return {
      STD: 0,
    };
  },
  methods: {
    update() {
      this.STD = player.IAP.totalSTD - player.IAP.spentSTD;
    },
    showStore() {
      Modal.shop.show();
      this.$viewModel.modal.closeButton = true;
    },
    buyTimeSkip() {
      kong.purchaseTimeSkip();
    }
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    }
  },
  template: 
  `<div id="shop" class="tab">
    <div class="c-shop-header">
      <span>You have {{ STD }}</span>
      <img src="images/std_coin.png" height="40">
      <button class="o-shop-buy-more" @click="showStore()">Buy More</button>
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
    </div>
    <span style="font-size: 12px"><b>
      Disclaimer: These are not required to progress in the game, they are just to help and support the developer.
    </b></span>
  </div>
  `
});