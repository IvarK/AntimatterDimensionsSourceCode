"use strict";

Vue.component("ra-pet-level-bar", {
  props: {
    pet: Object
  },
  data() {
    return {
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
    multiLevelStyle() {
      if (Notations.current.name === "Blind") return { width: "0%" };
      const startScl = Math.sqrt(Ra.totalExpForLevel(this.prevGoal));
      const endScl = Math.sqrt(Ra.totalExpForLevel(this.nextGoal));
      const currentScl = Math.sqrt(Ra.totalExpForLevel(this.level) + this.exp);
      const expFraction = (currentScl - startScl) / (endScl - startScl);
      return {
        width: `${100 * Math.clampMax(expFraction, 1)}%`
      };
    },
    singleLevelStyle() {
      if (Notations.current.name === "Blind") return { width: "0%" };
      return {
        width: `${100 * (this.exp / this.requiredExp)}%`
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
      if (this.shiftDown) return this.level + 1;
      return this.nextGoal;
    },
  },
  methods: {
    update() {
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
      <div class="l-ra-exp-bar">
        <div v-if="shiftDown">
          <ra-level-chevron v-for="lvl in 2"
            :key="currentLevelGoal - 2 + lvl"
            :level="currentLevelGoal - 2 + lvl"
            :goal="currentLevelGoal"
            :singleLevel="true"
            :isImportantLevel="isImportant(lvl)"
          />
        </div>
        <div v-else>
          <ra-level-chevron v-for="lvl in currentLevelGoal"
            :key="lvl"
            :minLevel="prevGoal"
            :level="lvl"
            :goal="currentLevelGoal"
            :isImportantLevel="isImportant(lvl)"
          />
        </div>
        <div class="l-ra-exp-bar-inner" :style="[shiftDown ? singleLevelStyle : multiLevelStyle, petStyle]" />
      </div>
    </div>
  `
});
