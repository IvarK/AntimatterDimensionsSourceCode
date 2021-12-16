<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import ModalStdStoreRow from "@/components/modals/ModalStdStoreRow";

export default {
  components: {
    ModalCloseButton,
    ModalStdStoreRow
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
        <ModalStdStoreRow
          :amount="20"
          :cost="20"
        />
        <ModalStdStoreRow
          :amount="60"
          :cost="50"
        />
        <ModalStdStoreRow
          :amount="140"
          :cost="100"
        />
        <ModalStdStoreRow
          :amount="300"
          :cost="200"
        />
        <ModalStdStoreRow
          :amount="1000"
          :cost="500"
        />
      </div>
    </div>
  </div>
</template>
