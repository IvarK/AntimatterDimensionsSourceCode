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
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ pet.name }} Lvl. {{ level }}</div>
        <div v-if="level >= 2">{{ scalingUpgradeText }}</div>
      </div>
      <ra-pet-level-bar :pet="pet" />
    </div>
  `
});
