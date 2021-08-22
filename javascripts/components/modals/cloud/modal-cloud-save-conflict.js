"use strict";

Vue.component("modal-cloud-save-conflict", {
  mixins: [modalCloudConflictMixin],
  methods: {
    saveClick(accepted) {
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = accepted;
      this.handleClick(accepted);
    }
  },
  template: `
    <div class="c-modal-options l-modal-options" style="width: 50rem">
      <modal-close-button @click="emitClose" />
      <h1>Save Game to Cloud</h1>
      <b>
        <span v-if="conflict.saveComparison.older === -1">
          Your Cloud Save appears to be older than your Local Save.
        </span>
        <span v-else-if="conflict.saveComparison.farther === -1">
          Your Cloud Save appears to be farther than your Local Save.
        </span>
        <span v-else>
          Your Local Save and Cloud Save appear to have similar amounts of progress.
        </span>
      </b>
      <br>
      <modal-cloud-conflict-record
        :saveData="conflict.local"
        :saveId="conflict.saveId"
        saveType="Local Save"
      />
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="Cloud Save"
      />
      <br>
      Would you like to overwrite the cloud save? Your choice here will apply for every
      time the game automatically attempts to cloud save, until the page is reloaded.
      <primary-button
        class="o-primary-btn"
        @click="saveClick(true)"
      >
        Overwrite cloud save
      </primary-button>
      <br>
      <primary-button
        class="o-primary-btn"
        @click="saveClick(false)"
      >
        Do not overwrite
      </primary-button>
    </div>`
});
