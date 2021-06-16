"use strict";

Vue.component("ra-pet-level-bar", {
  props: {
    petConfig: Object
  },
  data() {
    return {
      pet: {},
      isUnlocked: false,
      level: 0,
      memories: 0,
      requiredMemories: 0,
      nextLevelEstimate: 0,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    unlocks() {
      return Object.values(RA_UNLOCKS).filter(unlock => unlock.pet === this.pet);
    },
    importantLevels() {
      return this.unlocks.map(u => u.level);
    },
    barStyle() {
      return {
        width: `${100 * Math.min(1, this.memories / this.requiredMemories)}%`,
        background: this.pet.color
      };
    },
    petStyle() {
      return {
        "background-color": this.pet.color
      };
    },
    prevGoal() {
      const currentUpgrades = this.importantLevels.filter(goal => goal <= this.level);
      return Math.clampMax(currentUpgrades.max(), 15);
    },
    nextGoal() {
      const missingUpgrades = this.importantLevels.filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    },
    currentLevelGoal() {
      return this.level + 1;
    },
    classObject() {
      const available = this.memories >= this.requiredMemories;
      const pet = this.pet;
      return {
        "c-ra-level-up-btn": true,
        "c-ra-pet-btn--available": available,
        "c-ra-pet-btn--teresa": available && pet.name === "Teresa",
        "c-ra-pet-btn--effarig": available && pet.name === "Effarig",
        "c-ra-pet-btn--enslaved": available && pet.name === "Enslaved",
        "c-ra-pet-btn--v": available && pet.name === "V"
      };
    },
    nextUnlock() {
      const unlock = Object.values(RA_UNLOCKS).find(unl => unl.pet === this.pet && unl.level === this.level + 1);
      return unlock ? unlock : false;
    },
    showNextScalingUpgrade() {
      switch (this.pet.name) {
        case "Teresa":
          return Math.min(12, Math.floor(this.level / 2)) !== Math.min(12, Math.floor((this.level + 1) / 2));
        case "Effarig":
          return AlchemyResources.all.filter(res => res.unlockedAt === this.level + 1).length > 0;
        case "Enslaved":
          return true;
        case "V":
          return Math.clampMax(Math.floor(this.level / 5), 4) !== Math.clampMax(Math.floor((this.level + 1) / 5), 4);
        default:
          return false;
      }
    },
    nextScalingUpgrade() {
      const effarigAlchemyResource = AlchemyResources.all.filter(res => res.unlockedAt === this.level + 1)[0];
      switch (this.pet.name) {
        case "Teresa":
          return "You can charge an additional Infinity Upgrade";
        case "Effarig":
          return `Unlock the ${effarigAlchemyResource.name} resource in Glyph Alchemy, which
          ${effarigAlchemyResource.description}`;
        case "Enslaved":
          return `+${formatFloat(0.01, 2)} to stored game time power,
            and you can store an additional hour of real time`;
        case "V":
          return "You can purchase an additional Triad Study";
        default:
          return "false";
      }
    },
    reward() {
      return (typeof this.nextUnlock.reward === "function") ? this.nextUnlock.reward() : this.nextUnlock.reward;
    }
  },
  methods: {
    update() {
      this.pet = this.petConfig.pet;
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.memories = pet.memories;
      this.level = pet.level;
      this.requiredMemories = pet.requiredMemories;
      this.nextLevelEstimate = this.timeToGoalString((this.requiredMemories - this.memories));
    },
    isImportant(level) {
      return this.importantLevels.includes(level);
    },
    // TODO: this exact segment is used in another place, we should really make this a function somewhere in Ra
    timeToGoalString(expToGain) {
      const pet = this.pet;
      // Quadratic formula for growth (uses constant growth for a = 0)
      const a = Ra.productionPerMemoryChunk() * pet.memoryUpgradeCurrentMult * pet.memoryChunksPerSecond / 2;
      const b = Ra.productionPerMemoryChunk() * pet.memoryUpgradeCurrentMult * pet.memoryChunks;
      const c = -expToGain;
      const estimate = a === 0
        ? -c / b
        : (Math.sqrt(Math.pow(b, 2) - 4 * a * c) - b) / (2 * a);
      if (Number.isFinite(estimate)) {
        return `in ${TimeSpan.fromSeconds(estimate).toStringShort()}`;
      }
      return "";
    },
  },
  template: `
    <div class="l-ra-bar-container">
      <div class="c-ra-exp-bar">
        <div class="c-ra-exp-bar-inner" :style="barStyle"></div>
      </div>
      <div
        :class="classObject"
        @click="pet.levelUp()"
      >
        <span class="fas fa-arrow-up"></span>
        <div class="c-ra-pet-upgrade__tooltip">
          <div class="c-ra-pet-upgrade__tooltip__name">
            Level {{ pet.name }} to {{ formatInt(this.level + 1) }}
          </div>
          <div class="c-ra-pet-upgrade__tooltip__description">
            {{ reward }}
            <div v-if="showNextScalingUpgrade" :style="{ 'margin-top': nextUnlock.reward ? '0.6rem' : '0' }">
              {{ nextScalingUpgrade }}
            </div>
          </div>
          <div class="c-ra-pet-upgrade__tooltip__footer">
            Cost: {{ format(requiredMemories, 2, 2) }} Memories
            <span v-if="memories <= requiredMemories">{{ nextLevelEstimate }}</span>
          </div>
        </div>
      </div>
    </div>`
});
