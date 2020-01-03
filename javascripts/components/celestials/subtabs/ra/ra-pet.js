"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      exp: 0,
      requiredExp: 0,
      expBoost: 0,
      lastTenGlyphLevels: [],
      lastTenRunTimers: [],
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    petStyle() {
      return {
        color: this.pet.color
      };
    },
    expPerMin() {
      const expGain = this.lastTenGlyphLevels.reduce((acc, value) =>
        acc + Math.pow(2, value / 500 - 10), 0
      ) * this.expBoost / 10;
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0) / 10;
      return Math.round(expGain / (avgTimeMs / 60000));
    },
    experienceInformation() {
      return `${format(this.exp, 2)}/${format(this.requiredExp, 2)}
        memories - ${format(this.expPerMin, 2)} memories/min`;
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.level = pet.level;
      this.expBoost = pet.expBoost;
      this.exp = pet.exp;
      this.requiredExp = pet.requiredExp;
      this.lastTenGlyphLevels = player.lastTenRealities.map(([, , , lvl]) => lvl);
      this.lastTenRunTimers = player.lastTenRealities.map(([, , time]) => time);
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ pet.name }} Lvl. {{ formatInt(level) }}</div>
        <div v-if="level >= 2">{{ scalingUpgradeText }}</div>
        <div>{{ experienceInformation }}</div>
      </div>
      <ra-pet-level-bar :pet="pet" />
    </div>
  `
});
