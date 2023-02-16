<script>
import { SteamRuntime } from "@/steam";
import Payments from "../../../javascripts/core/payments";

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
      SteamRuntime.purchaseIap(this.amount);
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
