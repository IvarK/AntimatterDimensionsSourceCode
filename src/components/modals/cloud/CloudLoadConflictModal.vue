<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "CloudLoadConflictModal",
  components: {
    ModalWrapperChoice,
    SaveInfoEntry,
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    older() {
      return this.conflict.saveComparison.older === 1;
    },
    farther() {
      return this.conflict.saveComparison.farther === 1;
    },
    hasDifferentName() {
      return this.conflict.cloud.saveName !== this.conflict.local.saveName;
    },
    suggestionText() {
      const goodStyle = `style="color: var(--color-good)"`;
      const badStyle = `style="color: var(--color-bad)"`;

      const suggestions = ["Loading this Cloud save "];
      const cloudProg = this.conflict.cloud.compositeProgress, localProg = this.conflict.local.compositeProgress;
      const warnOverwrite = this.farther && Math.abs(cloudProg - localProg) > 0.15;
      suggestions.push(warnOverwrite
        ? `<b ${badStyle}>would cause your local save to lose significant progress</b>`
        : `<b ${goodStyle}>is probably safe</b>`);
      if (this.hasDifferentName) {
        suggestions.push(`<br>${warnOverwrite ? "Additionally" : "However"}, the Cloud save
          <b ${badStyle}>may be a save from a different device</b>.`);
      }
      if (warnOverwrite || this.hasDifferentName) {
        suggestions.push(`<br><b ${badStyle}>Are you sure you wish to overwrite your local save?</b>`);
      }
      return suggestions.join("");
    }
  },
  methods: {
    confirm() {
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :confirm-fn="confirm"
  >
    <template #header>
      Load Game from Cloud
    </template>
    <span v-if="hasDifferentName">
      Your Local and Cloud Saves have <b>different names</b>.
    </span>
    <span v-else-if="older">
      Loading from the Cloud would <b>load a save with less playtime</b>.
    </span>
    <span v-else-if="farther">
      Loading from the Cloud would <b>cause you to lose progress</b>.
    </span>
    <span v-else>
      Your Local Save and Cloud Save <b>appear to have similar amounts of progress</b>.
    </span>
    Please select the save you want to load.
    <br>
    <br>
    <SaveInfoEntry
      :save-data="conflict.local"
      :other-data="conflict.cloud"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Local Save"
    />
    <SaveInfoEntry
      :save-data="conflict.cloud"
      :other-data="conflict.local"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Cloud Save"
    />
    <span v-html="suggestionText" />
    <template #cancel-text>
      Keep Local Save
    </template>
    <template #confirm-text>
      Overwrite Local with Cloud Save
    </template>
  </ModalWrapperChoice>
</template>