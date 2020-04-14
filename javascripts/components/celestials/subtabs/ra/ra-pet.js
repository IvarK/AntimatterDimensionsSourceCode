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
      memoriesPerSecond: 0,
      memoryMultiplier: 1,
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
    memoryTooltip() {
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
    memoryMultiplierTooltip() {
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
      this.memoriesPerSecond = pet.memoriesPerSecond;
      this.memoryMultiplier = pet.memoryProductionMultiplier;

      const leftThisLevel = this.requiredExp - this.exp;
      const toUnlock = Ra.totalExpForLevel(this.nextUnlockLevel()) - Ra.totalExpForLevel(this.level + 1);
      this.nextLevelEstimate = this.timeToGoalString(leftThisLevel);
      this.upgradeEstimate = this.timeToGoalString(leftThisLevel + toUnlock);
    },
    timeToGoalString(expToGain) {
      const pet = this.petConfig.pet;
      const estimate = expToGain / pet.memoriesPerSecond;
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
          <div v-if="memoriesPerSecond > 0">
            (next level in {{ nextLevelEstimate }})
          </div>
          <div v-if="memoriesPerSecond > 0">
            (next upgrade in {{ upgradeEstimate }})
          </div>
        </div>
        <div v-else>
          <br>
        </div>
        <ra-pet-level-bar :pet="petConfig.pet" />
        <div v-if="level < 25">
          <div>
            Gaining {{ format(memoriesPerSecond, 2, 2) }} memories/sec
            <span :ach-tooltip="memoryTooltip">
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
          <span :ach-tooltip="memoryMultiplierTooltip">
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
