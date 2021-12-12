import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-close-button", {
  components: {
    PrimaryButton
  },
  template: `
    <PrimaryButton
      class="o-primary-btn--modal-close c-modal__close-btn"
      @click="emitClick"
    >
      &times;
    </PrimaryButton>`
});
