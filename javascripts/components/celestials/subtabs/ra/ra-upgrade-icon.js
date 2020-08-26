"use strict";

Vue.component("ra-upgrade-icon", {
  props: {
    unlock: Object,
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      icon: "",
      description: "",
      petName: ""
    };
  },
  computed: {
    update() {
      this.isUnlocked = Ra.has(this.unlock);
      this.level = this.unlock.level;
      this.icon = this.unlock.displayIcon;
      const rewardText = typeof this.unlock.reward === "function"
        ? this.unlock.reward()
        : this.unlock.reward;
      this.description = `Level ${this.level}: ${rewardText}`;
      this.petName = this.unlock.pet.name;
    },
    classObject() {
      return {
        "c-ra-upgrade-icon": true,
        "c-ra-upgrade-icon--inactive": !this.isUnlocked,
        "c-ra-upgrade-icon--teresa": this.petName === "Teresa",
        "c-ra-upgrade-icon--effarig": this.petName === "Effarig",
        "c-ra-upgrade-icon--enslaved": this.petName === "Enslaved",
        "c-ra-upgrade-icon--v": this.petName === "V"
      };
    }
  },
  template: `
    <div
      v-html="icon"
      :ach-tooltip="description"
      :class="classObject">
    </div>
  `
});
