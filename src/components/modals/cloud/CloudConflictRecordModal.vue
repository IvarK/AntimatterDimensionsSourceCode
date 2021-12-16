<script>
export default {
  name: "CloudConflictRecordModal",
  props: {
    saveId: {
      type: Number,
      required: true,
    },
    saveData: {
      type: Object,
      required: true,
    },
    saveType: {
      type: String,
      required: true,
    }
  },
  computed: {
    timePlayed() {
      return `Time Played: ${TimeSpan.fromMilliseconds(this.saveData.realTimePlayed).toString()}`;
    },
    antimatter() {
      return `Total Antimatter: ${format(this.saveData.totalAntimatter, 2, 1)}`;
    },
    prestigeCount() {
      const data = this.saveData;
      if (data.realities > 0) return `Realities: ${this.formatSmall(data.realities)}`;
      if (data.eternities.gt(0)) return `Eternities: ${this.formatSmall(data.eternities)}`;
      if (data.infinities.gt(0)) return `Infinities: ${this.formatSmall(data.infinities)}`;
      return "(No prestige layers reached yet.)";
    },
    prestigeResource() {
      const data = this.saveData;
      if (data.realityMachines.gt(0)) {
        const imString = data.imaginaryMachines > 0
          ? ` + ${format(data.imaginaryMachines, 2, 2)}i`
          : "";
        return `Reality Machines: ${format(data.realityMachines, 2)}${imString}`;
      }
      if (data.eternityPoints.gt(0)) return `Eternity Points: ${format(data.eternityPoints, 2)}`;
      if (data.infinityPoints.gt(0)) return `Infinity Points: ${format(data.infinityPoints, 2)}`;
      return "";
    },
    extraProgressIndicator() {
      const data = this.saveData;
      if (data.realities > 0) return `Best Glyph Level: ${formatInt(data.bestLevel)}`;
      if (data.dilatedTime.gt(0)) return `Dilated Time: ${format(data.dilatedTime, 2)}`;
      return "";
    },
  },
  methods: {
    formatSmall(number) {
      if (Decimal.gt(number, 1e4)) return format(number, 2);
      return formatInt(number);
    }
  },
};
</script>

<template>
  <div class="l-modal-options__save-record">
    <h3>{{ saveType }} (Slot #{{ saveId + 1 }}):</h3>
    {{ timePlayed }}
    <br>
    {{ antimatter }}
    <br>
    {{ prestigeCount }}
    <br>
    {{ prestigeResource }}
    <br>
    {{ extraProgressIndicator }}
    <slot />
  </div>
</template>
