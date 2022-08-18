<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "ImportFileWarningModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton,
    SaveInfoEntry
  },
  props: {
    rawInput: {
      type: String,
      required: true
    },
    saveToImport: {
      type: Object,
      required: true
    },
    warningMessage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      importCounter: 0,
    };
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    clicksLeft() {
      return 5 - this.importCounter;
    }
  },
  methods: {
    handleClick() {
      if (this.clicksLeft > 0) {
        this.importCounter++;
      } else {
        this.emitClose();
        GameStorage.import(this.rawInput);
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice :show-confirm="false">
    <template #header>
      Possible Import Conflict
    </template>
    <div class="c-modal-message__text">
      You may not necessarily want to proceed with importing in this case due to STD purchases.
    </div>
    <br>
    <SaveInfoEntry
      :save-data="conflict.importingSave"
      save-type="Save to Import"
    />
    <br>
    <SaveInfoEntry
      :save-data="conflict.currentSave"
      save-type="Current Save"
    />
    <span class="c-modal-IAP__warning">
      {{ warningMessage }}
    </span>
    Do you still wish to import this save? Your purchased
    <br>
    STDs will not carry over to the imported save.
    <template #cancel-text>
      Keep Current
    </template>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="handleClick"
    >
      Import <span v-if="clicksLeft">({{ clicksLeft }})</span>
    </PrimaryButton>
  </ModalWrapperChoice>
</template>
