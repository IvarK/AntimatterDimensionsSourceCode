"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      exp: 0,
      requiredExp: 0,
      expBoost: 0
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    fillPercentage() {
      return `${100 * this.exp / this.requiredExp}%`;
    },
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    styleObject() {
      return {
        width: this.fillPercentage
      };
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
      this.expBoost = pet.expBoost;
    }
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <h2>{{ pet.name }}</h2>
      <p>Level {{ level }}</p>
      <div class="c-ra-pet-experience">
        <div class="c-ra-pet-experience-inner" :style="styleObject">
          <b class="o-ra-pet-exp-display">{{ shortenSmallInteger(exp) }}/{{ shortenSmallInteger(requiredExp) }}</b>
        </div>
      </div>
      <div v-if="level >= 2">{{ scalingUpgradeText }}</div>
      <div>Memory gain: {{ expBoost.toFixed(2) }}x </div>
    </div>
  `
});
