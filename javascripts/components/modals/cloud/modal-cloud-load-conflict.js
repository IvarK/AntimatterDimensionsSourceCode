"use strict";

Vue.component("modal-cloud-load-conflict", {
  mixins: [modalCloudConflictMixin],
  template: `
    <div class="c-modal-options l-modal-options" style="width: 50rem">
      <modal-close-button @click="emitClose" />
      <h1>Load Game from Cloud</h1>
      <b>
        <span v-if="conflict.saveComparison.older === 1">
          Your Local Save appears to be older than your Cloud Save.
        </span>
        <span v-else-if="conflict.saveComparison.farther === 1">
          Your Local Save appears to be farther than your Cloud Save.
        </span>
        <span v-else>
          Your Local Save and Cloud Save appear to have similar amounts of progress.
        </span>
        Please select the save you want to load.
      </b>
      <br>
      <modal-cloud-conflict-record
        :saveData="conflict.local"
        :saveId="conflict.saveId"
        saveType="Local Save"
      />
      <primary-button
        class="o-primary-btn"
        @click="handleClick(false)"
      >
        Keep Local Save
      </primary-button>
      <br>
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="Cloud Save"
      />
      <primary-button
        class="o-primary-btn"
        @click="handleClick(true)"
      >
        Overwrite Local with Cloud Save
      </primary-button>
    </div>`
});
