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
      const thisLevelFill = this.exp * Ra.requiredExpForLevel(this.level + 1) / Ra.requiredExpForLevel(this.level);
      return {
        width: `${100 * Math.sqrt(
          Math.clampMax(
            (Ra.totalExpForLevel(this.level) + thisLevelFill) / Ra.totalExpForLevel(this.nextGoal), 1
          )
        )}%`
      };
    },
    singleLevelStyle() {
      return {
        width: `${100 * (this.exp / this.requiredExp)}%`
      };
    },
    petStyle() {
      return {
        "background-color": this.pet.color
      };
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
            :level ="currentLevelGoal - 2 + lvl"
            :goal="currentLevelGoal"
            :singleLevel="true"
            :isImportantLevel="isImportant(lvl)"
          />
        </div>
        <div v-else>
          <ra-level-chevron v-for="lvl in currentLevelGoal"
            :key="lvl"
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
