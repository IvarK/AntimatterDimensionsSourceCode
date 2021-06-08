"use strict";

Vue.component("modal-std-store", {
  computed: {
    modal() {
      return this.$viewModel.modal;
    }
  },
  methods: {
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    }
  },
  template:
    `<div class="l-modal-content--centered">
      <modal-close-button v-if="modal.closeButton" class="c-modal__close-btn" @click="emitClose"/>
      <h2>Support The Developer -coins</h2>
      <div class="l-modal-store-content">
        <img src="images/std_coin.png"/>
        <div class="c-modal-store-buttons">
          <std-store-btn-row :amount="20" :cost="20"/>
          <std-store-btn-row :amount="60" :cost="50"/>
          <std-store-btn-row :amount="140" :cost="100"/>
          <std-store-btn-row :amount="300" :cost="200"/>
          <std-store-btn-row :amount="1000" :cost="500"/>
        </div>
      </div>
    </div>`
});

Vue.component("std-store-btn-row", {
  props: {
    amount: Number,
    cost: Number
  },
  methods: {
    purchase() {
      kong.buyMoreSTD(this.amount, this.cost);
    }
  },
  template:
    `<div class="c-modal-store-btn-container">
      <div class="o-modal-store-label">{{ amount }} STDs</div>
      <button class="o-modal-store-btn" @click="purchase()">
        <span>{{ cost }}</span><img src="images/kred_single.png"/>
      </button>
    </div>`
});
