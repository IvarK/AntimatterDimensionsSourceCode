Vue.component("shop-button", {
  props: {
    purchase: Object,
  },
  data() {
    return {
      currentMult: 0,
      nextMult: 0
    };
  },
  methods: {
    update() {
      this.currentMult = this.purchase.currentMult;
      this.nextMult = this.purchase.nextMult;
    }
  },
  template: `
    <div class="c-shop-button-container">
      <div class="o-shop-button-description">
        {{ purchase.description }}
        <br>
        <span class="o-shop-button-multiplier">
          Currently {{ formatX(currentMult, 2, 0) }}, next: {{ formatX(nextMult, 2, 0) }}
        </span>
      </div>
      <button
        @click="purchase.purchase()"
        class="o-shop-button-button"
      >
        Cost: {{ purchase.cost }}
        <img src="images/std_coin.png" height="40">
      </button>
    </div>`
});
