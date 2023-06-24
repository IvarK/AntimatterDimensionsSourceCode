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
      const rm = new Decimal(this.save.reality.realityMachines);
      if (rm.gt(0)) return `Reality Machines: ${format(new Decimal(rm), 2)}`;
      const ep = new Decimal(this.save.eternityPoints);
      if (ep.gt(0)) return `Eternity Points: ${format(new Decimal(ep), 2)}`;
      const ip = new Decimal(this.save.infinityPoints);
      if (ip.gt(0)) return `Infinity Points: ${format(new Decimal(ip), 2)}`;
      return `Antimatter: ${formatPostBreak(new Decimal(this.save.antimatter), 2, 1)}`;
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
      const lastSave = GameStorage.backupTimeData[this.slotData.id].last;
      return lastSave
        ? `Last saved: ${TimeSpan.fromMilliseconds(this.currTime - lastSave)} ago`
        : "Slot not currently in use";
    }
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
      if (this.slotData.type !== BACKUP_SLOT_TYPE.RESERVE) GameStorage.saveToReserveSlot();
      GameStorage.loadPlayerObject(this.save);
      GameUI.notify.info(`Game loaded from backup slot #${this.slotData.id}`);
      GameStorage.processLocalBackups();
    },
  },
};
</script>

<template>
  <div class="c-bordered-entry">
    <h3>Slot #{{ slotData.id }}:</h3>
    <span>{{ progressStr }}</span>
    <span>{{ slotType }}</span>
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
