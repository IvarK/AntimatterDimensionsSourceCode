"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      pet: {},
      isUnlocked: false,
      isRaCapped: false,
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
        color: this.pet.color
      };
    },
    unlocks() {
      return Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.pet)
        .sort((a, b) => a.level - b.level);
    },
    chunkTooltip() {
      switch (this.pet.name) {
        case "Teresa":
          return "Based on Eternity Points";
        case "Effarig":
          return "Based on Relic Shards gained";
        case "Enslaved":
          return "Based on Time Shards";
        case "V":
          return "Based on Infinity Power";
        default:
          throw new Error(`Unrecognized celestial ${this.pet.name} in Ra UI`);
      }
    },
    memoryGainTooltip() {
      switch (this.pet.name) {
        case "Teresa":
          return "Based on current Reality Machines";
        case "Effarig":
          return "Based on best glyph level";
        case "Enslaved":
          return "Based on total time played";
        case "V":
          return "Based on total Celestial Memory levels";
        default:
          throw new Error(`Unrecognized celestial ${this.pet.name} in Ra UI`);
      }
    },
    chunkUpgradeTooltip() {
      return `Gain 30% more Memory Chunks:
      Cost: ${format(this.chunkUpgradeCost, 2, 2)}
      Current effect: ${formatX(this.currentChunkMult, 2, 2)}`;
    }
  },
  methods: {
    update() {
      this.isRaCapped = Ra.totalPetLevel === 100;
      this.pet = this.petConfig.pet;
      const pet = this.pet;
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
      const pet = this.pet;
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
        .filter(unlock => unlock.pet === this.pet)
        .map(u => u.level)
        .filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    },
    upgradeClassObject(type) {
      const available = type === "memory" ? this.memoryUpgradeCost <= this.exp : this.chunkUpgradeCost <= this.exp;
      const pet = this.pet;
      return {
        "c-ra-pet-upgrade": true,
        "c-ra-pet-btn--available": available,
        "c-ra-pet-btn--teresa": available && pet.name === "Teresa",
        "c-ra-pet-btn--effarig": available && pet.name === "Effarig",
        "c-ra-pet-btn--enslaved": available && pet.name === "Enslaved",
        "c-ra-pet-btn--v": available && pet.name === "V"
      };
    },
    barStyle(type) {
      const cost = type === "memory" ? this.memoryUpgradeCost : this.chunkUpgradeCost;
      return {
        width: `${100 * Math.min(1, this.exp / cost)}%`,
        background: this.pet.color
      };
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ name }} Level {{ formatInt(level) }}/{{ formatInt(25) }}</div>
        <div v-if="showScalingUpgrade"
          :key="level">
            {{ scalingUpgradeText }}
        </div>
        <div v-else>
          <br>
        </div>
        <div v-if="level < 25">
          <div>
            {{ format(exp, 2) }} / {{ format(requiredExp, 2) }} {{ name }} Memories
          </div>
          <div>
            (next level in {{ nextLevelEstimate }})
          </div>
        </div>
        <div class="l-ra-pet-middle-container" v-if="!(level===25)">
          <div class="l-ra-pet-upgrade-container">
            <div class="l-ra-pet-upgrade c-ra-pet-upgrade__top">
              <div
                :class="upgradeClassObject('memory')"
                @click="petConfig.pet.purchaseMemoryUpgrade()"
                style="border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
              >
                <span class="fas fa-brain"></span>
                <div class="c-ra-pet-upgrade__tooltip">
                  <div class="c-ra-pet-upgrade__tooltip__name">{{ petConfig.pet.name }}'s Recollection</div>
                  <div class="c-ra-pet-upgrade__tooltip__description">Gain {{ formatPercents(0.3) }} more Memories</div>
                  <div class="c-ra-pet-upgrade__tooltip__footer">
                    Cost: {{ format(memoryUpgradeCost, 2, 2) }}
                    <br>
                    Currently: {{ formatX(currentMemoryMult, 2, 2) }}
                  </div>
                </div>
              </div>
              <div class="c-ra-upgrade-bar">
                <div class="c-ra-upgrade-bar__inner" :style="barStyle('memory')"></div>
              </div>
            </div>
            <div class="l-ra-pet-upgrade">
              <div
                :class="upgradeClassObject('chunk')"
                @click="petConfig.pet.purchaseChunkUpgrade()"
                style="border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-right-radius: 0;"
              >
                <span class="fas fa-dice-d6"></span>
                <div class="c-ra-pet-upgrade__tooltip">
                  <div class="c-ra-pet-upgrade__tooltip__name">{{ petConfig.pet.name }}'s Fragmentation</div>
                  <div class="c-ra-pet-upgrade__tooltip__description">
                    Gain {{ formatPercents(0.3) }} more Memory Chunks
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__footer">
                    Cost: {{ format(chunkUpgradeCost, 2, 2) }}
                    <br>
                    Currently: {{ formatX(currentChunkMult, 2, 2) }}
                  </div>
                </div>
              </div>
              <div class="c-ra-upgrade-bar c-ra-upgrade-bar--bottom">
                <div class="c-ra-upgrade-bar__inner" :style="barStyle('chunk')"></div>
              </div>
            </div>
          </div>
          <ra-pet-level-bar v-if="level < 25" :petConfig="petConfig" />
        </div>
        <div v-if="level < 25">
          <div>
            {{ format(memoryChunks, 2, 2) }} Memory Chunks, {{ format(memoriesPerSecond, 2, 2) }} Memories/sec
          </div>
          <div>
            Gaining {{ format(memoryChunksPerSecond, 2, 2) }} Memory Chunks/sec
            <span :ach-tooltip="chunkTooltip">
              <i class="fas fa-question-circle"></i>
            </span>
          </div>
        </div>
        <div v-if="memoryMultiplier > 1 && !isRaCapped">
          Multiplying all Memory production by {{ format(memoryMultiplier, 2, 3) }}
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
