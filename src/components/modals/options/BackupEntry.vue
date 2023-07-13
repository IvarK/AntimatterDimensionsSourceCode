<script>
import PrimaryButton from "@/components/PrimaryButton";

import { BACKUP_SLOT_TYPE } from "@/core/storage";

export default {
  name: "BackupEntry",
  components: {
    PrimaryButton
  },
  props: {
    slotData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currTime: 0,
    };
  },
  computed: {
    save() {
      return GameStorage.loadFromBackup(this.slotData.id);
    },
    progressStr() {
      if (!this.save) return "(Empty)";

      // These will be checked in order; the first nonzero resource will be returned
      const resources = [this.save.celestials.pelle.realityShards,
        this.save.reality.iMCap,
        this.save.reality.realityMachines,
        this.save.eternityPoints,
        this.save.infinityPoints,
        this.save.antimatter
      ];
      const names = ["Reality Shards",
        "Imaginary Machine Cap",
        "Reality Machines",
        "Eternity Points",
        "Infinity Points",
        "Antimatter"];

      for (let index = 0; index < resources.length; index++) {
        const val = new Decimal(resources[index]);
        if (val.gt(0)) return `${names[index]}: ${formatPostBreak(val, 2)}`;
      }

      // In practice this should never happen, unless a save triggers on the same tick the very first AD1 is bought
      return "No resources";
    },
    slotType() {
      const formattedTime = this.slotData.intervalStr?.();
      switch (this.slotData.type) {
        case BACKUP_SLOT_TYPE.ONLINE:
          return `Saves every ${formattedTime} online`;
        case BACKUP_SLOT_TYPE.OFFLINE:
          return `Saves after ${formattedTime} offline`;
        case BACKUP_SLOT_TYPE.RESERVE:
          return "Pre-loading save";
        default:
          throw new Error("Unrecognized backup save type");
      }
    },
    lastSaved() {
      const lastSave = GameStorage.lastBackupTimes[this.slotData.id]?.date ?? 0;
      return lastSave
        ? `Last saved: ${TimeSpan.fromMilliseconds(this.currTime - lastSave)} ago`
        : "Slot not currently in use";
    },
  },
  methods: {
    update() {
      this.currTime = Date.now();
    },
    load() {
      if (!this.save) return;
      // This seems to be the only way to properly hide the modal after the save is properly loaded,
      // since the offline progress modal appears nearly immediately after clicking the button
      Modal.hide();

      // We still save to the reserve slot even if we're loading from it, so we temporarily store the
      // save-to-be-loaded into a string in this scope so that it doesn't get overwritten by the current save
      const toLoad = this.save;
      GameStorage.saveToReserveSlot();

      GameStorage.ignoreBackupTimer = true;
      GameStorage.offlineEnabled = player.options.loadBackupWithoutOffline ? false : undefined;
      GameStorage.oldBackupTimer = player.backupTimer;
      GameStorage.loadPlayerObject(toLoad);
      GameUI.notify.info(`Game loaded from backup slot #${this.slotData.id}`);
      GameStorage.loadBackupTimes();
      GameStorage.ignoreBackupTimer = false;
      GameStorage.offlineEnabled = undefined;
      GameStorage.resetBackupTimer();
      GameStorage.save(true);
    },
  },
};
</script>

<template>
  <div class="c-bordered-entry">
    <h3>Slot #{{ slotData.id }}:</h3>
    <span>{{ progressStr }}</span>
    <span>
      {{ slotType }}
    </span>
    <span class="c-fixed-height">{{ lastSaved }}</span>
    <PrimaryButton
      class="o-primary-btn--width-medium"
      :class="{ 'o-primary-btn--disabled' : !save }"
      @click="load()"
    >
      Load
    </PrimaryButton>
  </div>
</template>

<style scoped>
.c-bordered-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.4rem);
  padding: 0.5rem 0.3rem;
  margin: 0.3rem;
}

.c-fixed-height {
  height: 4rem;
}
</style>
