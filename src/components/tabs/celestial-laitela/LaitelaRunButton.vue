<script>
export default {
  name: "LaitelaRunButton",
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
    };
  },
  computed: {
    completionTime() {
      return TimeSpan.fromSeconds(this.realityTime).toStringShort();
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description().split("\n");
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Lai'tela's", number: 5 });
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
      };
    },
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :style="{ textDecoration: isDoomed ? 'line-through' : null }">
      <b>Start Lai'tela's Reality</b>
    </span>
    <div
      :class="runButtonClassObject()"
      @click="startRun"
    />
    <div v-if="realityReward > 1">
      <b>
        All Dark Matter multipliers are {{ formatX(realityReward, 2, 2) }} higher.
      </b>
      <span v-if="maxDimTier > 0">
        <br><br>
        Fastest Completion: {{ completionTime }}
        <br><br>
        <span v-if="maxDimTier <= 7">
          Highest active dimension: {{ formatInt(maxDimTier) }}
        </span>
      </span>
      <span v-else>
        <br>
        <b>
          You also gain an additional {{ formatX(8) }} Dark Energy.
        </b>
        <br><br>
        Lai'tela's Reality has been fully destabilized and cannot have its reward further improved.
      </span>
      <br><br>
    </div>
    <div
      v-for="(line, lineId) in runDescription"
      :key="lineId + '-laitela-run-desc'"
    >
      {{ line }} <br>
    </div>
  </button>
</template>