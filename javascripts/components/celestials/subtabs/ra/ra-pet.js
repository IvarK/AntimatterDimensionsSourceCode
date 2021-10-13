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
      isCapped: false,
      name: "",
      level: 0,
      memories: 0,
      requiredMemories: 0,
      memoryChunks: 0,
      memoryChunksPerSecond: 0,
      memoriesPerSecond: 0,
      memoryMultiplier: 1,
      canGetMemoryChunks: false,
      memoryUpgradeCost: 0,
      chunkUpgradeCost: 0,
      memoryUpgradeCapped: false,
      chunkUpgradeCapped: false,
      currentMemoryMult: 0,
      currentChunkMult: 0,
      nextMemoryUpgradeEstimate: "",
      nextMemoryChunkUpgradeEstimate: "",
    };
  },
  computed: {
    levelCap() { return Ra.levelCap; },
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
      return `Based on ${this.pet.chunkGain}`;
    },
    memoryGainTooltip() {
      return `Based on ${this.pet.memoryGain}`;
    },
  },
  methods: {
    update() {
      this.isRaCapped = Ra.totalPetLevel === Ra.levelCap * 4;
      this.pet = this.petConfig.pet;
      const pet = this.pet;
      this.isCapped = pet.level === Ra.levelCap;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.level = pet.level;
      this.memories = pet.memories;
      this.requiredMemories = pet.requiredMemories;
      this.memoryChunks = pet.memoryChunks;
      this.memoryChunksPerSecond = pet.memoryChunksPerSecond;
      this.memoriesPerSecond = pet.memoryChunks * Ra.productionPerMemoryChunk * this.currentMemoryMult;
      this.canGetMemoryChunks = pet.canGetMemoryChunks;
      this.memoryMultiplier = pet.memoryProductionMultiplier;
      this.memoryUpgradeCost = pet.memoryUpgradeCost;
      this.chunkUpgradeCost = pet.chunkUpgradeCost;
      this.memoryUpgradeCapped = pet.memoryUpgradeCapped;
      this.chunkUpgradeCapped = pet.chunkUpgradeCapped;
      this.currentMemoryMult = pet.memoryUpgradeCurrentMult;
      this.currentChunkMult = pet.chunkUpgradeCurrentMult;

      this.nextMemoryUpgradeEstimate = this.timeToGoalString((this.memoryUpgradeCost - this.memories));
      this.nextMemoryChunkUpgradeEstimate = this.timeToGoalString((this.chunkUpgradeCost - this.memories));
    },
    timeToGoalString(expToGain) {
      // Quadratic formula for growth (uses constant growth for a = 0)
      const a = Ra.productionPerMemoryChunk * this.currentMemoryMult * this.memoryChunksPerSecond / 2;
      const b = Ra.productionPerMemoryChunk * this.currentMemoryMult * this.memoryChunks;
      const c = -expToGain;
      const estimate = a === 0
        ? -c / b
        : (Math.sqrt(Math.pow(b, 2) - 4 * a * c) - b) / (2 * a);
      if (Number.isFinite(estimate)) {
        return `in ${TimeSpan.fromSeconds(estimate).toStringShort()}`;
      }
      return "";
    },
    nextUnlockLevel() {
      const missingUpgrades = Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.pet)
        .map(u => u.level)
        .filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    },
    upgradeClassObject(type) {
      const available = type === "memory"
        ? this.memoryUpgradeCost <= this.memories
        : this.chunkUpgradeCost <= this.memories;
      const capped = type === "memory" ? this.memoryUpgradeCapped : this.chunkUpgradeCapped;
      const pet = this.pet;
      return {
        "c-ra-pet-upgrade": true,
        "c-ra-pet-btn--available": available,
        "c-ra-pet-btn--teresa": available && pet.name === "Teresa",
        "c-ra-pet-btn--effarig": available && pet.name === "Effarig",
        "c-ra-pet-btn--enslaved": available && pet.name === "Enslaved",
        "c-ra-pet-btn--v": available && pet.name === "V",
        "c-ra-pet-btn--available__capped": capped,
        "c-ra-pet-btn--teresa__capped": capped && pet.name === "Teresa",
        "c-ra-pet-btn--effarig__capped": capped && pet.name === "Effarig",
        "c-ra-pet-btn--enslaved__capped": capped && pet.name === "Enslaved",
        "c-ra-pet-btn--v__capped": capped && pet.name === "V"
      };
    },
    barStyle(type) {
      const cost = type === "memory" ? this.memoryUpgradeCost : this.chunkUpgradeCost;
      const gone = (type === "memory" && this.memoryUpgradeCapped || type === "chunk" && this.chunkUpgradeCapped)
        ? cost
        : this.memories;
      return {
        width: `${100 * Math.min(1, gone / cost)}%`,
        background: this.pet.color
      };
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">
          {{ name }} Level {{ formatInt(level) }}/{{ formatInt(levelCap) }}
        </div>
        <div v-if="showScalingUpgrade" :key="level">
          {{ scalingUpgradeText }}
        </div>
        <br v-else>
        <div v-if="!isCapped">
          <div>
            {{ name }} has {{ format(memories, 2) }} Memories
          </div>
        </div>
        <div class="l-ra-pet-middle-container" v-if="!isCapped">
          <div class="l-ra-pet-upgrade-container">
            <div class="l-ra-pet-upgrade c-ra-pet-upgrade__top">
              <div
                :class="upgradeClassObject('memory')"
                @click="petConfig.pet.purchaseMemoryUpgrade()"
                style="border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
              >
                <span class="fas fa-brain"></span>
                <div class="c-ra-pet-upgrade__tooltip" v-if="!memoryUpgradeCapped">
                  <div class="c-ra-pet-upgrade__tooltip__name">
                    {{ petConfig.pet.name }}'s Recollection
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__description">
                    Gain {{ formatPercents(0.3) }} more Memories
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__footer">
                    Cost: {{ format(memoryUpgradeCost, 2, 2) }} Memories
                    <span v-if="memories <= memoryUpgradeCost">
                      {{ nextMemoryUpgradeEstimate }}
                    </span>
                    <br>
                    Currently: {{ formatX(currentMemoryMult, 2, 2) }}
                  </div>
                </div>
                <div class="c-ra-pet-upgrade__tooltip" v-else>
                  <div class="c-ra-pet-upgrade__tooltip__name">
                    {{ petConfig.pet.name }}'s Recollection
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__description">
                    Capped: {{ formatX(currentMemoryMult, 2, 2) }}
                  </div>
                </div>
              </div>
              <div class="c-ra-upgrade-bar">
                <div class="c-ra-upgrade-bar__inner" :style="barStyle('memory')"></div>
              </div>
            </div>
            <div class="l-ra-pet-upgrade c-ra-pet-upgrade__bot">
              <div
                :class="upgradeClassObject('chunk')"
                @click="petConfig.pet.purchaseChunkUpgrade()"
                style="border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-right-radius: 0;"
              >
                <span class="fas fa-dice-d6"></span>
                <div class="c-ra-pet-upgrade__tooltip" v-if="!chunkUpgradeCapped">
                  <div class="c-ra-pet-upgrade__tooltip__name">
                    {{ petConfig.pet.name }}'s Fragmentation
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__description">
                    Gain {{ formatPercents(0.5) }} more Memory Chunks
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__footer">
                    Cost: {{ format(chunkUpgradeCost, 2, 2) }} Memories
                    <span v-if="memories <= chunkUpgradeCost">
                      {{ nextMemoryChunkUpgradeEstimate }}
                    </span>
                    <br>
                    Currently: {{ formatX(currentChunkMult, 2, 2) }}
                  </div>
                </div>
                <div class="c-ra-pet-upgrade__tooltip" v-else>
                  <div class="c-ra-pet-upgrade__tooltip__name">
                    {{ petConfig.pet.name }}'s Fragmentation
                  </div>
                  <div class="c-ra-pet-upgrade__tooltip__description">
                    Capped: {{ formatX(currentChunkMult, 2, 2) }}
                  </div>
                </div>
              </div>
              <div class="c-ra-upgrade-bar c-ra-upgrade-bar--bottom">
                <div class="c-ra-upgrade-bar__inner" :style="barStyle('chunk')"></div>
              </div>
            </div>
          </div>
          <ra-pet-level-bar v-if="!isCapped" :petConfig="petConfig" />
        </div>
        <div v-if="!isCapped">
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
        <br v-else-if="!isRaCapped">
        <br v-if="!isRaCapped">
        <div v-else style="margin-bottom: 0.8rem;"></div>
        <div style="display: flex; justify-content: center;">
          <!-- This choice of key forces a UI update every level up -->
          <ra-upgrade-icon v-for="(unlock, i) in unlocks"
            :key="25 * level + i"
            :unlock="unlock" />
        </div>
      </div>
    </div>`
});
