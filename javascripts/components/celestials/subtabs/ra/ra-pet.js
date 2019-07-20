"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      petColors: {
        Teresa: "#86ea84",
        Effarig: "#ea8585",
        Enslaved: "#ead584",
        V: "#f1aa7f"
      },
      isUnlocked: false,
      level: 0,
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
        color: this.petColors[this.pet.name]
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
      <ra-bar :petConfig="this.petConfig" />
    </div>
  `
});
// <div>Memory gain: {{ expBoost.toFixed(2) }}x </div>