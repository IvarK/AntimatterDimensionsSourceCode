<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "ModalWrapperChoice",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  props: {
    cancelClass: {
      type: String,
      required: false,
      default: "o-primary-btn--width-medium c-modal-message__okay-btn"
    },
    confirmClass: {
      type: String,
      required: false,
      default: "o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
    },
    showCancel: {
      type: Boolean,
      required: false,
      default: true
    },
    showConfirm: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  created() {
    this.on$(GAME_EVENT.ENTER_PRESSED, this.doConfirm);
  },
  methods: {
    doConfirm() {
      this.$emit("confirm");
      this.emitClose();
    },
    doCancel() {
      this.$emit("cancel");
      this.emitClose();
    },
  }
};
</script>

<template>
  <ModalWrapper
    class="c-modal-message l-modal-content--centered"
    @close="emitClose"
  >
    <template #header>
      <slot name="header" />
    </template>

    <slot />

    <div class="l-options-grid__row">
      <PrimaryButton
        v-if="showCancel"
        :class="cancelClass"
        @click="doCancel"
      >
        <slot name="cancel-text">
          Cancel
        </slot>
      </PrimaryButton>

      <PrimaryButton
        v-if="showConfirm"
        :class="confirmClass"
        @click="doConfirm"
      >
        <slot name="confirm-text">
          Confirm
        </slot>
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>
