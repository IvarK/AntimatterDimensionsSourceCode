<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapper,
    ModalWrapperChoice
  },
  data() {
    return {
      input: "",
      isEnd: false
    };
  },
  computed: {
    willHardReset() {
      return this.input === "Shrek is love, Shrek is life";
    },
  },
  methods: {
    update() {
      this.isEnd = Pelle.endState >= 1;
    },
    hardReset() {
      if (!this.willHardReset) return;
      GameStorage.hardReset();
    },
  },
};
</script>

<template>
  <ModalWrapper v-if="isEnd">
    You cannot reset your save while the game is ending!
  </ModalWrapper>
  <ModalWrapperChoice
    v-else
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
      @keyup.esc="emitClose"
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
    <template #confirm-text>
      HARD RESET
    </template>
  </ModalWrapperChoice>
</template>
