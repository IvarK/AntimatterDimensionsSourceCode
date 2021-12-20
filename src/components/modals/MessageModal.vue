<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "MessageModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
      message: ""
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
  },
  methods: {
    update() {
      this.message = this.modal.message;
    },
    handleClick() {
      this.modal.callback?.();
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <ModalCloseButton
      v-if="modal.closeButton"
      class="c-modal__close-btn--tiny"
      @click="emitClose"
    />
    <div
      class="c-modal-message__text"
      v-html="message"
    />
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="handleClick"
    >
      Okay
    </PrimaryButton>
  </div>
</template>
