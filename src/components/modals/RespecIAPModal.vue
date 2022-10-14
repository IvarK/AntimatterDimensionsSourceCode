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
        if (purchase.config.singleUse) continue;
        std += purchase.purchases * purchase.cost;
      }
      return std;
    },
    handleYesClick() {
      ShopPurchase.respecAll();
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
      > you spent on all non-offline progress purchases.
      <!-- TODO: Should it cost any coins? -->
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
</style>
