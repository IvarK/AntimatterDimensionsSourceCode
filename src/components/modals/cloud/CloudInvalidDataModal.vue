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
      It is probably safe to overwrite your Cloud save. You can click "Cloud load" and force the save
      to be loaded if you would like to attempt to convert it to a valid save format that you can use.
    </span>
    <span v-else>
      You can try to load your data from the Cloud if desired. The game will attempt to load in your
      Cloud data by converting its format, but this may not work and in the worst case may require you
      to reset this save slot in order for the game to work again.
    </span>
    <br>
    Note: This modal will show up regardless of your settings, because this issue will continue to prevent
    the 10-minute autosave until it is resolved.
    <template #cancel-text>
      {{ overwriteText }}
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>
