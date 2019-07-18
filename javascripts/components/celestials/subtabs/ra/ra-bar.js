"use strict";

Vue.component("ra-bar", {
  props: {
    petConfig: Object
  },
  data() {
    return {
      importantLevels: [2, 3, 5, 10, 15, 25],
      isUnlocked: false,
      level: 0,
      exp: 0,
      requiredExp: 0,
      expBoost: 0,
      shift: false,
      lastTenGlyphLevls: [],
      lastTenRunTimers: []
    };
  },
  computed: {
    allUnlocks() {
      return RA_UNLOCKS;
    },
    pet() {
      return this.petConfig.pet;
    },
    unlocks() {
      return this.petConfig.unlocks(this.allUnlocks);
    },
    percentPerLevel() {
      return 100 / (this.currentLevelGoal - 1);
    },
    fillPercentage() {
      return `${Math.min((this.level - 1 + this.exp / this.requiredExp) * this.percentPerLevel, 100)}%`;
    },
    multiLevelStyle() {
      return {
        width: this.fillPercentage
      };
    },
    singleLevelStyle() {
      return {
        width: `${this.exp / this.requiredExp * 100}%`
      };
    },
    currentLevelGoal() {
      if (this.shift) return this.level + 1;
      return this.importantLevels.filter(goal => goal > this.level)[0] || this.level + 1;
    },
    expPerMin() {
      const avgLvl = this.lastTenGlyphLevls.reduce((acc, value) => acc + value, 0) / 10;
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0) / 10;
      const expGain = Math.pow(2, avgLvl / 500 - 10);
      return Math.round(expGain / (avgTimeMs / 60000));
    },
    activeUnlock() {
      if (this.shift || this.currentLevelGoal > 25) {
        return {
          description: `Get ${this.pet.name} to level ${this.currentLevelGoal}`,
          reward: `${formatWithCommas(Math.floor(this.exp))}/${formatWithCommas(this.requiredExp)} exp`,
          expPerMin: `${formatWithCommas(this.expPerMin)}/min over last 10 realities`
        };
      }
      return this.unlocks.find(unlock => unlock.id % 6 === this.importantLevels.indexOf(this.currentLevelGoal));
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.exp = pet.exp;
      this.expBoost = pet.expBoost;
      this.level = pet.level;
      this.requiredExp = pet.requiredExp;
      this.shift = shiftDown;
      this.lastTenGlyphLevls = player.lastTenRealities.map(([, , , lvl]) => lvl);
      this.lastTenRunTimers = player.lastTenRealities.map(([, , time]) => time);
    },
    has(id) {
      return player.celestials.ra.unlocks.includes(id);
    },
    levelPosition(lvl) {
      return {
        left: `${(this.percentPerLevel * (lvl - 1) - (lvl === 1 ? 0 : 1)) -
          (lvl === this.currentLevelGoal ? Math.floor(Math.log10(lvl)) + 1.1 : 0)}%`,
      };
    },
    levelDisplay(lvl) {
      if (lvl === 1 || lvl === this.currentLevelGoal) return lvl;
      return `│ ${lvl}`;
    },
    isImportantLevel(lvl) {
      return this.importantLevels.includes(lvl);
    },
    findUnlockByLevel(lvl) {
      return this.unlocks.find(unlock => unlock.id === this.importantLevels.indexOf(lvl));
    }
  },
  template: `
    <div class="l-ra-bar-container">
      <div class="l-ra-exp-bar">
        <div v-for="lvl in (currentLevelGoal - 1)"
        v-if="!shift"
        class="l-ra-lvl-chevron"
        :style="levelPosition(lvl)"
        :class="isImportantLevel(lvl) ? 'c-important-chevron' : '' ">
          <span>
            {{levelDisplay(lvl)}}
          </span>
        </div>
        <div class="l-ra-exp-bar-inner" :style="shift ? singleLevelStyle : multiLevelStyle"/>
      </div>
        <div class="l-ra-unlock">
          <div class="l-ra-unlock-inner">
            <b>{{ activeUnlock.description }}</b>
            <p>{{ activeUnlock.reward }}</p>
            <p v-if="shift">{{ activeUnlock.expPerMin }} </p>
          </div>
        </div>
    </div>
  `
});
// <span class="infotooltiptext" v-if="isImportantLevel(lvl)">
//   {{findUnlockByLevel(lvl).reward}}
// </span>