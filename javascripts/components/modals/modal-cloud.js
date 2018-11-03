const modalCloudConflictMixin = {
  computed: {
    conflict: function() {
      return this.$viewModel.modal.cloudConflicts[0];
    }
  },
  methods: {
    handleClick: function(accepted) {
      let conflicts = this.$viewModel.modal.cloudConflicts;
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

Vue.component('modal-cloud-save-conflict', {
  mixins: [modalCloudConflictMixin],
  template:
    `<div class="c-modal-options l-modal-options">
      <strong>Your local save appears to be older than your cloud save. Would you like to overwrite the cloud save?</strong>
      <modal-cloud-conflict-record
        :saveData="conflict.local"
        :saveId="conflict.saveId"
        saveType="local"
      />
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="cloud"
      />
      <primary-button
        class="c-primary-btn--width-medium"
        @click="handleClick(true)"
      >Yes</primary-button>
      <primary-button
        class="c-primary-btn--width-medium"
        @click="handleClick(false)"
      >No</primary-button>
    </div>`
});

Vue.component('modal-cloud-load-conflict', {
  mixins: [modalCloudConflictMixin],
  template:
    `<div class="c-modal-options l-modal-options">
      <strong>Your cloud save appears to be older than your local save. Please select which one you would like to keep.</strong>
      <modal-cloud-conflict-record
        :saveData="conflict.local"
        :saveId="conflict.saveId"
        saveType="local"
      >
        <primary-button
          class="c-primary-btn--width-medium"
          @click="handleClick(false)"
        >Load local</primary-button>
      </modal-cloud-conflict-record>
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="cloud"
      >
        <primary-button
          class="c-primary-btn--width-medium"
          @click="handleClick(true)"
        >Load cloud</primary-button>
      </modal-cloud-conflict-record>
    </div>`
});

Vue.component('modal-cloud-conflict-record', {
  props: {
    saveId: Number,
    saveData: Object,
    saveType: String
  },
  template:
    `<div class="l-modal-options__save-record">
      <strong>Save #{{ saveId + 1 }} ({{ saveType }}):</strong>
      <span>Infinities: {{ saveData.infinities }}</span>
      <span>Eternities: {{ saveData.eternities }}</span>
      <slot/>
    </div>`
});