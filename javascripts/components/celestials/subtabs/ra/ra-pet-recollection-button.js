"use strict";

Vue.component("ra-pet-recollection-button", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      hasRecollection: false,
    };
  },
  computed: {
    petStyle() {
      return {backgroundColor: this.petConfig.pet.color};
    }
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.hasRecollection = pet.hasRecollection;
    },
    turnOnRecollection() {
      Ra.petWithRecollection = this.petConfig.pet.name;
    }
  },
  template: `
    <div class="l-ra-pet-recollection-div" v-if="isUnlocked && hasRecollection" :style="petStyle">
      Recollection given to {{ name }}
    </div>
    <button class="l-ra-pet-recollection-button" v-else-if="isUnlocked" @click="turnOnRecollection" style="color: grey;">
      Give recollection to {{ name }}
    </button>
  `
});