"use strict";

Vue.component("shop-tab", {
  data() {
    return {
      STD: 0,
      IPMult: 0,
      EPMult: 0,
      dimMult: 0,
      allDimMult: 0
    };
  },
  methods: {
    update() {
      this.STD = player.IAP.totalSTD - player.IAP.spentSTD;
      this.IPMult = player.IAP.IPMult;
      this.EPMult = player.IAP.EPMult;
      this.dimMult = player.IAP.dimMult;
      this.allDimMult = player.IAP.allDimMult;
      
    },
    buyIP(cost) {
      kong.purchaseIP(cost);
    },
    buyEP(cost) {
      kong.purchaseEP(cost);
    },
    buyDimMult(cost) {
      kong.purchaseDimMult(cost);
    },
    buyAllDimMult(cost) {
      kong.purchaseAllDimMult(cost);
    },
    buyTimeSkip(cost) {
      kong.purchaseTimeSkip(cost);
    },
    getAdditiveNext(x, inc) {
      return (x === 1) ? x + inc - 1 : x + inc;
    },
    getNextAllDimMult() {
      if (this.allDimMult < 32) return this.allDimMult * 2;
      
      return this.allDimMult + 16;
    },
    showStore() {
      Modal.shop.show();
      this.$viewModel.modal.closeButton = true;
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
      <shop-button :cost="40" :buyFn="buyIP">
        Double your IP gain from all sources. (additive) 
        <br>Currently {{ IPMult }}x, next: {{ getAdditiveNext(IPMult, 2) }}x
      </shop-button>
      <shop-button :cost="50" :buyFn="buyEP">
        Triple your EP gain from all sources. (additive) 
        <br>Currently {{ EPMult }}x, next: {{ getAdditiveNext(EPMult, 3) }}x
      </shop-button>
      <shop-button :cost="30" :buyFn="buyDimMult">
        Double all your normal dimension multipliers (dimensions 1-8). Forever. 
        <br>Currently {{ shorten(dimMult) }}x, next: {{ shorten(dimMult*2, 2, 0) }}x
      </shop-button>
      <shop-button :cost="60" :buyFn="buyAllDimMult">
        Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. 
        <br>Currently {{ allDimMult }}x, next: {{ getNextAllDimMult() }}x
      </shop-button>
      <shop-button :cost="10" :buyFn="buyTimeSkip">
        Get 6 hours worth of offline production. (Doesn't work for autobuyers)
      </shop-button>
    </div>
    <span style="font-size: 12px"><b>
      Disclaimer: These are not required to progress in the game, they are just to help and support the developer.
    </b></span>
  </div>
  `
})