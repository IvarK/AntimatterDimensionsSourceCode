"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    petColor() {
      return this.pet.color;
    },
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    petStyle() {
      return {
        color: this.petColor
      };
    },
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.level = pet.level;
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ pet.name }} Lvl. {{ level }}</div>
        <div v-if="level >= 2">{{ scalingUpgradeText }}</div>
      </div>
      <ra-pet-level-bar :petConfig="this.petConfig" />
    </div>
  `
});
// <div>Memory gain: {{ expBoost.toFixed(2) }}x </div>