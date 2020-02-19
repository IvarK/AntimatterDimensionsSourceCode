"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      expGain: 0,
      nextLevelEstimate: "",
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
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.level = pet.level;
      this.expBoost = pet.expBoost;
      this.lastTenGlyphLevels = player.lastTenRealities.map(([, , , lvl]) => lvl);
      this.lastTenRunTimers = player.lastTenRealities.map(([, , time]) => time);

      const expGain = this.expBoost * this.lastTenGlyphLevels
        .reduce((acc, value) => acc + Ra.pets.teresa.baseExp(value), 0);
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0);
      this.expGain = expGain / (avgTimeMs / 1000);
      
      const timeSpanToLevel = TimeSpan.fromSeconds(pet.requiredExp / this.expGain);
      if (Number.isFinite(timeSpanToLevel.years)) {
        this.nextLevelEstimate = TimeSpan.fromSeconds(pet.requiredExp / this.expGain).toStringShort(false);
      } else {
        this.nextLevelEstimate = "never";
      }
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ pet.name }} Lvl. {{ formatInt(level) }}</div>
        <div v-if="level >= 2">
          {{ scalingUpgradeText }}
        </div>
        <div>
          {{ format(pet.exp, 2) }} / {{ format(pet.requiredExp, 2) }} {{ pet.name }} memories
        </div>
        <div>
          Gaining {{ format(60 * expGain, 2, 2) }} memories/min
        </div>
        <div>
          (next level in {{ nextLevelEstimate }})
        </div>
      </div>
      <ra-pet-level-bar :pet="pet" />
    </div>
  `
});
