"use strict";

Vue.component("shop-button", {
  props: {
    purchase: Object,
  },
  template:
  `<div class="c-shop-button-container">
    <div class="o-shop-button-description">
      {{ purchase.description }}
      <br>Currently {{ purchase.currentMult }}x, next: {{ purchase.nextMult }}x
    </div>
    <button 
      @click="purchase.purchase()" 
      class="o-shop-button-button">Cost: {{ purchase.cost }} <img src="images/std_coin.png" height="40"></button>
  </div>
  `
});