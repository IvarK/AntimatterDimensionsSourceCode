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
      exp: 0,
      requiredExp: 0,
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
        width: `${100 * Math.min(1, this.exp / this.requiredExp)}%`,
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
      const available = this.exp >= this.requiredExp;
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
      const unlock = Object.values(RA_UNLOCKS)
      .filter(unl => unl.pet === this.pet && unl.level === this.level + 1)[0];
      if (unlock) return unlock;
      return false;
    },
    showNextScalingUpgrade() {
      if (this.pet.name === "Teresa") {
        const before = Math.min(12, Math.floor(this.level / 2));
        const after = Math.min(12, Math.floor((this.level + 1) / 2));
        return before !== after;
      }
      if (this.pet.name === "Effarig") {
        return AlchemyResources.all.filter(
          res => parseInt(res._config.lockText.match(/\d+/gu)[0], 10) === this.level + 1).length > 0;
      }
      if (this.pet.name === "Enslaved") {
        return true;
      }
      if (this.pet.name === "V") {
        const before = Math.clampMax(Math.floor(this.level / 5), 4);
        const after = Math.clampMax(Math.floor((this.level + 1) / 5), 4);
        return before !== after;
      }
      return false;
    },
    nextScalingUpgrade() {
      if (this.pet.name === "Teresa") {
        return "You can charge an additional Infinity Upgrade";
      }
      if (this.pet.name === "Effarig") {
        return `Unlock the ${AlchemyResources.all.filter(
          res => parseInt(res._config.lockText.match(/\d+/gu)[0], 10) === this.level + 1
        )[0]._config.name} resource in Glyph Alchemy`;
      }
      if (this.pet.name === "Enslaved") {
        return `+${formatFloat(0.01, 2)} to stored game time power, and you can store an additional hour of real time`;
      }
      if (this.pet.name === "V") {
        return "You can purchase an additional Triad Study";
      }
      return "false";
    }
  },
  methods: {
    update() {
      this.pet = this.petConfig.pet;
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.exp = pet.exp;
      this.level = pet.level;
      this.requiredExp = pet.requiredExp;
    },
    isImportant(level) {
      return this.importantLevels.includes(level);
    }
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
          <div class="c-ra-pet-upgrade__tooltip__name">Level {{ pet.name }} to {{ formatInt(this.level + 1) }}</div>
          <div class="c-ra-pet-upgrade__tooltip__description">
            {{ nextUnlock.reward }}
            <div v-if="showNextScalingUpgrade" :style="{ 'margin-top': nextUnlock.reward ? '0.6rem' : '0' }">
              {{ nextScalingUpgrade }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});
