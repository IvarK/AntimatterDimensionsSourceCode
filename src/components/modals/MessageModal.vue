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
    isThemeS12() {
      return this.$viewModel.theme === "S12";
    }
  },
  created() {
    this.on$(GAME_EVENT.ENTER_PRESSED, this.handleClick);
  },
  methods: {
    update() {
      // Side effect of allowing message modals to be closed by EventHub triggers - this.modal seems to become
      // undefined for a brief moment as the event is being processed. This doesn't seem to have any adverse effects
      // beyond a console error, which this suppresses
      this.message = this.modal?.message;
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
      :class="isThemeS12 ? 'c-modal__close-btn' : 'c-modal__close-btn--tiny'"
      @click="emitClose"
    />
    <ModalCloseButton
      v-else-if="isThemeS12"
      class="c-modal__close-btn c-modal__close-btn--disabled"
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
    <div
      v-if="isThemeS12"
      class="c-modal__title"
    >
      Message
    </div>
  </div>
</template>
