"use strict";

Vue.component("modal-cloud-conflict-record", {
  props: {
    saveId: Number,
    saveData: Object,
    saveType: String
  },
  template: `
    <div class="l-modal-options__save-record">
      <strong>Save #{{ saveId + 1 }} ({{ saveType }}):</strong>
      <span>Infinities: {{ format(saveData.infinities, 2, 0) }}</span>
      <span>Eternities: {{ format(saveData.eternities, 2, 0) }}</span>
      <span>Realities: {{ format(saveData.realities, 2, 0) }}</span>
      <slot/>
    </div>`
});

const modalCloudConflictMixin = {
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflicts[0];
    }
  },
  methods: {
    handleClick(accepted) {
      const conflicts = this.$viewModel.modal.cloudConflicts;
      if (accepted) {
        safeCall(this.conflict.onAccept);
      }
      if (conflicts.length === 1) {
        safeCall(this.conflict.onLastConflict);
        Modal.hide();
      }
      conflicts.shift();
    }
  }
};
