<script>
import BackupEntry from "@/components/modals/options/BackupEntry";
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

import { AutoBackupSlots } from "@/core/storage";
import { STEAM } from "@/env";

export default {
  name: "BackupWindowModal",
  components: {
    ModalWrapper,
    BackupEntry,
    PrimaryButton
  },
  data() {
    return {
      // Used to force a key-swap whenever a save happens, to make unused slots immediately update
      nextSave: 0,
      ignoreOffline: false,
    };
  },
  computed: {
    backupSlots: () => AutoBackupSlots,
    deleteText: () => (STEAM ? "fully uninstalling the game" : "clearing your browser cookies"),
  },
  watch: {
    ignoreOffline(newValue) {
      player.options.loadBackupWithoutOffline = newValue;
    },
  },
  methods: {
    update() {
      this.nextSave = Object.values(GameStorage.lastBackupTimes).map(t => t && t.backupTimer).sum();
      this.ignoreOffline = player.options.loadBackupWithoutOffline;
    },
    offlineOptionClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": this.ignoreOffline
      };
    },
    toggleOffline() {
      this.ignoreOffline = !this.ignoreOffline;
    },
    importAsFile(event) {
      // This happens if the file dialog is canceled instead of a file being selected
      if (event.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = function() {
        GameStorage.importBackupsFromFile(reader.result);
      };
      reader.readAsText(event.target.files[0]);
    },
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Automatic Backup Saves
    </template>
    <div class="c-info c-modal--short">
      The game makes automatic backups based on time you have spent online or offline.
      Timers for online backups only run when the game is open, and offline backups only save to the slot
      with the longest applicable timer.
      Additionally, your current save is saved into the last slot any time a backup from here is loaded.
      <div
        class="c-modal__confirmation-toggle"
        @click="toggleOffline"
      >
        <div :class="offlineOptionClass()">
          <span
            v-if="ignoreOffline"
            class="fas fa-check"
          />
        </div>
        <span class="c-modal__confirmation-toggle__text">
          Load with offline progress disabled
        </span>
      </div>
      <div class="c-entry-container">
        <BackupEntry
          v-for="slot in backupSlots"
          :key="nextSave + slot.id"
          class="l-backup-entry"
          :slot-data="slot"
        />
      </div>
      These backups are still stored in the same place as your game save and can still be lost if you do anything
      external to the game which would delete your save itself, such as {{ deleteText }}. You can import/export
      all backups at once as files, using these buttons:
      <div class="c-backup-file-ops">
        <PrimaryButton
          class="o-btn-file-ops"
          onclick="GameStorage.exportBackupsAsFile()"
        >
          Export as file
        </PrimaryButton>
        <PrimaryButton class="o-btn-file-ops">
          <input
            class="c-file-import"
            type="file"
            accept=".txt"
            @change="importAsFile"
          >
          <label for="file">Import from file</label>
        </PrimaryButton>
      </div>
      Each of your three save slots has its own separate set of backups.
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-info {
  width: 60rem;
  overflow-x: hidden;
  padding-right: 1rem;
}

.c-info::-webkit-scrollbar {
  width: 1rem;
}

.c-info::-webkit-scrollbar-thumb {
  border: none;
}

.s-base--metro .c-info::-webkit-scrollbar-thumb {
  border-radius: 0;
}

.c-backup-file-ops {
  margin: 0.5rem;
}

.o-btn-file-ops {
  margin: 0 0.5rem;
}

.c-entry-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.l-backup-entry {
  width: calc(50% - 0.6rem);
  height: calc(25% - 0.6rem);
}
</style>
