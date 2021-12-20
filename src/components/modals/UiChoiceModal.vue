<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "UiChoiceModal",
  components: {
    PrimaryButton
  },
  methods: {
    handleYesClick() {
      this.emitClose();
      GameOptions.toggleUI();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <div class="c-modal-message__text">
      We noticed that you've loaded an old save, would you like to swap to the new UI?
      (you can change this at any time in the options tab)
    </div>
    <div class="l-options-grid__row">
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >
        Remain
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >
        Swap
      </PrimaryButton>
    </div>
  </div>
</template>
