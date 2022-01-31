<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapperChoice,
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
    hardReset() {
      if (!this.willHardReset) return;
      GameStorage.hardReset();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!willHardReset"
    :show-confirm="willHardReset"
    confirm-class="o-primary-btn--width-medium c-modal__confirm-btn c-modal-hard-reset-btn"
    @confirm="hardReset"
  >
    <template #header>
      HARD RESET
    </template>
    <div class="c-modal-message__text">
      Please confirm your desire to hard reset this save slot.
      <span class="c-modal-hard-reset-danger">This is irreversible and you will get no benefit.</span>
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
      @keyup.esc="emitClose"
    >
    <div class="c-modal-hard-reset-info">
      <div
        v-if="willHardReset"
        class="c-modal-hard-reset-danger"
      >
        You do not get anything from hard resetting your save.
      </div>
      <div v-else>
        Type in the correct code to hard reset.
      </div>
    </div>
    <template #confirm-text>
      HARD RESET
    </template>
  </ModalWrapperChoice>
</template>
