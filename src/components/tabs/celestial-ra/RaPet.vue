<script>
import RaPetLevelBar from "./RaPetLevelBar";
import RaUpgradeIcon from "./RaUpgradeIcon";

export default {
  name: "RaPet",
  components: {
    RaUpgradeIcon,
    RaPetLevelBar
  },
  props: {
    petConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRaCapped: false,
      isCapped: false,
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
    pet() {
      return this.petConfig.pet;
    },
    name() {
      return this.pet.name;
    },
    petStyle() {
      return {
        color: this.pet.color
      };
    },
    unlocks() {
      return this.pet.unlocks;
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
      this.isRaCapped = Ra.totalPetLevel === Ra.maxTotalPetLevel;
      const pet = this.pet;
      this.isCapped = pet.level === Ra.levelCap;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
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

      this.nextMemoryUpgradeEstimate = Ra.timeToGoalString(pet, this.memoryUpgradeCost - this.memories);
      this.nextMemoryChunkUpgradeEstimate = Ra.timeToGoalString(pet, this.chunkUpgradeCost - this.memories);
    },
    nextUnlockLevel() {
      const missingUpgrades = this.pet.unlocks
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
        "c-ra-pet-upgrade-memory": type === "memory",
        "c-ra-pet-upgrade-chunk": type === "chunk",
        "c-ra-pet-btn--available": available,
        [`c-ra-pet-btn--${pet.id}`]: available,
        "c-ra-pet-btn--available__capped": capped,
        [`c-ra-pet-btn--${pet.id}__capped`]: capped
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
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="l-ra-pet-container"
  >
    <div
      class="c-ra-pet-header"
      :style="petStyle"
    >
      <div class="c-ra-pet-title">
        <!-- The full name doesn't fit here, so we shorten it as a special case -->
        {{ pet.id === "enslaved" ? "Nameless" : name }} Level {{ formatInt(level) }}/{{ formatInt(levelCap) }}
      </div>
      <div
        v-if="showScalingUpgrade"
        :key="level"
      >
        {{ scalingUpgradeText }}
      </div>
      <br v-else>
      <div v-if="!isCapped">
        <div>
          {{ name }} {{ pet.id === "enslaved" ? "have" : "has" }} {{ quantify("Memory", memories, 2) }}
        </div>
      </div>
      <div
        v-if="!isCapped"
        class="l-ra-pet-middle-container"
      >
        <div class="l-ra-pet-upgrade-container">
          <div class="l-ra-pet-upgrade c-ra-pet-upgrade__top">
            <div
              :class="upgradeClassObject('memory')"
              @click="pet.purchaseMemoryUpgrade()"
            >
              <span class="fas fa-brain" />
              <div
                v-if="!memoryUpgradeCapped"
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Recollection
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Gain {{ formatPercents(0.3) }} more Memories
                </div>
                <div class="c-ra-pet-upgrade__tooltip__footer">
                  Cost: {{ quantify("Memory", memoryUpgradeCost, 2, 2) }}
                  <span v-if="memories <= memoryUpgradeCost">
                    {{ nextMemoryUpgradeEstimate }}
                  </span>
                  <br>
                  Currently: {{ formatX(currentMemoryMult, 2, 2) }}
                </div>
              </div>
              <div
                v-else
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Recollection
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Capped: {{ formatX(currentMemoryMult, 2, 2) }}
                </div>
              </div>
            </div>
            <div class="c-ra-upgrade-bar">
              <div
                class="c-ra-upgrade-bar__inner"
                :style="barStyle('memory')"
              />
            </div>
          </div>
          <div class="l-ra-pet-upgrade c-ra-pet-upgrade__bottom">
            <div
              :class="upgradeClassObject('chunk')"
              @click="pet.purchaseChunkUpgrade()"
            >
              <span class="fas fa-dice-d6" />
              <div
                v-if="!chunkUpgradeCapped"
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Fragmentation
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Gain {{ formatPercents(0.5) }} more Memory Chunks
                </div>
                <div class="c-ra-pet-upgrade__tooltip__footer">
                  Cost: {{ quantify("Memory", chunkUpgradeCost, 2, 2) }}
                  <span v-if="memories <= chunkUpgradeCost">
                    {{ nextMemoryChunkUpgradeEstimate }}
                  </span>
                  <br>
                  Currently: {{ formatX(currentChunkMult, 2, 2) }}
                </div>
              </div>
              <div
                v-else
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Fragmentation
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Capped: {{ formatX(currentChunkMult, 2, 2) }}
                </div>
              </div>
            </div>
            <div class="c-ra-upgrade-bar c-ra-upgrade-bar--bottom">
              <div
                class="c-ra-upgrade-bar__inner"
                :style="barStyle('chunk')"
              />
            </div>
          </div>
        </div>
        <RaPetLevelBar
          v-if="!isCapped"
          :pet-config="petConfig"
        />
      </div>
      <div v-if="!isCapped">
        <div>
          {{ quantify("Memory Chunk", memoryChunks, 2, 2) }}, {{ quantify("Memory", memoriesPerSecond, 2, 2) }}/sec
        </div>
        <div>
          Gaining {{ quantify("Memory Chunk", memoryChunksPerSecond, 2, 2) }}/sec
          <span :ach-tooltip="chunkTooltip">
            <i class="fas fa-question-circle" />
          </span>
        </div>
      </div>
      <div v-if="memoryMultiplier > 1 && !isRaCapped">
        Multiplying all Memory production by {{ format(memoryMultiplier, 2, 3) }}
        <span :ach-tooltip="memoryGainTooltip">
          <i class="fas fa-question-circle" />
        </span>
      </div>
      <br v-else-if="!isRaCapped">
      <br v-if="!isRaCapped">
      <div
        v-else
        class="l-ra-pet-postcompletion-spacer"
      />
      <div class="l-ra-pet-milestones">
        <!-- This choice of key forces a UI update every level up -->
        <RaUpgradeIcon
          v-for="(unlock, i) in unlocks"
          :key="25 * level + i"
          :unlock="unlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-ra-pet-milestones {
  display: flex;
  justify-content: center;
}

.c-ra-pet-upgrade-memory {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.c-ra-pet-upgrade-chunk {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.l-ra-pet-postcompletion-spacer {
  margin-bottom: 0.8rem;
}
</style>
