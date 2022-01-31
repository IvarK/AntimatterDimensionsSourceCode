<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UiChoiceModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    handleYesClick() {
      GameOptions.toggleUI();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Swap to Modern UI
    </template>
    <div class="c-modal-message__text">
      We noticed that you've loaded an old save, would you like to swap to the Modern UI?
      (you can change back to Classic at any time in the Visual Options tab)
    </div>
    <template #cancel-text>
      Remain
    </template>
    <template #confirm-text>
      Swap
    </template>
  </ModalWrapperChoice>
</template>
