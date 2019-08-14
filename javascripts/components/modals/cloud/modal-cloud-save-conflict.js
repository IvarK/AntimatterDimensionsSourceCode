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
        class="o-primary-btn--width-medium"
        @click="handleClick(true)"
      >Yes</primary-button>
      <primary-button
        class="o-primary-btn--width-medium"
        @click="handleClick(false)"
      >No</primary-button>
    </div>`
});