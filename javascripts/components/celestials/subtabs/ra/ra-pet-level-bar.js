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
    importantLevels: () => [2, 5, 8, 10, 15, 25],
    unlocks() {
      return Object.values(RA_UNLOCKS).filter(unlock => unlock.pet === this.pet);
    },
    multiLevelStyle() {
      return {
        width: `${100 * (Ra.totalExpForLevel(this.level) + this.exp) / Ra.totalExpForLevel(this.importantGoal)}%`
      };
    },
    singleLevelStyle() {
      return {
        width: `${100 * this.exp / this.requiredExp}%`
      };
    },
    petStyle() {
      return {
        "background-color": this.pet.color
      };
    },
    importantGoal() {
      return this.importantLevels.find(goal => goal > this.level || goal === 25);
    },
    currentLevelGoal() {
      if (this.shiftDown) return this.level + 1;
      return this.importantGoal;
    },
    activeUnlock() {
      return this.unlocks.find(unlock => unlock.level === this.importantGoal);
    }
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
    findUnlockByLevel(level) {
      return this.unlocks.find(unlock => unlock.level === level);
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
            :unlock="findUnlockByLevel(lvl)"
            :isImportantLevel="isImportant(lvl)"
          />
        </div>
        <div class="l-ra-exp-bar-inner" :style="[shiftDown ? singleLevelStyle : multiLevelStyle, petStyle]" />
      </div>
    </div>
  `
});
