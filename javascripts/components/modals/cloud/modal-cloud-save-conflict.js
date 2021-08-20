"use strict";

Vue.component("modal-cloud-save-conflict", {
  mixins: [modalCloudConflictMixin],
  template:
    `<div class="c-modal-options l-modal-options">
      <b>
        <span v-if="conflict.saveComparison.older === -1">
          Your cloud save appears to be older than your local save.
        </span>
        <span v-else-if="conflict.saveComparison.farther === -1">
          Your cloud save appears to be farther than your local save.
        </span>
        <span v-else>
          Your local save and cloud save appear to have similar amounts of progress.
        </span>
        Would you like to overwrite the cloud save?
      </b>
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
      >
        Yes
      </primary-button>
      <primary-button
        class="o-primary-btn--width-medium"
        @click="handleClick(false)"
      >
        No
      </primary-button>
      <b>(Placeholder for ignore button)</b>
    </div>`
});
