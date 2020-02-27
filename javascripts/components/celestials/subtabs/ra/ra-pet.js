"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      level: 0,
      exp: 0,
      requiredExp: 0,
      expGainPerMs: 0,
      nextLevelEstimate: "",
      expBoost: 0,
      lastTenGlyphLevels: [],
      lastTenRunTimers: [],
    };
  },
  computed: {
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    petStyle() {
      return {
        color: this.petConfig.pet.color
      };
    },
    unlocks() {
      return Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.petConfig.pet)
        .sort((a, b) => a.level - b.level);
    },
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.level = pet.level;
      this.exp = pet.exp;
      this.requiredExp = pet.requiredExp;
      this.expBoost = pet.expBoost;
      this.lastTenGlyphLevels = player.lastTenRealities.map(([, , , lvl]) => lvl);
      this.lastTenRunTimers = player.lastTenRealities.map(([, , time]) => time);

      const expGain = this.expBoost * this.lastTenGlyphLevels
        .reduce((acc, level) => acc + Ra.baseExp(level), 0);
      const avgTimeMs = this.lastTenRunTimers.reduce((acc, value) => acc + value, 0);
      this.expGainPerMs = expGain / avgTimeMs;

      const timeToLevel = (this.requiredExp - this.exp) / this.expGainPerMs;
      if (Number.isFinite(timeToLevel)) {
        this.nextLevelEstimate = TimeSpan.fromMilliseconds(timeToLevel).toStringShort(false);
      } else {
        this.nextLevelEstimate = "never";
      }
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ name }} Level {{ formatInt(level) }}</div>
        <div v-if="level >= 2">
          {{ scalingUpgradeText }}
        </div>
        <div>
          {{ format(exp, 2) }} / {{ format(requiredExp, 2) }} {{ name }} memories
        </div>
        <div>
          Gaining {{ format(60000 * expGainPerMs, 2, 2) }} memories/min
        </div>
        <div>
          (next level in {{ nextLevelEstimate }})
        </div>
        <ra-pet-level-bar :pet="petConfig.pet" />
        <ra-upgrade-icon v-for="(unlock, i) in unlocks"
          :key="i"
          :unlock="unlock" />
      </div>
    </div>
  `
});
