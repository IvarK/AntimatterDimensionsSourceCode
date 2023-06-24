<script>
import BackupEntry from "@/components/modals/options/BackupEntry";
import ModalWrapper from "@/components/modals/ModalWrapper";

import { AutoBackupSlots } from "@/core/storage";

export default {
  name: "BackupWindowModal",
  components: {
    ModalWrapper,
    BackupEntry
  },
  data() {
    return {
      // Used to force a key-swap whenever a save happens, to make unused slots immediately update
      nextSave: 0,
    };
  },
  computed: {
    backupSlots: () => AutoBackupSlots,
  },
  methods: {
    update() {
      this.nextSave = GameStorage.nextBackup;
    }
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Automatic Backup Saves
    </template>
    <div class="c-info">
      The game makes automatic backups based on time you have spent online or offline.
      Additionally, your current save is saved into the last slot any time a backup from here is loaded.
      <div class="c-entry-container">
        <BackupEntry
          v-for="slot in backupSlots"
          :key="nextSave + slot.id"
          class="l-backup-entry"
          :slot-data="slot"
        />
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-info {
  width: 60rem;
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
