"use strict";

Vue.component("shop-button", {
  props: {
    purchase: Object,
  },
  data() {
    return {
      currentMult: 0,
      nextMult: 0
    }
  },
  methods: {
    update() {
      this.currentMult = this.purchase.currentMult;
      this.nextMult = this.purchase.nextMult;
    }
  },
  template:
  `<div class="c-shop-button-container">
    <div class="o-shop-button-description">
      {{ purchase.description }}
      <br>Currently {{ currentMult }}x, next: {{ nextMult }}x
    </div>
    <button 
      @click="purchase.purchase()" 
      class="o-shop-button-button">Cost: {{ purchase.cost }} <img src="images/std_coin.png" height="40"></button>
  </div>
  `
});