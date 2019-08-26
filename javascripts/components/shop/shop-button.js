"use strict";

Vue.component("shop-button", {
  props: {
    cost: Number,
    type: String,
    buyFn: Function
  },
  template:
  `<div class="c-shop-button-container">
    <div class="o-shop-button-description"><slot></slot></div>
    <button 
      @click="buyFn(type, cost)" 
      class="o-shop-button-button">Cost: {{ cost }} <img src="images/std_coin.png" height="40"></button>
  </div>
  `
});