<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CloudInvalidDataModal",
  components: {
    ModalWrapperChoice,
  },
  props: {
    isSaving: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    overwriteText() {
      return this.isSaving
        ? "Overwrite Cloud Save"
        : "Load save from Cloud";
    }
  },
  methods: {
    ignore() {
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    overwrite() {
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :cancel-fn="overwrite"
    @confirm="ignore()"
  >
    <template #header>
      Could not compare with Cloud Save
    </template>
    While attempting to compare your saves, the game was unable to properly process the data in your
    Cloud save. This is most likely due to the Cloud save being very outdated, using a data
    format from a much older version of the game.
    <br>
    <br>
    <span v-if="isSaving">
      It is probably safe to overwrite your Cloud save. Otherwise, this modal will keep reappearing
      every 5 minutes unless you change your Cloud saving settings.
    </span>
    <span v-else>
      You can try to load your invalid data from the Cloud if desired, but it may not load properly.
    </span>
    <template #cancel-text>
      {{ overwriteText }}
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>
