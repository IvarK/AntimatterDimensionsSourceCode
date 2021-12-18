import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-message", {
  components: {
    PrimaryButton
  },
  data: () => ({
    message: ""
  }),
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  methods: {
    update() {
      this.message = this.modal.message;
    },
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <modal-close-button v-if="modal.closeButton" class="c-modal__close-btn--tiny" @click="emitClose" />
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
    </div>`
});
