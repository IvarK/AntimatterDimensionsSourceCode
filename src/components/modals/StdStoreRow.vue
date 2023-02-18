<script>
import { STEAM } from "@/env";
import { SteamRuntime } from "@/steam";
import Payments from "@/core/payments";

export default {
  name: "StdStoreRow",
  props: {
    amount: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  },
  methods: {
    purchase() {
      if (STEAM) {
        SteamRuntime.purchaseIAP(this.amount);
      } else {
        Payments.buyMoreSTD(this.amount, this.cost);
      }
    }
  },

};
</script>

<template>
  <div class="c-modal-store-btn-container">
    <div class="o-modal-store-label">
      {{ amount }} STDs
    </div>
    <button
      class="o-modal-store-btn"
      @click="purchase"
    >
      $<span>{{ cost }}</span>
    </button>
  </div>
</template>
