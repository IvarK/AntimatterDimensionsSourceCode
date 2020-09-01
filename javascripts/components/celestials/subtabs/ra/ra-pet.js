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
      memoryChunks: 0,
      memoryChunksPerSecond: 0,
      memoriesPerSecond: 0,
      memoryMultiplier: 1,
      canGetMemoryChunks: false,
      memoryUpgradeCost: 0,
      chunkUpgradeCost: 0,
      currentMemoryMult: 0,
      currentChunkMult: 0
    };
  },
  computed: {
    showScalingUpgrade() {
      return this.petConfig.scalingUpgradeVisible(this.level);
    },
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
          return "Based on total Celestial Memory levels";
        default:
          throw new Error(`Unrecognized celestial ${this.petConfig.pet.name} in Ra UI`);
      }
    },
    memoryUpgradeTooltip() {
      return `Gain 30% more memories:
      cost: ${format(this.memoryUpgradeCost, 2, 2)}
      Current effect: ${formatX(this.currentMemoryMult, 2, 2)}`;
    },
    chunkUpgradeTooltip() {
      return `Gain 30% more chunks:
      cost: ${format(this.chunkUpgradeCost, 2, 2)}
      Current effect: ${formatX(this.currentChunkMult, 2, 2)}`;
    }
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
      this.memoriesPerSecond = pet.memoryChunks * Ra.productionPerMemoryChunk() * this.currentMemoryMult;
      this.canGetMemoryChunks = pet.canGetMemoryChunks;
      this.memoryMultiplier = pet.memoryProductionMultiplier;
      this.memoryUpgradeCost = pet.memoryUpgradeCost;
      this.chunkUpgradeCost = pet.chunkUpgradeCost;
      this.currentMemoryMult = pet.memoryUpgradeCurrentMult;
      this.currentChunkMult = pet.chunkUpgradeCurrentMult;

      const leftThisLevel = this.requiredExp - this.exp;
      this.nextLevelEstimate = this.timeToGoalString(leftThisLevel);
    },
    timeToGoalString(expToGain) {
      const pet = this.petConfig.pet;
      // Quadratic formula for growth (uses constant growth for a = 0)
      const a = Ra.productionPerMemoryChunk() * this.currentMemoryMult * pet.memoryChunksPerSecond / 2;
      const b = Ra.productionPerMemoryChunk() * this.currentMemoryMult * pet.memoryChunks;
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
    },
    upgradeStyle(conditional) {
      if (conditional) return { background: this.petConfig.pet.color };

      return {};
    }
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ name }} Level {{ formatInt(level) }}</div>
        <div v-if="showScalingUpgrade"
          :key="level">
            {{ scalingUpgradeText }}
        </div>
        <div v-else>
          <br>
        </div>
        <div v-if="level < 25">
          <div>
            {{ format(exp, 2) }} / {{ format(requiredExp, 2) }} {{ name }} memories
          </div>
          <div>
            (next level in {{ nextLevelEstimate }})
          </div>
        </div>
        <div v-else>
          <br>
        </div>
        <div class="c-ra-pet-middle-container">
          <div class="c-ra-pet-upgrades">
            <div 
              class="o-ra-pet-upgrade" 
              :class="{ 'c-ra-pet-can-upgrade': memoryUpgradeCost <= exp }"
              :style="upgradeStyle(memoryUpgradeCost <= exp)"
              @click="petConfig.pet.purchaseMemoryUpgrade()"
              :ach-tooltip="memoryUpgradeTooltip"><i class="fas fa-expand-arrows-alt"></i></div>
            <div 
              class="o-ra-pet-upgrade" 
              :class="{ 'c-ra-pet-can-upgrade': chunkUpgradeCost <= exp }"
              :style="upgradeStyle(chunkUpgradeCost <= exp)"
              @click="petConfig.pet.purchaseChunkUpgrade()"
              :ach-tooltip="chunkUpgradeTooltip"><i class="fas fa-compress-arrows-alt"></i></div>
          </div>
          <ra-pet-level-bar :pet="petConfig.pet" />
          <div 
            class="c-ra-level-up" 
            @click="petConfig.pet.levelUp()" 
            :class="{ 'c-ra-pet-can-upgrade': requiredExp <= exp }"
            :style="upgradeStyle(requiredExp <= exp)">
            <i class="fas fa-arrow-up"></i>
          </div>
        </div>
        <div v-if="level < 25">
          <div>
            {{ format(memoryChunks, 2, 2) }} memory chunks, {{ format(memoriesPerSecond, 2, 2) }} memories/sec
          </div>
          <div>
            Gaining {{ format(memoryChunksPerSecond, 2, 2) }} memory chunks/sec
            <span :ach-tooltip="chunkTooltip">
              <i class="fas fa-question-circle"></i>
            </span>
          </div>
        </div>
        <div v-else>
          <div>
            Capped at Level {{ formatInt(level) }}
          </div>
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
          <!-- This choice of key forces a UI update every level up -->
          <ra-upgrade-icon v-for="(unlock, i) in unlocks"
            :key="25 * level + i"
            :unlock="unlock" />
        </div>
      </div>
    </div>
  `
});
