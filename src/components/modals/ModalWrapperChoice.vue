<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalConfirmationCheck from "@/components/modals/ModalConfirmationCheck";

export default {
  name: "ModalWrapperChoice",
  components: {
    PrimaryButton,
    ModalConfirmationCheck,
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
    option: {
      type: String,
      required: false,
      default: undefined
    }
  },
  created() {
    this.on$(GAME_EVENT.ENTER_PRESSED, this.doConfirm);
  },
  methods: {
    doConfirm() {
      this.$emit("confirm");
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    doCancel() {
      this.$emit("cancel");
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
  }
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <span class="c-modal__title">
      <slot name="header" />
    </span>

    <slot />

    <div class="l-modal-buttons">
      <PrimaryButton
        v-if="showCancel"
        :class="cancelClass"
        @click="doCancel"
      >
        <slot name="cancel-text">
          Cancel
        </slot>
      </PrimaryButton>

      <slot name="extra-buttons" />

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

    <ModalConfirmationCheck
      v-if="option"
      :option="option"
    />
  </div>
</template>
