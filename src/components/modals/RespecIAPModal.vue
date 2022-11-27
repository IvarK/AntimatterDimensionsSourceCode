<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RespecIAPModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    returnedSTDCount() {
      let std = 0;
      for (const purchase of ShopPurchase.all) {
        if (purchase.config.instantPurchase) continue;
        std += purchase.purchases * purchase.cost;
      }
      return std;
    },
    handleYesClick() {
      ShopPurchaseData.respecAll();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="respecIAP"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to respec your Shop Purchases
    </template>
    <div class="c-modal-message__text">
      Are you sure you want to respec your Shop Purchases? This will not cost anything and
      return the {{ returnedSTDCount() }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      > you spent on all purchases which give permanent multipliers.
      <br>
      <br>
      Anything spent on offline progress and Glyph cosmetics will not be refunded. Glyph cosmetic sets are
      permanent and will not be lost or respeced once purchased.
      <br>
      <br>
      <b class="o-warning">You will not be able to respec again unless you purchase more STD coins.</b>
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-modal-message__text {
  vertical-align: middle;
}

.o-shop-button-button__img {
  height: 2.5rem;
  vertical-align: middle;
}

.o-warning {
  color: var(--color-infinity);
}
</style>
