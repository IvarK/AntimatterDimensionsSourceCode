<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import PrimaryButton from "@/components/PrimaryButton";

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
  created() {
    this.on$(GAME_EVENT.ENTER_PRESSED, this.handleClick);
  },
  methods: {
    update() {
      this.message = this.modal.message;
    },
    handleClick() {
      this.modal.callback?.();
      this.emitClose();
      EventHub.ui.offAll(this);
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
