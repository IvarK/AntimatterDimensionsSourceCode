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
      lastTenRunTimers: [],
      petColors: {
        Teresa: "#86ea84",
        Effarig: "#ea8585",
        Enslaved: "#ead584",
        V: "#f1aa7f"
      },
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
    multiLevelStyle() {
      return {
        width: `${Math.min((this.level - 1 + this.exp / this.requiredExp) * this.percentPerLevel, 100)}%`
      };
    },
    singleLevelStyle() {
      return {
        width: `${this.exp / this.requiredExp * 100}%`
      };
    },
    petStyle() {
      return {
        "background-color": this.petColors[this.pet.name]
      };
    },
    currentLevelGoal() {
      if (this.shift) return this.level + 1;
      return this.importantLevels.filter(goal => goal > this.level || goal === 25)[0];
    },
    expPerMin() {
      const avgLvl = this.lastTenGlyphLevls.reduce((acc, value) => acc + value, 0) / 10;
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0) / 10;
      const expGain = Math.pow(2, avgLvl / 500 - 10);
      return Math.round(expGain / (avgTimeMs / 60000));
    },
    activeUnlock() {
      if (this.shift) {
        return {
          description: `Get ${this.pet.name} to level ${this.currentLevelGoal}`,
          reward: `${shorten(Math.floor(this.exp), 2)}/${shorten(this.requiredExp, 2)} exp`,
          expPerMin: `${shorten(this.expPerMin, 2)}/min over last 10 realities`
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
    findUnlockByLevel(lvl) {
      return this.unlocks.find(unlock => unlock.id === this.importantLevels.indexOf(lvl));
    }
  },
  template: `
    <div class="l-ra-bar-container">
      <div class="l-ra-exp-bar">
        <div v-if="shift">
          <ra-lvl-chevron  v-for="lvl in 2"
          :key="currentLevelGoal - 2 + lvl" :level ="currentLevelGoal - 2 + lvl"
          :goal="currentLevelGoal" :singleLevel="true" />
        </div>
        <div v-else>
          <ra-lvl-chevron v-for="lvl in (currentLevelGoal - 1)"
          :key="lvl" :level="lvl" :goal="currentLevelGoal" :unlock="findUnlockByLevel(lvl)" />
        </div>
        <div class="l-ra-exp-bar-inner" :style="[shift ? singleLevelStyle : multiLevelStyle, petStyle]" />
      </div>
        <div class="l-ra-unlock" :style="petStyle">
          <div class="l-ra-unlock-inner">
            <b>{{ activeUnlock.description }}</b>
            <p>{{ activeUnlock.reward }}</p>
            <p v-if="shift">{{ activeUnlock.expPerMin }} </p>
          </div>
        </div>
    </div>
  `
});