<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import StdStoreRow from "@/components/modals/StdStoreRow";

export default {
  name: "StdStoreModal",
  components: {
    ModalCloseButton,
    StdStoreRow
  },
};
</script>

<template>
  <div class="l-modal-content--centered">
    <ModalCloseButton
      class="c-modal__close-btn"
      @click="emitClose"
    />
    <h2>Support The Developer -coins</h2>
    <div class="l-modal-store-content">
      <img src="images/std_coin.png">
      <div class="c-modal-store-buttons">
        <StdStoreRow
          :amount="20"
          :cost="20"
        />
        <StdStoreRow
          :amount="60"
          :cost="50"
        />
        <StdStoreRow
          :amount="140"
          :cost="100"
        />
        <StdStoreRow
          :amount="300"
          :cost="200"
        />
        <StdStoreRow
          :amount="1000"
          :cost="500"
        />
      </div>
    </div>
  </div>
</template>
