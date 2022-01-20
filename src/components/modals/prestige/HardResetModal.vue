<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "HardResetModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
      input: "",
    };
  },
  computed: {
    willHardReset() {
      return this.input === "Shrek is love, Shrek is life";
    },
  },
  methods: {
    cancelReset() {
      this.emitClose();
    },
    hardReset() {
      if (!this.willHardReset) return;
      this.emitClose();
      GameStorage.hardReset();
    },
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <ModalCloseButton @click="cancelReset" />
    <h3>HARD RESET</h3>
    <div class="c-modal-message__text">
      Please confirm your desire to hard reset this save slot.
      <span class="c-modal-hard-reset-danger">Deleting your save will not unlock anything secret.</span>
      Type in "Shrek is love, Shrek is life" to confirm.
      <div class="c-modal-hard-reset-danger">
        THIS WILL WIPE YOUR SAVE.
      </div>
    </div>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-hard-reset__input"
      @keyup.esc="cancelReset"
    >
    <div class="c-modal-hard-reset-info">
      <div
        v-if="willHardReset"
        class="c-modal-hard-reset-danger"
      >
        Phrase confirmed - continuing will irreversibly delete your save!
      </div>
      <div v-else>
        Type in the correct phrase to hard reset.
      </div>
    </div>
    <PrimaryButton
      v-if="!willHardReset"
      class="o-primary-btn--width-medium c-modal-hard-reset-btn"
      @click="cancelReset"
    >
      Cancel
    </PrimaryButton>
    <PrimaryButton
      v-else
      class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
      @click="hardReset"
    >
      HARD RESET
    </PrimaryButton>
  </div>
</template>
