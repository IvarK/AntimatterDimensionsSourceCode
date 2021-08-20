"use strict";

Vue.component("modal-cloud-conflict-record", {
  props: {
    saveId: Number,
    saveData: Object,
    saveType: String
  },
  computed: {
    timePlayed() {
      return `${TimeSpan.fromMilliseconds(saveData.records.realTimePlayed).toString()}`;
    },
    antimatter() {
      return `${format(saveData.records.totalAntimatter, 2, 1)}`;
    },
    prestigeCount() {
      if (saveData.realities > 0) return `Realities: ${formatSmall(saveData.realities)}`;
      if (saveData.eternities.gt(0)) return `Eternities: ${formatSmall(saveData.eternities)}`;
      if (saveData.infinities.gt(0)) return `Infinities: ${formatSmall(saveData.infinities)}`;
      return "(No prestige layers reached yet.)";
    },
    prestigeResource() {
      if (saveData.reality.realityMachines.gt(0)) {
        return `Reality Machines: ${format(saveData.reality.realityMachines, 2)}`;
      }
      if (saveData.eternityPoints.gt(0)) return `Eternity Points: ${format(saveData.eternityPoints, 2)}`;
      if (saveData.infinityPoints.gt(0)) return `Infinity Points: ${format(saveData.infinityPoints, 2)}`;
      return "";
    },
    extraProgressIndicator() {
      if (saveData.realities > 0) {
        return `Best Glyph Level: ${formatInt(player.records.bestReality.glyphLevel)}`;
      }
      if (saveData.dilation.dilatedTime.gt(0)) return `Dilated Time: ${format(saveData.dilation.dilatedTime, 2)}`;
      return "";
    },
  },
  methods: {
    formatSmall(number) {
      if (Decimal.gt(number, 1e4)) return format(number, 2);
      return formatInt(number);
    }
  },
  template: `
    <div class="l-modal-options__save-record">
      <strong>Save #{{ saveId + 1 }} ({{ saveType }}):</strong>
      <span>Time Played: {{ timePlayed }}</span>
      <span>Total Antimatter: {{ antimatter }}</span>
      <span>{{ prestigeCount }}</span>
      <span>{{ prestigeResource }}</span>
      <span>{{ extraProgressIndicator }}</span>
      <slot/>
    </div>`
});

const modalCloudConflictMixin = {
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflicts[0];
    }
  },
  methods: {
    handleClick(accepted) {
      const conflicts = this.$viewModel.modal.cloudConflicts;
      if (accepted) {
        safeCall(this.conflict.onAccept);
      }
      if (conflicts.length === 1) {
        safeCall(this.conflict.onLastConflict);
        Modal.hide();
      }
      conflicts.shift();
    }
  }
};
