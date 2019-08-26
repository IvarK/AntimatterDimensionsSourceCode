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
      const avgLvl = this.lastTenGlyphLevls.reduce((acc, value) => acc + value, 0) / 10;
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0) / 10;
      const expGain = Math.pow(2, avgLvl / 500 - 10) * this.expBoost;
      return Math.round(expGain / (avgTimeMs / 60000));
    },
    experienceInformation() {
      return `${shorten(this.exp, 2)}/${shorten(this.requiredExp, 2)} memories - ${shorten(this.expPerMin, 2)} memories/min`;
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
      this.lastTenGlyphLevls = player.lastTenRealities.map(([, , , lvl]) => lvl);
      this.lastTenRunTimers = player.lastTenRealities.map(([, , time]) => time);
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ pet.name }} Lvl. {{ level }}</div>
        <div v-if="level >= 2">{{ scalingUpgradeText }}</div>
        <div>{{ experienceInformation }}</div>
      </div>
      <ra-pet-level-bar :pet="pet" />
    </div>
  `
});
