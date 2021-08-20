"use strict";

Vue.component("modal-cloud-load-conflict", {
  mixins: [modalCloudConflictMixin],
  template: `
    <div class="c-modal-options l-modal-options">
      <b>
        <span v-if="conflict.saveComparison.older === 1">
          Your local save appears to be older than your cloud save.
        </span>
        <span v-else-if="conflict.saveComparison.farther === 1">
          Your local save appears to be farther than your cloud save.
        </span>
        <span v-else>
          Your local save and cloud save appear to have similar amounts of progress.
        </span>
        Please select the save you want to load.
      </b>
      <modal-cloud-conflict-record
        :saveData="conflict.local"
        :saveId="conflict.saveId"
        saveType="local"
      >
        <primary-button
          class="o-primary-btn--width-medium"
          @click="handleClick(false)"
        >
          Load local save
        </primary-button>
      </modal-cloud-conflict-record>
      <modal-cloud-conflict-record
        :saveData="conflict.cloud"
        :saveId="conflict.saveId"
        saveType="cloud"
      >
        <primary-button
          class="o-primary-btn--width-medium"
          @click="handleClick(true)"
        >
          Load cloud save
        </primary-button>
      </modal-cloud-conflict-record>
      <b>This message will only show up once, when you load up the game.
      You can make it appear again by manually loading from the Options menu.</b>
    </div>`
});
