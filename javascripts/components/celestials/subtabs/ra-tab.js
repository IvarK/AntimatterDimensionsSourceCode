"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      celestialNames: ["Teresa", "Effarig", "Enslaved", "V"],
      fillPercentage: ["", "", "", ""],
      exp: [0, 0, 0, 0],
      expMults: [1, 1, 1, 1],
      expRequired: [0, 0, 0, 0],
      level: [0, 0, 0, 0],
      unlocks: [],
      realityReward: 0,
      activeMode: false
    };
  },
  methods: {
    update() {
      this.exp = [Ra.teresaExp, Ra.effarigExp, Ra.enslavedExp, Ra.vExp];
      this.expMults = [Ra.teresaExpBoost, Ra.effarigExpBoost, Ra.enslavedExpBoost, Ra.vExpBoost];
      this.level = [Ra.teresaLevel, Ra.effarigLevel, Ra.enslavedLevel, Ra.vLevel];
      this.expRequired = this.level.map(level => Ra.requiredExp(level));
      this.fillPercentage = [];
      for (let i = 0; i < 4; i++) {
        this.fillPercentage.push(`${100 * this.exp[i] / this.expRequired[i]}%`);
      }
      this.unlocks = player.celestials.ra.unlocks;
      this.realityReward = Ra.realityReward;
      this.activeMode = player.celestials.ra.activeMode;
    },
    has(id) {
      return this.unlocks.includes(id);
    },
    startRun() {
      Ra.startRun();
    },
    toggleMode() {
      Ra.toggleMode();
    },
    scalingUpgradeText() {
      const teresaScale = `You can charge ${Math.floor(this.level[0] / 2)} Infinity Upgrades.`;
      const effarigScale = `Glyph rarity +${this.level[1]}% and +${Math.floor(this.level[1] / 5)} additional choices.`;
      const enslavedScale = `Stored game time ^${(1 + 0.01 * Math.floor(this.level[2])).toFixed(2)}, ` +
        `stored real time efficiency +${this.level[2]}% and +${this.level[2] / 2} hours maximum.`;
      const vScale = `+${Math.floor(this.level[3] / 5)} additional EC completions available ` + 
        `(next at Level ${5 * (1 + Math.floor(this.level[3] / 5))})`;
      return [teresaScale, effarigScale, enslavedScale, vScale];
    }
  },
  computed: {
    raUnlocks() {
      return RA_UNLOCKS;
    },
    availableCelestials() {
      const nonZero = this.level.filter(level => level > 0);
      const available = [];
      for (let i = 0; i < nonZero.length; i++) {
        available.push(i);
      }
      return available;
    }
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="l-ra-teresa-container" v-for="index in availableCelestials">
        <h2>{{ celestialNames[index] }}</h2>
        <p>Level {{ level[index] }}</p>
        <div class="c-ra-teresa-experience">
          <div class="c-ra-teresa-experience-inner" :style="{ 'width': fillPercentage[index] }">
            <b class="o-ra-exp-display">{{ shortenSmallInteger(exp[index]) }}/{{ shortenSmallInteger(expRequired[index]) }}</b>
          </div>
        </div>
        <div v-if="level[index] >= 2">{{ scalingUpgradeText()[index] }}</div>
        <div>Memory gain: {{ expMults[index].toFixed(2) }}x </div>
      </div>
      <div class="l-ra-unlocks-container">
        <div class="c-ra-unlock" v-for="unlock in raUnlocks" :class="{'c-ra-unlock-unlocked': has(unlock.id)}">
          <b>{{ unlock.description }}</b>
          <p>Reward: {{ unlock.reward }}</p>
        </div>
      </div>
      <button v-if="has(1)" @click="startRun()" class="o-v-run-button">
        Start Ra's Reality, you can't dimension boost and tick reduction is forced to be 11%.
        <br><br>
        Multiply Teresa memory gain based on highest EP reached, Currently: {{ shorten(realityReward, 2, 2)}}x
      </button>
    </div>`
});