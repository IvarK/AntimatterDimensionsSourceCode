<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "LaitelaRunButton",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
      bestSet: [],
    };
  },
  computed: {
    completionTime() {
      return TimeSpan.fromSeconds(this.realityTime).toStringShort();
    },
    runEffects() {
      return GameDatabase.celestials.descriptions[5].effects().split("\n");
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description();
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
      this.bestSet = Glyphs.copyForRecords(player.records.bestReality.laitelaSet);
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
        "c-celestial-run-button--clickable": !this.isDoomed
      };
    },
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :class="{ 'o-pelle-disabled': isDoomed }">
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
        <br><br>
        Glyph Set:
        <GlyphSetPreview
          text="Fastest Destabilization Glyph Set"
          :text-hidden="true"
          :force-name-color="false"
          :glyphs="bestSet"
        />
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
      v-for="(line, lineId) in runEffects"
      :key="lineId + '-laitela-run-desc'"
    >
      {{ line }} <br>
    </div>
    <br>
    <div>{{ runDescription }}</div>
  </button>
</template>