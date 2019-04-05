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
          class="o-primary-btn--width-medium"
          @click="handleClick(false)"
        >Load local</primary-button>
      </modal-cloud-conflict-record>
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="cloud"
      >
        <primary-button
          class="o-primary-btn--width-medium"
          @click="handleClick(true)"
        >Load cloud</primary-button>
      </modal-cloud-conflict-record>
    </div>`
});