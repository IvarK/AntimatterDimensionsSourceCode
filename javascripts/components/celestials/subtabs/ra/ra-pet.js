"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      level: 0,
      exp: 0,
      requiredExp: 0,
      nextLevelEstimate: "",
      upgradeEstimate: "",
      memoryChunks: 0,
      memoryChunksPerSecond: 0,
      memoriesPerSecond: 0,
      memoryMultiplier: 1,
      canGetMemoryChunks: false,
    };
  },
  computed: {
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    petStyle() {
      return {
        color: this.petConfig.pet.color
      };
    },
    unlocks() {
      return Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.petConfig.pet)
        .sort((a, b) => a.level - b.level);
    },
    chunkTooltip() {
      switch (this.petConfig.pet.name) {
        case "Teresa":
          return "Based on EP";
        case "Effarig":
          return "Based on Relic Shards gained";
        case "Enslaved":
          return "Based on Time Shards";
        case "V":
          return "Based on Infinity Power";
        default:
          throw new Error(`Unrecognized celestial ${this.petConfig.pet.name} in Ra UI`);
      }
    },
    memoryGainTooltip() {
      switch (this.petConfig.pet.name) {
        case "Teresa":
          return "Based on current RM";
        case "Effarig":
          return "Based on best glyph level";
        case "Enslaved":
          return "Based on total time played";
        case "V":
          return "Based on total celestial levels";
        default:
          throw new Error(`Unrecognized celestial ${this.petConfig.pet.name} in Ra UI`);
      }
    },
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.level = pet.level;
      this.exp = pet.exp;
      this.requiredExp = pet.requiredExp;
      this.memoryChunks = pet.memoryChunks;
      this.memoryChunksPerSecond = pet.memoryChunksPerSecond;
      this.memoriesPerSecond = pet.memoryChunks * Ra.productionPerMemoryChunk();
      this.canGetMemoryChunks = pet.canGetMemoryChunks;
      this.memoryMultiplier = pet.memoryProductionMultiplier;

      const leftThisLevel = this.requiredExp - this.exp;
      const toUnlock = Ra.totalExpForLevel(this.nextUnlockLevel()) - Ra.totalExpForLevel(this.level + 1);
      this.nextLevelEstimate = this.timeToGoalString(leftThisLevel);
      this.upgradeEstimate = this.timeToGoalString(leftThisLevel + toUnlock);
    },
    timeToGoalString(expToGain) {
      const pet = this.petConfig.pet;
      // Quadratic formula for growth (uses constant growth for a = 0)
      const a = Ra.productionPerMemoryChunk() * pet.memoryChunksPerSecond / 2;
      const b = Ra.productionPerMemoryChunk() * pet.memoryChunks;
      const c = -expToGain;
      const estimate = a === 0
        ? -c / b
        : (Math.sqrt(Math.pow(b, 2) - 4 * a * c) - b) / (2 * a);
      if (Number.isFinite(estimate)) {
        return TimeSpan.fromSeconds(estimate).toStringShort();
      }
      return "never";
    },
    nextUnlockLevel() {
      const missingUpgrades = Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.petConfig.pet)
        .map(u => u.level)
        .filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    }
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ name }} Level {{ formatInt(level) }}</div>
        <div v-if="level >= 2">
          {{ scalingUpgradeText }}
        </div>
        <div v-else>
          <br>
        </div>
        <div>
          {{ format(exp, 2) }} / {{ format(requiredExp, 2) }} {{ name }} memories
        </div>
        <div>
          (next level in {{ nextLevelEstimate }})
        </div>
        <div v-if="level < 25">
          (next upgrade in {{ upgradeEstimate }})
        </div>
        <div v-else>
          <br>
        </div>
        <ra-pet-level-bar :pet="petConfig.pet" />
        <div>
          {{ format(memoryChunks, 2, 2) }} memory chunks, {{ format(memoriesPerSecond, 2, 2) }} memories/sec
        </div>
        <div>
          Gaining {{ format(memoryChunksPerSecond, 2, 2) }} memory chunks/sec
          <span :ach-tooltip="chunkTooltip">
            <i class="fas fa-question-circle"></i>
          </span>
        </div>
        <div v-if="memoryMultiplier > 1">
          Multiplying all memory production by {{ format(memoryMultiplier, 2, 3) }}
          <span :ach-tooltip="memoryGainTooltip">
            <i class="fas fa-question-circle"></i>
          </span>
        </div>
        <div v-else>
          <br>
        </div>
        <br>
        <div style="display: flex; justify-content: center;">
          <ra-upgrade-icon v-for="(unlock, i) in unlocks"
            :key="i"
            :unlock="unlock" />
        </div>
      </div>
    </div>
  `
});
